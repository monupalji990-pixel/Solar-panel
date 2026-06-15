const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

import ConsumerModel from "../../models/user";
import LeadModel from "../../models/Lead";
import QuoteModel from "../../models/Quotes";

const normalizePhoneNumbers = (rows: any[]) => {
    if (!Array.isArray(rows)) return [];
    return rows
        .map((r) => ({
            type: String(r?.type || "other").toLowerCase(),
            number: String(r?.number || "").trim(),
        }))
        .filter((r) => r.number.length > 0);
};

const mapPhonesToLegacy = (rows: any[]) => {
    const normalized = normalizePhoneNumbers(rows);
    const mobileRow =
        normalized.find((r) => r.type === "mobile") ||
        normalized.find((r) => r.type === "home") ||
        normalized[0];
    const otherRow = normalized.find((r) => r !== mobileRow);
    return {
        mobile: mobileRow?.number || "",
        telephoneNumber: otherRow?.number || "",
    };
};
import RenewalModel from "../../models/Renewal";
import TaskModel from "../../models/Task";
import CityModel from "../../models/City";
import { Request, Response } from "../../templates/commandInterface";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import { CONSUMER_ROLE_ID } from "../../sharedModules/constants/roleId";
import QuoteStatus from "../quote/Modules/quoteStatus";
import HistoryModule from "../../sharedModules/smallModules/historyModule";
import DriveController from "../drive/controller";

class AdminController {
    async deleteConsumer(req: Request, res: Response) {
        try {
            await LeadModel.remove({ Consumer: req.body.id });
            await QuoteModel.remove({ Consumer: req.body.id });
            await TaskModel.remove({ Consumer: req.body.id });
            await ConsumerModel.remove({ _id: req.body.id });
            commonUtils.sendResponse(res, { success: true });
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }
}

class RegUserController {
    async addConsumer(req: Request, res: Response) {
        try {
            const cc = await ConsumerModel.findOne({ role: CONSUMER_ROLE_ID }).sort({ createdAt: -1 });
            const consumer = req.body;
            if (req.body.phoneNumbers) {
                const phoneNumbers = normalizePhoneNumbers(req.body.phoneNumbers);
                consumer.phoneNumbers = phoneNumbers;
                const legacyPhones = mapPhonesToLegacy(phoneNumbers);
                consumer.mobile = legacyPhones.mobile;
                consumer.telephoneNumber = legacyPhones.telephoneNumber;
            }
            consumer.email = req.body.email.toLowerCase();
            consumer.role = CONSUMER_ROLE_ID;
            consumer.consumerId = String(1 + Number(cc.consumerId));

            await ConsumerModel.populate(req.user, { path: 'role' })
            // console.log('user Id: ', req.user._id, req.user.role)

            if (["Partner", "Sales Rep"].includes(req.user.role.roleName)) {
                console.log('inside if first')
                const aa = [];
                aa.push(req.user._id);
                consumer.Assignee = aa;
            }

            const aa = [];
            if (["Partner", "Management", "Sales Rep"].includes(req.user.role.roleName)) {
                console.log('inside if second')

                aa.push(req.user._id);
            }
            const AllManagement = await ConsumerModel.find({ role: "5d5b92031c9d440000c99914" }).select('name');
            AllManagement.map(v => { aa.push(v._id) })

            // console.log('before filter: ', aa)

            const UniqueAssignee = aa.filter((value, index, self) => {
                return self.indexOf(value) === index;
            })

            // console.log('after filter: ', UniqueAssignee)

            consumer.Assignee = UniqueAssignee;

            const newUser = new ConsumerModel(consumer);
            const data = await newUser.save();

            // Auto-create one default lead linked to this consumer (backward compatible).
            // Keep it minimal so it doesn't break legacy flows that expect leads to be created/edited later.
            try {
                const defaultLead: any = new LeadModel();
                defaultLead.leadId = `L1-${newUser.consumerId}`;
                defaultLead.Consumer = newUser._id;
                defaultLead.customerId = newUser._id;
                defaultLead.createdByUserId = req.user?._id;
                defaultLead.createdBy = req.user?.name || req.user?.email || '';
                defaultLead.status = "New Lead";
                defaultLead.serviceType = [];
                await defaultLead.save();

                await ConsumerModel.updateOne(
                    { _id: newUser._id },
                    { $addToSet: { Lead: defaultLead._id } }
                );
            } catch (e) {
                // Don't fail consumer creation if lead creation fails.
                console.warn("Auto lead creation failed; consumer created without lead.", e);
            }

            await newUser.save();
            await DriveController.addDefaultFolderConsumer(newUser._id)
            const history = new HistoryModule();
            history.ConsumerHistory(data._id, { Create: '' }, { Create: 'Consumer created' }, req);

            commonUtils.sendResponse(res, { success: true, data });
        } catch (err) {
            if (err.code == 11000) {
                return res.send({
                    success: false,
                    err: 'Consumer already exist',
                    statusCode: 2310
                });
            }
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async CreateConsumerFromWebsite(req: any, res: any) {
        try {
            const cc = await ConsumerModel.find({ role: CONSUMER_ROLE_ID }).countDocuments();
            const rq = req.body
            const consumer: any = {};
            consumer.role = CONSUMER_ROLE_ID;
            consumer.consumerId = String(1000 + cc);

            // Your Detail
            if (rq.title) consumer.title = rq.title;
            if (rq.first_name) consumer.firstName = rq.first_name;
            if (rq.surname) consumer.surName = rq.surname;
            if (rq.postcode) consumer.postcode = rq.postcode;
            if (rq.phone_number) consumer.mobile = rq.phone_number;
            if (rq.alternative_phone_number) consumer.telephoneNumber = rq.phone_number_1;
            if (rq.email) consumer.email = rq.email;
            if (rq.date_of_birth) consumer.DOB = (rq.date_of_birth && !isNaN(Date.parse(rq.date_of_birth))) ? Date.parse(rq.date_of_birth) : Date.now();

            // Your address
            if (rq.house_number) consumer.homeAddress = rq.house_number;
            if (rq.address_1) consumer.addressOne = rq.address_1;
            if (rq.address_2) consumer.addressTwo = rq.address_2;

            // How long have you lived at this address?
            if (rq.how_long_have_you_lived_at_this_address) consumer.how_long_have_you_lived_at_this_address = rq.how_long_have_you_lived_at_this_address;
            if (rq.how_long_have_you_lived_at_this_address && rq.how_long_have_you_lived_at_this_address === 'less_than_3') {
                const address: any = {};
                if (rq.previous_house_number_name) address.previous_house_number_name = rq.previous_house_number_name;
                if (rq.previous_address1) address.previous_address1 = rq.previous_address1;
                if (rq.previous_address2) address.previous_address2 = rq.previous_address2;
                consumer.previousAddress = address;
            }

            // Do You
            if (rq.do_you) consumer.do_you = rq.do_you;
            if (rq.city) consumer.city = rq.city
            if (rq.isFromPrimo) {
                consumer.isFromPrimo = true
            }

            // Banking Details
            if (rq.banking_details) consumer.bankName = rq.banking_details;
            if (rq.name_of_account_holders) consumer.accountHolderName = rq.name_of_account_holders;
            if (rq.bank_account_number) consumer.accountNumber = rq.bank_account_number;
            if (rq.branch_sort_code) consumer.sortCode = rq.branch_sort_code;

            // Are you responsible for any commercial properties?
            if (rq.are_you_responsible_for_any_commercial_properties) consumer.are_you_responsible_for_any_commercial_properties = rq.are_you_responsible_for_any_commercial_properties;
            if (rq.term_condition) consumer.term_condition = rq.term_condition;

            const newUser = new ConsumerModel(consumer);
            const newOne = await newUser.save();

            // Your current energy details
            // select_an_option
            if (rq.select_an_option === 'Upload a copy of a recent energy bil') {
                if (rq.select_a_file_to_upload) consumer.select_a_file_to_upload = rq.select_a_file_to_upload;
                if (req.files && req.files['select_a_file_to_upload[]']) {
                    const document = {
                        attachment: '',
                        timestamps: new Date().getTime(),
                        title: '',
                    };
                    document.attachment = req.files['select_a_file_to_upload[]']
                        .map(f => ({
                            name: f.originalname,
                            value: f.location,
                            type: f.mimetype
                        }));
                    await ConsumerModel.updateOne({ _id: newOne._id }, { $push: { documents: [document] } });
                }
            } else if (res?.send) {
                const quoteData: any = {
                    service: {}
                };
                let count = await QuoteModel.find({ Consumer: newOne._id }).countDocuments();
                quoteData.QuoteID = `Q${(Number(count) + 1)}-${newOne.consumerId}`;

                quoteData.Consumer = newOne._id;
                if (rq.how_do_you_receive_your_energy_supply === 'Gas & Electricity') quoteData.serviceType = 'Energy';
                if (rq.how_do_you_receive_your_energy_supply === 'Gas Only') quoteData.serviceType = 'Gas';
                if (rq.how_do_you_receive_your_energy_supply === 'Electricity Only') quoteData.serviceType = 'Electric';
                quoteData.isActive = 1;
                if (rq.how_do_you_receive_your_energy_supply === 'Gas & Electricity') {
                    quoteData.service.energy = {
                        duel_fuel_energy_supplier: rq.duel_fuel_energy_supplier,
                        duel_fuel_tariff: rq.duel_fuel_tariff,
                        how_much_gas_do_you_use: rq.how_much_gas_do_you_use,
                        duel_fuel_electricity_per_year: rq.duel_fuel_electricity_per_year,
                        what_is_your_night__consumption: rq.what_is_your_night__consumption,
                        economy: rq.do_you_have_an_economy_7_meter,
                        promotion_code: rq.promotion_code
                    }
                } else if (rq.how_do_you_receive_your_energy_supply === 'Gas Only') {
                    quoteData.service.gas = {
                        gas_tariff: rq.gas_tariff,
                        gas_company: rq.gas_company,
                        how_much_gas_do_you_use_: rq.how_much_gas_do_you_use_,
                        what_is_your_night__consumption: rq.what_is_your_night__consumption,
                        economy: rq.do_you_have_an_economy_7_meter,
                        promotion_code: rq.promotion_code
                    }
                } else if (rq.how_do_you_receive_your_energy_supply === 'Electricity Only') {
                    quoteData.service.electric = {
                        electricity_company: rq.electricity_company,
                        electricity_tariff: rq.electricity_tariff,
                        how_much_electricity_do_you_use: rq.how_much_electricity_do_you_use,
                        what_is_your_night__consumption: rq.what_is_your_night__consumption,
                        economy: rq.do_you_have_an_economy_7_meter,
                        promotion_code: rq.promotion_code
                    }
                }
                quoteData.quoteStatus = QuoteStatus.quoteStatus.InquiryFromWebsite;
                const newQuote = new QuoteModel(quoteData);
                await newQuote.save();
            }
            if (res?.send) {
                commonUtils.sendResponse(res, { success: true });

            } else {
                return consumer;
            }
        } catch (err) {
            if (err.code == 11000) {
                return res.send({
                    success: false,
                    err: 'Consumer already exist',
                    statusCode: 2310
                });
            }
            commonUtils.sendResponse(res, { success: false });
        }
    }

    async viewConsumer(req: Request, res: Response) {
        try {
            const filter: any = {};
            let id = '';
            if (req.body.editId) id = req.body.editId;
            else if (req.body.id) id = req.body.id;
            else id = req.params.consumer_id;

            const dataQuery = ConsumerModel.findById(id).lean();
            const data = await dataQuery.populate("Lead Assignee Notes.addedBy", "name email avatar leadId serviceType")
                .select("consumerId isActive isDelete title firstName surName address lat lon addressOne addressTwo siteAddress town city postcode telephoneNumber mobile email age bankName sortCode accountNumber phoneNumbers DOB meterReading documents installerDocuments Notes additionalFieldOne additionalFieldTwo createdAt isFromPrimo EPCrating").lean();

            const ecoStats = await QuoteModel.find({ serviceType: 'Eco', Consumer: id }).select('service.eco.subservice');
            const unsoldSet = new Set(['solar', 'boilers', 'ufiunderfloor', 'cavitywall', 'esh', 'ftch', 'ewi', 'iwi', 'roominaroof', 'loftinsulation', 'batterystorage', 'invertor']);
            const soldSet = new Set();
            ecoStats.forEach(s => {
                // console.log(JSON.stringify(s,null,' '))
                s?.service?.eco?.subservice && Object.keys(s.service.eco.subservice).forEach(i => {
                    // console.log(i)
                    if (typeof s.service.eco.subservice[i] === 'object' && Object.values(s.service.eco.subservice[i]).join('').length > 0) {
                        // console.log(s.service.eco.subservice[i])
                        if (unsoldSet.has(i)) {
                            unsoldSet.delete(i);
                            soldSet.add(i)
                        }
                        if (unsoldSet.has(i.toLocaleLowerCase())) {
                            unsoldSet.delete(i.toLocaleLowerCase());
                            soldSet.add(i.toLocaleLowerCase())
                        }
                    }
                })
            })

            data.ecoStats = {
                sold: Array.from(soldSet),
                unsoldSet: Array.from(unsoldSet)
            }
            // console.log(data.ecoStats);

            res.send({ success: true, data });
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async SingleConsumerView(req: Request, res: Response) {
        try {
            let filter: any = {};
            filter._id = ObjectId(req.params.id);
            const consumerQuery = ConsumerModel.aggregate([
                { $match: filter },
                {
                    $lookup: {
                        from: 'quotes',
                        localField: '_id',
                        foreignField: 'Company',
                        as: 'Quote'
                    }
                },
                {
                    $lookup: {
                        from: 'leads',
                        localField: 'Lead',
                        foreignField: '_id',
                        as: 'Lead'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'Assignee',
                        foreignField: '_id',
                        as: 'Assignee'
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: 'companyId',
                        as: 'Contact'
                    }
                },
                {
                    $lookup: {
                        from: 'sites',
                        localField: '_id',
                        foreignField: 'company',
                        as: 'Site'
                    }
                },
                {
                    $project: {
                        consumerId: 1,
                        businessName: 1,
                        "Quote._id": 1,
                        "Quote.QuoteID": 1,
                        "Lead._id": 1,
                        "Lead.leadId": 1,
                        "Assignee._id": 1,
                        "Assignee.name": 1,
                        "Contact._id": 1,
                        "Contact.name": 1,
                        "Site._id": 1,
                        "Site.siteName": 1
                    }
                },
            ]);

            const data = await consumerQuery.exec();
            res.send({ success: true, data });
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async listConsumer(req: Request, res: Response) {
        try {
            const { query } = req;
            let filter: any = {};
            const stuff = {
                searchArray: ['consumerId', 'title', 'email', 'firstName', 'surName', 'addressOne', 'mobile', 'telephoneNumber', 'postcode', 'fullName', 'addressTwo'],
                role: ObjectId(CONSUMER_ROLE_ID)
            }
            commonUtils.commonFilter(req, filter, stuff);
            let sortObj: any = { updatedAt: 1 };
            if (query.sort) sortObj = { [query.sort]: query.sortType === 'asc' ? 1 : -1 };
            let skipNumber = 0;
            let limitNumber = 99;
            if (query.skip) skipNumber = Number(query.skip);
            if (query.limit) limitNumber = Number(query.limit);
            if (req.query.Assignee) {
                let arr = []
                if (Array.isArray(req.query.Assignee)) {
                    req.query.Assignee.forEach(a => {
                        arr.push(ObjectId(a))
                    })
                    filter.Assignee = { $in: arr }

                } else {

                    filter.Assignee = ObjectId(req.query.Assignee)
                }
            }
            const UserQuery = ConsumerModel.aggregate([
                // {
                //     $match:{
                //         firstName:{$exists:true},
                //         surName:{$exists:true},

                //     }
                // },
                // {
                //     $project:{
                //         // "fullName":{$concat:['$firstName',' ','$surName']},
                //         "consumerId": 1,
                //         "title": 1,
                //         "email": 1,
                //         "firstName": 1,
                //         "surName": 1,
                //         "mobile":1,
                //         "phone":1,
                //         "postcode":1,
                //         "role":1

                //     }
                // },
                { $match: filter },
                { $sort: sortObj },
                { $skip: skipNumber },
                { $limit: limitNumber },
                {
                    $project: {
                        "consumerId": 1,
                        "title": 1,
                        "email": 1,
                        "firstName": 1,
                        "surName": 1,
                        fullName: { $concat: ['$firstName', ' ', '$surName'] },
                        telephoneNumber: 1,
                        mobile: 1,
                        "addressOne": 1,
                        "DOB": 1,
                        "postcode": 1,
                        "createdAt": 1,
                        "isFromPrimo": 1,
                        "addressTwo": 1
                    }
                }
            ])
            const data = await UserQuery.exec();
            res.send({ data, count: 0, success: true });
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async ConsumerCount(req: Request, res: Response) {
        try {
            const { query } = req;
            let filter: any = {};
            const stuff = {
                searchArray: ['consumerId', 'title', 'email', 'firstName', 'surName', 'addressOne'],
                role: ObjectId(CONSUMER_ROLE_ID)
            }
            commonUtils.commonFilter(req, filter, stuff);
            const count = await ConsumerModel.aggregate([
                { $match: filter },
                { $count: "count" }
            ])
            const countData = (count.length > 0) ? count[0].count : 0;
            res.send({ count: countData, success: true });
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async dropdownListConsumer(req: Request, res: Response) {
        try {
            let filter: any = {};
            const stuff = {
                searchArray: ['consumerId', 'title', 'email', 'firstName', 'surName', 'addressOne'],
                role: ObjectId(CONSUMER_ROLE_ID)
            }
            commonUtils.commonFilter(req, filter, stuff);
            let sortObj: any = { updatedAt: 1 };
            if (req.query.sort) sortObj = { [req.query.sort]: req.query.sortType === 'asc' ? 1 : -1 };
            let limitNumber = 99;
            if (req.query.limit) limitNumber = Number(req.query.limit);
            const query = ConsumerModel.aggregate([
                { $match: filter },
                { $sort: sortObj },
                { $limit: limitNumber },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'Assignee',
                        foreignField: '_id',
                        as: 'Assignee'
                    }
                },
                {
                    $project: {
                        "firstName": 1,
                        "surName": 1,
                        "postcode": 1,
                        "Assignee._id": 1,
                        "Assignee.name": 1,
                        "addressOne": 1,
                        "addressTwo": 1,
                        "DOB": 1

                    }
                }
            ])
            const data = await query.exec();
            res.send({ data, success: true });
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async updateConsumer(req: Request, res: Response) {
        try {
            let update = req.body.update;
            let previousObject: any = {};
            if (req.body.update.email) {
                const fromId = await ConsumerModel.findById(req.body.editId);
                const fromEmail = await ConsumerModel.findOne({ email: req.body.update.email });
                if (fromEmail === null || String(fromId._id) === String(fromEmail._id)) {
                    previousObject = await ConsumerModel.findById(req.body.editId);
                    await ConsumerModel.updateOne({ _id: req.body.editId }, update);
                } else {
                    res.send({ success: false, message: "This email consumer is already exist", statusCode: 2310 });
                }
            } else {
                previousObject = await ConsumerModel.findById(req.body.editId);
                await ConsumerModel.updateOne({ _id: req.body.editId }, update);
            }

            const history = new HistoryModule();
            history.ConsumerHistory(req.body.editId, previousObject, update, req);

            const c = new RegUserController();
            c.viewConsumer(req, res);
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async addNotes(req: Request, res: Response) {
        try {
            let comment = {
                notes: req.body.description,
                timestamps: new Date().getTime(),
                addedBy: req.user._id,
                attachment: '',
                createdAt: new Date()
            };

            if (req.files && req.files.Attachments) {
                comment.attachment = req.files.Attachments
                    .map(f => ({
                        name: f.originalname,
                        value: f.location,
                        type: f.mimetype
                    }));
            }

            await ConsumerModel.updateOne({ _id: req.body.id }, { $push: { Notes: [comment] } });

            const history = new HistoryModule();
            history.ConsumerHistory(req.body.id, { Comment: '' }, { Comment: 'Comment added' }, req);

            const rc = new RegUserController();
            rc.viewConsumer(req, res);
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async deleteRequestRegUser(req: Request, res: Response) {
        try {
            await ConsumerModel.findByIdAndUpdate(req.body.id, { isDelete: 1 });
            const rc = new RegUserController();
            rc.viewConsumer(req, res);
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async deleteMultiConsumerRegUser(req: Request, res: Response) {
        try {
            await req.body.deleteIds.forEach(async (element) => {
                await LeadModel.remove({ Consumer: element });
                await QuoteModel.remove({ Consumer: element });
                await RenewalModel.remove({ Consumer: element });
                await TaskModel.remove({ Consumer: element });
                await ConsumerModel.deleteOne({ _id: element });
            });
            res.send({ success: true });
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }


    async deleteRejectConsumerRegUser(req: Request, res: Response) {
        try {
            await ConsumerModel.updateMany(
                {
                    _id: {
                        $in: req.body.deleteIds,
                    },
                },
                {
                    isDelete: 0,
                }
            );
            return res.send({ success: true });
        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }

    async getCityList(req: Request, res: Response) {
        try {
            let { skip, limit } = req.body
            if (!skip) skip = 0
            if (!limit) limit = 50
            let city = req.body.city
            let list = []
            if (city) {
                city = { $regex: `.*${req.body.city}.*`, $options: "gi" }
                list = await CityModel.find({ city: city }).skip(skip).limit(limit).lean();
            } else {
                list = await CityModel.find({}).skip(skip).limit(limit).lean();

            }
            return res.send({ success: true, data: list })
        } catch (error) {
            console.log(error)
            return res.send({ success: false, message: error.message })
        }
    }
}

export default class AllControllers {
    regUser: RegUserController;
    admin: AdminController;
    constructor() {
        this.regUser = new RegUserController();
        this.admin = new AdminController();
    }
}