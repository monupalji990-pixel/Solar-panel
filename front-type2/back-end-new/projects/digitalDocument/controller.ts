const mongoose = require('mongoose');
const fs = require('fs');
const { ObjectId } = mongoose.Types;
const hummus = require('hummus');
const PDFDocument = require('pdf-lib').PDFDocument;
const _ = require("lodash");
const moment = require('moment');
import TemplateModel from "../../models/Templates";
import DocumentTimelineModel from "../../models/DocumentTimeline";
import { Request, Response } from "../../templates/commandInterface";
import aws from "../../sharedModules/smallModules/aws";
import CompanyModel from "../../models/Company";
import RenewalModel from "../../models/Renewal";
import SiteModel from "../../models/Site";
import HistoryModel from "../../models/History";
import QuoteModel from "../../models/Quotes";
class AdminController {
    async generatePopulatedPdf(req: Request, res: Response) {
        try {
            if (!req.body.type) {
                throw { message: "type required" };
            }
            if (!req.body.templateId) {
                throw { message: "Template Id required" };
            }
            if (req.body.type == 'company' && !req.body.siteId) {
                throw { message: "Site Id required" }
            }
            else if (req.body.type == 'company' && !req.body.companyId) {
                throw { message: "Company Id required" };
            } else if (req.body.type == 'quote' && !req.body.quoteId) {
                throw { message: "Quote Id required" };
            } else if (req.body.type == 'renewal' && !req.body.renewalId) {
                throw { message: "Renewal Id required" };
            }
            let template = await TemplateModel.findOne({ _id: req.body.templateId }).select('url mapper serviceType templateName').lean();
            let company_or_quote = null;

            if (req.body.type === "company") {

                company_or_quote = await CompanyModel.findOne({ _id: req.body.companyId }).lean();
                company_or_quote.Site = await SiteModel.findOne({ _id: req.body.siteId }).populate("User").lean();
            } else if (req.body.type === "quote") {
                company_or_quote = await QuoteModel.findOne({ _id: req.body.quoteId }).populate({
                    path: "Site",
                    populate: {
                        path: "User"
                    }
                })
                    .populate({ path: "Company" })
                    .lean();
                if (template?.serviceType !== company_or_quote?.serviceType)
                    throw { message: `Service type doesn't match for Quote :${company_or_quote.QuoteID} and Template : ${template?.templateName}` };
            }
            else if (req.body.type === "renewal") {
                company_or_quote = await RenewalModel.findOne({ _id: req.body.renewalId }).populate({
                    path: "Site",
                    populate: {
                        path: "User"
                    }
                })
                    .populate({ path: "Company" })
                    .lean();
                if (template?.serviceType !== company_or_quote?.serviceType)
                    throw { message: `Service type doesn't match for Renewal :${company_or_quote.RenewalID} and Template : ${template?.templateName}` };

            }
            let filepath = `${__dirname}/${req.user._id}_${template.url.replace(process.env.AWS_FILE_BASE_URL, '')}`;

            await aws.s3FileDownloadToDir(filepath, template.url, req, res)
            const formPdfBytes = fs.readFileSync(filepath);
            const pdfDoc = await PDFDocument.load(formPdfBytes);
            const form = pdfDoc.getForm();
            console.log(template.mapper);
            form.getFields().forEach(field => {
                const type = field.constructor.name
                const name = field.getName()
                if (type === 'PDFTextField') {
                    if (template.mapper[name] && template.mapper[name] != 'NA') {
                        console.log(template.mapper[name], _.get(company_or_quote, template.mapper[name]), typeof _.get(company_or_quote, template.mapper[name]));
                        if ((typeof _.get(company_or_quote, template.mapper[name]) == 'number' || typeof _.get(company_or_quote, template.mapper[name]) == 'object') && (/.*date.*/i.test(template.mapper[name]) || /.*dob.*/i.test(template.mapper[name]))) {
                            let dateStr = moment(_.get(company_or_quote, template.mapper[name])).format('DD/MM/YYYY')
                            if (dateStr)
                                field.setText(String(dateStr));
                        }
                        else if (typeof _.get(company_or_quote, template.mapper[name]) == 'number') {
                            field.setText(String(_.get(company_or_quote, template.mapper[name])));
                        } else
                            field.setText(_.get(company_or_quote, template.mapper[name]))
                    }
                    field.enableReadOnly();
                }
            })
            if (fs.existsSync(filepath))
                fs.unlinkSync(filepath);

            let pdfBytes = await pdfDoc.saveAsBase64();
            res.send({ success: true, data: pdfBytes, message: "Pdf generated successfully." });

        } catch (error) {
            console.log(error);
            res.send({ success: false, message: error.message });
        }
    }
    async makeReadOnlyPdfFormFields(req: Request, res: Response) {
        try {
            if (req['fileValidationError']) {
                throw { message: req['fileValidationError'] };
            }
            if (!req.body.digitalDocumentId)
                throw { message: "Digital document id required" }
            let document = await DocumentTimelineModel.findOne({ _id: req.body.digitalDocumentId });
            if (document.receivedDocumentUrl) {
                throw { message: "Already has signed document." }
            }

            const pdfDoc = await PDFDocument.load(req.file.buffer);
            const form = pdfDoc.getForm();

            form.getFields().forEach(field => {
                field.enableReadOnly();
            })
            let pdfBytes = await pdfDoc.saveAsBase64();
            let awsResp = await aws.putBase64({ body: { filename: req.file.originalname, data: pdfBytes, contentType: req.file.mimetype }, user: { _id: req.user._id } }, res, null, false);
            if (awsResp?.Location) {
                document.receivedDocumentUrl = awsResp?.Location;
                document.receivedDocumentTimestamp = new Date();
                document.status = "Received";
                document.receivedFileName = req.file.originalname;
                let history = new HistoryModel();

                history.field = "Document Received";
                history.previousValue = "";
                history.currentValue = "Document Received Successfully";
                history.addedBy = req.user._id;
                if (document.companyId) {
                    history.Company = document.companyId;
                    await history.save();
                }
                if (document.quoteId) {
                    history.Quote = document.quoteId;
                    await history.save();
                }
                if (document.renewalId) {
                    history.Renewal = document.renewalId;
                    await history.save();
                }
            }
            await document.save();
            res.send({ success: true, message: "Signed document attached successfully", data: document });
        } catch (error) {
            console.log(error);
            res.send({ success: false, message: error.message });
        }
    }
    async savePdf(req: Request, res: Response) {
        try {
            if (!req.body.type) {
                throw { message: "Type is required" };
            }
            if (req.body.type === "company" && !req.body.companyId) {
                throw { message: "Company id required" };
            }
            if (!req.body.templateId) {
                throw { message: "Template id required" };
            }
            if (!req.body.mode) {
                throw { message: "Mode required" }
            }
            let template = await TemplateModel.findOne({ _id: req.body.templateId }).select('templateName type');
            let digitalDocument = new DocumentTimelineModel();
            digitalDocument.sentBy = req.user._id;
            digitalDocument.templateId = req.body.templateId;
            digitalDocument.templateName = template.templateName;
            digitalDocument.templateType = template.type;
            digitalDocument.filename = req.body.filename;
            digitalDocument.status = "Sent";
            digitalDocument.mode = req.body.mode;
            if (req.body.type === 'company') {
                digitalDocument.companyId = req.body.companyId;
                let history = new HistoryModel();
                history.Company = req.body.companyId;
                history.field = "Document Sent";
                history.previousValue = "";
                history.currentValue = "Document Sent Successfully";
                history.addedBy = req.user._id;
                await history.save();

            }
            if (req.body.type === 'quote') {
                digitalDocument.quoteId = req.body.quoteId;
                let history = new HistoryModel();
                history.field = "Document Sent";
                history.previousValue = "";
                history.currentValue = "Document Sent Successfully";
                history.addedBy = req.user._id;
                history.Quote = req.body.quoteId;
                await history.save();

            }
            if (req.body.type === 'renewal') {
                digitalDocument.renewalId = req.body.renewalId;
                let history = new HistoryModel();
                history.field = "Document Sent";
                history.previousValue = "";
                history.currentValue = "Document Sent Successfully";
                history.addedBy = req.user._id;
                history.Renewal = req.body.renewalId;
                await history.save();

            }
            digitalDocument.sentDocumentUrl = req['aws'].Location;
            digitalDocument.sentDocumentTimestamp = new Date();

            await digitalDocument.save();
            res.send({ success: true, message: "Document saved successfully" });

        } catch (error) {
            console.log(error);
            res.send({ success: false, message: error.message });
        }
    }

    async attachSignedPdf(req: Request, res: Response) {
        try {

            if (!req.body.digitalDocumentId)
                throw { message: "Digital document id required" }

            let document = await DocumentTimelineModel.findOne({ _id: req.body.digitalDocumentId });
            if (document.receivedDocumentUrl) {
                throw { message: "Already has signed document." }
            }
            if (req?.files?.document?.length > 0) {
                document.receivedDocumentUrl = req.files.document[0].location;
                document.receivedDocumentTimestamp = new Date();
                document.status = "Received";
                document.receivedFileName = req.files.document[0].originalname;
                let history = new HistoryModel();

                history.field = "Document Received";
                history.previousValue = "";
                history.currentValue = "Document Received Successfully";
                history.addedBy = req.user._id;
                if (document.companyId) {
                    history.Company = document.companyId;
                    await history.save();
                }
                if (document.quoteId) {
                    history.Quote = document.quoteId;
                    await history.save();
                }
                if (document.renewalId) {
                    history.Renewal = document.renewalId;
                    await history.save();
                }
            }
            await document.save();
            res.send({ success: true, message: "Signed document attached successfully", data: document });
        } catch (error) {
            console.log(error);
            res.send({ success: false, message: error.message });
        }
    }

    async listDocuments(req: Request, res: Response) {
        try {
            let aggregatePipeline = [];
            if (!req.query.type) {
                throw { message: "type required" }
            }
            if (req.query.type === "quote" && !req.params.id) {
                throw { message: "Quote Id required" };
            }
            if (req.query.type === "company" && !req.params.id) {
                throw { message: "Company Id required" };
            }
            if (req.query.type === "renewal" && !req.params.id) {
                throw { message: "Renewal Id required" };
            }

            if (req.query.type === "consumer" && !req.params.id) {
                throw { message: "Consumer Id required" };
            }
            if (req.query.type === "quote") {
                aggregatePipeline.push({
                    $match: { quoteId: ObjectId(req.params.id) }
                })
            }
            if (req.query.type === "company") {
                aggregatePipeline.push({
                    $match: { companyId: ObjectId(req.params.id) }
                })
            }
            if (req.query.type === "renewal") {
                aggregatePipeline.push({
                    $match: { renewalId: ObjectId(req.params.id) }
                })
            }
            if (req.query.type === "consumer" ) {
                aggregatePipeline.push({
                    $match: { consumerId: ObjectId(req.params.id) }
                })
            }

            if (req.query.sort) {
                aggregatePipeline.push({
                    $sort:
                        { [req.query.sort]: req.query.sortType === 'asc' ? 1 : -1 }
                });
            } else {
                aggregatePipeline.push({
                    $sort:
                        { createdAt: -1 }
                });
            }

            if (req.query.skip) {
                if (!isNaN(Number(req.query.skip))) {
                    aggregatePipeline.push({
                        $skip: Number(req.query.skip)
                    })
                }
            }
            if (req.query.limit) {
                if (!isNaN(Number(req.query.limit))) {
                    aggregatePipeline.push({ $limit: Number(req.query.limit) });
                }
            } else {
                aggregatePipeline.push({ $limit: 20 });
            }

            aggregatePipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'sentBy',
                    foreignField: '_id',
                    as: 'sentBy'
                }
            })
            aggregatePipeline.push({
                $unwind: {
                    path: "$sentBy",
                    preserveNullAndEmptyArrays: false
                }
            });

            aggregatePipeline.push({
                $project: {
                    sentDocumentTimestamp: 1,
                    'sentBy.name': 1,
                    'sentBy.avatar': 1,
                    'template.templateName': "$templateName",
                    'template.type': "$templateType",
                    createdAt: 1,
                    status: 1,
                    filename: 1,
                    mode: 1,
                    docusignEnvId: 1,
                    docusignEmailSubject: 1
                }
            });

            const list = await DocumentTimelineModel.aggregate(aggregatePipeline);
            let isNext = (!isNaN(Number(req.query.limit)) && list.length === Number(req.query.limit)) ? true : false;

            res.send({ success: true, data: list, isNext });

        } catch (error) {
            console.log(error);
            res.send({ success: false, message: error.message });
        }
    }

    async viewDocument(req: Request, res: Response) {
        try {
            if (!req.params.digitalDocumentId)
                throw { message: "Digital Document id required" }

            let document = await DocumentTimelineModel.findOne({ _id: req.params.digitalDocumentId }).populate('sentBy', 'name avatar').lean();
            res.send({ success: true, data: document });
        } catch (error) {
            console.log(error);
            res.send({ success: false, message: error.message })
        }
    }
}


export default class AllControllers {
    admin: AdminController;
    constructor() {
        this.admin = new AdminController();
    }
}