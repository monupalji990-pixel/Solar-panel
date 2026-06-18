import InvoiceModel, { InvoiceSelectFields } from "./invoice";
import { Request, Response } from "../../templates/commandInterface";
import general from "../../sharedModules/smallModules/general";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import UserModel from "../../models/user";
const path = require("path");
const moment = require('moment')

var pdf = require('pdf-creator-node');
var fs = require('fs');
var html = fs.readFileSync(path.join(__dirname, `./../../invoice.html`), 'utf8');
const generatePdf = async (data: any) => {
    const formattedCurrency = (currency) => {
        return (
            currency &&
            currency.toLocaleString("en-GB", {
                style: "currency",
                currency: "GBP",
            })
        );
    };

    const getLineItemSubTotal = (lineItems) => {
        const subtotal = lineItems.reduce((subtotal, item) => {
            return subtotal + (item.totalAmount || 0); // Ensure totalAmount defaults to 0 if null
        }, 0);
        return formattedCurrency(subtotal); // Format the subtotal as currency
    };

    const getTotalTax20 = (values) => {
        const totalTax = values.lineItems.reduce((totalTax, item) => {
            if (item.tax === 20) {
                const taxRate = item?.tax || 0;
                const taxAmount = item.price * item.quantity * (taxRate / 100);
                return totalTax + taxAmount;
            }
            return totalTax;
        }, 0);

        return formattedCurrency(totalTax); // Format the total tax as currency
    };

    const getTotalTax5 = (values) => {
        const totalTax = values.lineItems.reduce((totalTax, item) => {
            if (item.tax === 5) {
                const taxRate = item?.tax || 0;
                const taxAmount = item.price * item.quantity * (taxRate / 100);
                return totalTax + taxAmount;
            }
            return totalTax;
        }, 0);

        return formattedCurrency(totalTax); // Format the total tax as currency
    };

    const getAddressOne = (data) => {
        if (data.consumer?.firstName && data.consumer.addressOne) {
            return data.consumer.addressOne || ''
        } else if (data.company?.businessName && data.company.firstLine) {
            return data.company.firstLine || ''
        } else {
            return ''
        }
    }
    const getAddressTwo = (data) => {
        if (data.consumer?.firstName && data.consumer.addressTwo) {
            return data.consumer.addressTwo || ''
        } else if (data.company?.businessName && data.company.secondLine) {
            return data.company.secondLine || ''
        } else {
            return ''
        }
    }
    const getTown = (data) => {
        if (data.company?.town) {
            return data.company?.town
        } else if (data.consumer?.town) {
            return data.consumer?.town
        } else {
            return ''
        }
    }
    const getCounty = (data) => {
        if (data.company?.country) {
            return data.company?.country
        } else if (data.consumer?.city) {
            return data.consumer?.city
        } else {
            return ''
        }
    }
    const getPostcode = (data) => {
        if (data.company?.postcode) {
            return data.company?.postcode
        } else if (data.consumer?.postcode) {
            return data.consumer?.postcode
        } else {
            return ''
        }
    }
    const getCompanyConsumerEmail = (data) => {
        if (data.company?.companyContact?.email) {
            return data.company?.companyContact?.email
        } else if (data.consumer?.email) {
            return data.consumer?.email
        } else {
            return ''
        }
    }
    const getCompanyConsumerMobile = (data) => {
        if (data.company?.companyContact?.mobile) {
            return data.company?.companyContact?.mobile
        } else if (data.consumer?.mobile) {
            return data.consumer?.mobile
        } else {
            return ''
        }
    }
    const getTotalDiscount = (values) => {        
        const subTotal = values.lineItems.reduce((subtotal, item) => {
            return subtotal + (item.totalAmount || 0); // Ensure totalAmount defaults to 0 if null
        }, 0);
        let discountAmount = 0;

        // Check if discount option is 'Percentage' or 'Flat' and calculate accordingly
        if (values.discountType === "Percentage") {
            discountAmount = subTotal * (values.discount / 100) || 0;
        } else if (values.discountType === "Flat") {
            discountAmount = values.discount || 0;
        }

        return formattedCurrency(discountAmount);
    };

    let newData = {
        ...data,
        fromCompanyName: data.fromCompany,
        fromCompanyAddress: data.fromAddress,
        invoiceNumber: data.invoiceNumber,
        dueDate: moment(data.dueDate).format('LL'),
        paymentDue: moment(data.paymentDue).format('LL'),
        ConsumerCompany: data.consumer?.firstName ? data.consumer?.firstName : data.company?.businessName,
        ConsumerCompanyAddressOne: getAddressOne(data),
        ConsumerCompanyAddressTwo: getAddressTwo(data),
        town: getTown(data),
        county: getCounty(data),
        postcode: getPostcode(data),
        CompanyConsumerMobile: getCompanyConsumerMobile(data),
        CompanyConsumerEmail: getCompanyConsumerEmail(data),
        discount: getTotalDiscount(data),
        totalAmount: formattedCurrency(data.totalAmount),
        lineItems: data.lineItems,
        createdAt: data.createdAt,
        subTotal: getLineItemSubTotal(data.lineItems),
        tax20: getTotalTax20(data),
        tax5: getTotalTax5(data),
        mobile: data.consumer?.mobile || "",
        email: data.consumer?.email || "",
    }

    var document = {
        html: html,
        data: newData,
        path: "./invoice.pdf"
    }
    var options = {
        format: "A4",
        orientation: "portrait",
        border: "8mm",
        // "footer": {
        //     "height": "28mm",
        //     "contents": {
        //         default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
        //     }
        // }
    }

    return await pdf.create(document, options)
}
const getInvoiceNumber = async () => {
    const invoiceD = await InvoiceModel.findOne().select("invoiceNumber").sort([["invoiceNumber", -1]]);
    let invN = invoiceD && invoiceD.invoiceNumber ? Number(invoiceD.invoiceNumber) + 1 : Number('00001');
    console.log("invoice number", invN, (String(invN).padStart(5, '0')));
    return String(invN).padStart(5, '0')
}

class RegUserController {
    async getPdf(req: Request, res: Response) {
        try {
            general.checkIdValidation(req.params, ['id']);

            const data = await InvoiceModel.findById(req.params.id)
                // .populate("company", 'businessName address firstLine secondLine town country postcode')
                .populate("consumer", 'firstName lastName address addressOne addressTwo town city postcode email mobile')
                .populate({
                    path: 'company',
                    select: 'businessName address firstLine secondLine town country postcode',
                }).lean()

            if (data.company?._id) {
                data.company.companyContact = await UserModel.findOne({ companyId: data.company?._id }).select('email mobile');
            }
            const filePath = await generatePdf(data)
            console.log('filePath', filePath);

            if (filePath?.filename) {
                let fileData = fs.readFileSync(filePath?.filename, 'binary')
                res.send(fileData);
            }
            else {
                res.send({ success: false, message: 'error with PDF.' })
            }
        } catch (err) {
            return res.send(err);
        }
    }
    async add(req: Request, res: Response) {
        try {
            general.checkKeyValidation(req.body, []);
            const obj = new InvoiceModel(req.body);
            obj.createdBy = req.user._id
            obj.invoiceNumber = await getInvoiceNumber();
            await obj.save();

            res.send({ success: true, message: "Added successfully" });
        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }

    async list(req: Request, res: Response) {
        try {
            let filter: any = {};

            const searchKeys = ['invoiceNumber']
            await general.addSearchFilterWithOr(filter, searchKeys, req.query.search)

            let aggregatePipeline: any = [{ $match: filter },
            general.addLookup('companies', 'company', '_id', ['businessName'], 'company', false),
            general.addUnwind('company', true),
            general.addLookup('users', 'consumer', '_id', ['firstName', 'lastName'], 'consumer', false),
            general.addUnwind('consumer', true),
            { $project: InvoiceSelectFields }];

            const { data, isNext } = await general.execWithCommonAggregate(InvoiceModel, aggregatePipeline, req.query);

            res.send({ success: true, isNext, data });
        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }
    async fromList(req: Request, res: Response) {
        try {

            let data: any = [
                { label: 'Edanpowerportal Limited', value: 'Edanpowerportal Limited', address: 'Leslie Square Office 24 Block C, Paper Mill End, Great Barr, Birmingham, West Midlands, United Kingdom, B44 8NH' },
                { label: 'Edanscaffolding Limited', value: 'Edanscaffolding Limited', address: 'Leslie Square Office 24 Block C, Paper Mill End, Great Barr, Birmingham, West Midlands, United Kingdom, B44 8NH' },
                { label: 'EdanpropertyPortal Limited', value: 'EdanpropertyPortal Limited', address: 'Leslie Square Office 24 Block C, Paper Mill End, Great Barr, Birmingham, West Midlands, United Kingdom, B44 8NH' },
                { label: 'Everlast properties Limited', value: 'Everlast properties Limited', address: 'Leslie Square Office 24 Block C, Paper Mill End, Great Barr, Birmingham, West Midlands, United Kingdom, B44 8NH' },
                { label: 'Edanpower Limited', value: 'Edanpower Limited', address: 'Leslie Square Office 24 Block C, Paper Mill End, Great Barr, Birmingham, West Midlands, United Kingdom, B44 8NH' },
            ]


            res.send({ success: true, data });
        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }

    async edit(req: Request, res: Response) {
        try {
            general.checkIdValidation(req.params, ['id']);
            const data = await InvoiceModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
            res.send({ success: true, message: 'Updated successfully' });

        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }
    async get(req: Request, res: Response) {
        try {
            general.checkIdValidation(req.params, ['id']);

            const data = await InvoiceModel.findById(req.params.id).populate("consumer", 'firstName lastName address addressOne addressTwo town city postcode email mobile')
                .populate({
                    path: 'company',
                    select: 'businessName address firstLine secondLine town country postcode',
                })
                .lean();
            if (data.company?._id) {
                data.company.companyContact = await UserModel.findOne({ companyId: data.company?._id }).select('email mobile');
            }
            res.send({ success: true, data });
        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }
    async delete(req: Request, res: Response) {
        try {
            general.checkIdValidation(req.params, ['id']);

            await InvoiceModel.findByIdAndDelete({ _id: req.params.id })
            res.send({ success: true, message: "Deleted successfully" });
        } catch (error) {
            commonUtils.sendErrorResponse(req, res, error);

        }
    }


}

export default class AllControllers {
    Reguser: RegUserController
    constructor() {
        this.Reguser = new RegUserController();
    }
}

