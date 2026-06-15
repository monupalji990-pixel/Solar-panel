const mongoose = require('mongoose');
const fs = require('fs');
const { ObjectId } = mongoose.Types;
const hummus = require('hummus');
const PDFDigitalForm = require('./pdf-digital-form');

import { Request, Response } from "../../templates/commandInterface";
import aws from "../../sharedModules/smallModules/aws";
import TemplateModel from "../../models/Templates";

class AdminController {
    async addTemplate(req: Request, res: Response) {
        try {
            if (!req.body.templateName) {
                throw { errType: "local", message: "Please add Template name" }
            }
            if (!req.body.type) {
                throw { errType: "local", message: "Please add Template type" }
            }
            if (!req.body.mapper) {
                throw { errType: "local", message: "Please add Mapper object" }
            }
            if (req.body.type == "CONTRACT" && !req.body.serviceType) {
                throw { message: "Service type required for contract" }
            }
            if (req.files?.template?.length > 0) {
                let template = new TemplateModel();
                template.templateName = req.body.templateName;
                template.type = req.body.type;
                if (req.body.type == "CONTRACT" && req.body.serviceType)
                    template.serviceType = req.body.serviceType;
                template.createdBy = req.user._id;
                template.url = req.files.template[0].location;
                template.mapper = JSON.parse(req.body.mapper);
                await template.save();
                res.send({ success: true, message: "Template added successfully" });

            } else {
                throw { errType: "local", message: "Please upload file" }
            }
        } catch (error) {
            console.log(error);
            res.send({ success: false, message: error.message })
        }
    }

    async getPdfFields(req: Request, res: Response) {
        try {
            if (req['fileValidationError']) {
                throw { message: req['fileValidationError'] };
            }
            let filePath = `${__dirname}/${req.user._id}_${req.file.originalname}.pdf`;
            fs.writeFileSync(filePath, req.file.buffer);
            let pdfParser = hummus.createReader(filePath);
            let digitalForm = new PDFDigitalForm(pdfParser);
            if (fs.existsSync(filePath))
                fs.unlinkSync(filePath);
            if (digitalForm.hasForm()) {
                res.send({ success: true, data: digitalForm.fields });
            } else {
                res.send({ success: true, message: "No form fields detected!" });
            }
        } catch (error) {
            console.log(error);
            res.send({ success: false, message: error.message })
        }
    }

    async listTemplates(req: Request, res: Response) {
        try {
            if (req.path.includes("/count")) {
                let count = await TemplateModel.aggregate([{ $count: 'count' }])
                return res.send({ success: true, count: count[0].count });
            } else {
                let filter: any = {};
                let aggregatePipeline = [];

                if (req.query.Search) {
                    filter.templateName = { $regex: `.*${req.query.Search}.*`, $options: "i" };
                    aggregatePipeline.push({ $match: filter });
                }
                if (req.query.type) {
                    aggregatePipeline.push({ $match: { type: req.query.type } })
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
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdBy'
                    }
                });
                aggregatePipeline.push({
                    $unwind: {
                        path: "$createdBy",
                        preserveNullAndEmptyArrays: false
                    }
                });
                aggregatePipeline.push({
                    $project: {
                        templateName: 1,
                        type: 1,
                        'createdBy.name': 1,
                        'createdBy.avatar': 1,
                        createdAt: 1,
                        url: 1,
                        mapper: 1
                    }
                });

                const list = await TemplateModel.aggregate(aggregatePipeline);
                let isNext = (!isNaN(Number(req.query.limit)) && list.length === Number(req.query.limit)) ? true : false;

                res.send({ success: true, data: list, isNext });
            }

        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    }

    async viewTemplate(req: Request, res: Response) {
        try {
            if (!req.params.tempId)
                return res.send({ success: false, message: "Please provide Template Id" });
            let template = await TemplateModel.findOne({ _id: req.params.tempId }).lean();

            return res.send({ success: true, data: template });

        } catch (error) {
            return res.send({ success: false, message: error.message });
        }
    }

    async updateTemplate(req: Request, res: Response) {
        try {

            let template = await TemplateModel.findOne({ _id: req.body._id });

            if (req.files?.template?.length > 0) {
                aws.deleteFileFromS3({ value: template.url });
                template.url = req.files.template[0].location;
            }
            if (req.body.templateName) {
                template.templateName = req.body.templateName;
            }
            if (req.body.type) {
                template.type = req.body.type;
            }
            if (req.body.mapper) {
                template.mapper = JSON.parse(req.body.mapper);
            }
            template.editedBy = req.user._id;

            await template.save();
            res.send({ success: true, message: "Template updated successfully.", data: template });
        } catch (error) {
            console.log(error);

            res.send({ success: false, message: error.message });
        }
    }

    async deleteTemplate(req: Request, res: Response) {
        try {
            let template = await TemplateModel.findOne({ _id: req.params.tempId }).select("url");
            if (template.url) {
                aws.deleteFileFromS3({ value: template.url });
            }
            template.remove();
            res.send({ success: true, message: "Template deleted successfully." });

        } catch (error) {
            res.send({ success: false, message: error.message });
        }
    }

}

export default class AllControllers {
    admin: AdminController;
    constructor() {
        this.admin = new AdminController();
    }
}