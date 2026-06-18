const mongoose = require('mongoose');
let _ = require("lodash");
const { ObjectId } = mongoose.Types;
import { Request, Response } from "../../templates/commandInterface";
import HistoryModel from '../../models/History';
import TaskStuff from '../../projects/task/Modules/status'
import UserModel from "../../models/user";

// can't show the field name in the history table, so creating array for variables
const fieldsArray = {
    businessName: 'Company Name',
    businessSector: 'Business Sector',
    supplierName: 'Supplier Name',
    contactAdded: 'Contact',
    ContactPersonName: 'Contact Name',
    TelephoneNumber: 'Telephone',
    AttachmentHistory: 'Attachment',
    no_of_days: 'No of days',
    previous_contract_length: 'Current contract length',
    previous_contract_start_date: 'Current contract end date',
    contract_length: 'Preferred contract length',
    contract_start_date: 'Preferred contract start date',
    bill_date_type: 'Bill date type',
    bill_start_date: 'Bill start date',
    bill_end_date: 'Bill end date',
    meterSerialNumber: 'Meter serial number',
    dailyCharges: 'Standing charges',
    onlineAccountPassword: 'Online account password',
    onlineAccountUserName: 'Online account username',
    accountNumber: 'Account number',
    unitRate: 'Unit rate',
    topLine: 'TopLine - MPAN',
    meterNumber: 'Bottom line - MPAN',
    unitDayRate: 'Unit day rate',
    unitDaykWh: 'Unit day usage',
    unitNightRate: 'Unit night rate',
    unitNightkWH: 'Unit night usage',
    unitWkdRate: 'Eve/Wkd rate',
    unitWkdkWh: 'Eve/Wkd usage',
    unitWinterRate: 'Winter rate',
    unitWinterkWH: 'Winter usage',
    WaterCorespId: 'Water corespid',
    CoreSpidRates: 'Core spid rates',
    SewageSpid: 'Sewage spid',
    SewageApidRates: 'Sewage apid rates',
    WaterMeterSN: 'Water meter SN',
    WaterAnnualSpend: 'Water annual spend',
    WaterDiscount: 'Water discount',
    WaterRenewalDate: 'Water renewal date',
    MachineType: 'Machine type',
    PDQFinanceStatus: 'Payment type',
    NumberTerminals: 'Number of terminals',
    ProviderRefNumber: 'Provider ref. number',
    MerchantRental: 'Merchant rental',
    Package: 'Package',
    DeploymentCost: 'Deployment cost',
    AnalyticsCost: 'Analytics cost',
    CreditCardRate: 'Credit card rates',
    DebitCardRate: 'Debit card rates',
    BusinessCardRate: 'Business card rates',
    AuthorizationFee: 'Authorization fee',
    PCIDSSCharge: 'PCI DSS charge',
    ConnectionType: 'Connection type',
    DeliveryDate: 'Delivery date',
    FirstTransactionDate: 'First transaction date',
    RenewalDate: 'Renewal date',
    PCIDSSUserName: 'PCI DSS user name',
    PCIDSSPassword: 'PCI DSS password',
    PCIComplaintDate: 'PCI complaint date',
    midNumber: 'Mid number',
    PhoneNumber1: 'Phone number 1',
    PhoneNumber2: "Phone number 2",
    PhoneNumber3: "Phone number 3",
    PhoneNumber4: "Phone number 4",
    PhoneRange4: "Phone range 4",
    PhoneNumber5: "Phone number 5",
    PhoneRange5: "Phone range 5",
    PhoneNumber6: "Phone number 6",
    PhoneRange6: "Phone range 6",
    LineRental: "Line rental",
    ConnectionCharges: "Connection charges",
    CashAmount: "Cash amount",
    AddExtras: "Add extras",
    TelecomsLiveDate: "Telecoms live date",
    TelecomsRenewalDate: "Telecoms renewal date",
    WholeSaleProvider: "Whole sale provider",
    IPAddress: 'IP address',
    RouterModel: 'Router Model',
    SerialNumber: 'Serial number',
    ProgrammedDate: 'Programmed date',
    BroadbandPostageProof: 'Broadband postage proof',
    BroadbandLiveDate: 'Broadband live date',
    BroadbandRenewalDate: 'Broadband renewal date',
    currentTariff: 'Current tariff',
    economy: 'Economy 7',
    EAnnualCost: 'Electric Annual Usage',
    EMonthlyCost: 'Electric Monthly Usage',
    GAnnualCost: 'Gas Annual Usage',
    GMonthlyCost: 'Gas Monthly Usage',
    paymentOption: 'Payment option',
    warmHomeDiscount: 'Warm Home Discount',
    pcode: 'Promotion Code',
    newSupplier: 'New Supplier Name',
    newTariff: 'New Supplier Tariff',
    contractReviewOption: 'Contract review option',
    funeralProvider: 'Funeral provider',
    funeralType: 'Funeral type',
    PaymentPlan: 'Over 50s payment plan',
    specialRequest: 'Special request field',
    addproperty: 'Address of property',
    morgage_type: 'Type of mortgage',
    EAcompanyName: 'Estate agents company name',
    EAphoneNumber: 'Estate agents phone number',
    EAemail: 'Estate agents email',
    EAnameOfContact: 'Estate agents name of contact',
    ScompanyName: 'Solicitors company name',
    SphoneNumber: 'Solicitors phone number',
    Semail: 'Solicitors email',
    SnameOfContact: 'Solicitors name of contact',
    LcompanyName: 'Lender company name',
    LphoneNumber: 'Lender phone number',
    Lemail: 'Lender email',
    LnameOfContact: 'Lender name of contact',
    propertyValue: 'Value of property',
    deposit: 'Available deposit',
    loanValue: 'Loan to value',
    creditScore: 'Credit score',
    valuationDate: 'Valuation date',
    cValuation: 'Confirmed valuation value',
    dateOffer: 'Date of offer',
    completionDate: 'Completion date',
    contract_exchange_date: 'Contract exchange date',
    lifeInsurance: 'Life insurance',
    criticalIllness: 'Critical illness',
    homeInsurance: 'Home insurance and contents',
    funeralPlan: 'Funeral plan',
    RouterPrice: 'Router price'
}

const notHistoryFields = ['createdAt', 'updatedAt', 'supplier_id', 'SupplierContact', '_id', 'createdBy', 'documents', 'timestamps', 'role', 'slugUser', 'TaskID', '$push', '$init'];

class HistoryController {
    async HistoryList(req: Request, res: Response) {
        try {
            let filter: any = {}
            const { query } = req;
            if (req.query.User && req.query.historyFor === 'User') { filter.User = ObjectId(req.query.User) };
            if (req.query.Lead && req.query.historyFor === 'Lead') { filter.Lead = ObjectId(req.query.Lead) };
            if (req.query.Company && req.query.historyFor === 'Company') { filter.Company = ObjectId(req.query.Company) };
            if (req.query.Consumer && req.query.historyFor === 'Consumer') { filter.Consumer = ObjectId(req.query.Consumer) };
            if (req.query.Quote && req.query.historyFor === 'Quote') { filter.Quote = ObjectId(req.query.Quote) };
            if (req.query.Renewal && req.query.historyFor === 'Renewal') { filter.Renewal = ObjectId(req.query.Renewal) };
            if (req.query.Supplier && req.query.historyFor === 'Supplier') { filter.Supplier = ObjectId(req.query.Supplier) };
            if (req.query.Task && req.query.historyFor === 'Task') { filter.Task = ObjectId(req.query.Task) };

            let sortObj: any = { updatedAt: 1 };
            if (query.sort) sortObj = { [query.sort]: query.sortType === 'asc' ? 1 : -1 };
            let skipNumber = 0;
            let limitNumber = 99;
            if (query.skip) skipNumber = Number(query.skip);
            if (query.limit) limitNumber = Number(query.limit);

            if (req.path.includes("/count")) {
                const count = await HistoryModel.aggregate([
                    { $match: filter },
                    { $count: "count" }
                ]);

                let countData = 0;
                if (count.length > 0) {
                    countData = count[0].count;
                }

                res.send({ count: countData, success: true });
            } else if (req.path.includes("/history_list_d")) {
                await HistoryModel.deleteMany(filter);

                res.send({ success: true });
            } else {
                const HistoryQuery = HistoryModel.aggregate([
                    { $match: filter },
                    { $sort: sortObj },
                    { $skip: skipNumber },
                    { $limit: limitNumber },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'addedBy',
                            foreignField: '_id',
                            as: 'addedBy'
                        }
                    },
                    {
                        $unwind: {
                            "path": "$addedBy",
                            "preserveNullAndEmptyArrays": true
                        }
                    },
                    {
                        $project: {
                            createdAt: 1,
                            _id: 1,
                            field: 1,
                            previousValue: 1,
                            currentValue: 1,
                            "addedBy._id": 1,
                            "addedBy.email": 1,
                            "addedBy.name": 1,
                            "addedBy.avatar": 1,
                            "addedBy.role": 1,
                            negotiation: 1,
                            notes: 1,
                            invoice: 1
                        }
                    }
                ])
                const data = await HistoryQuery.exec();
                res.send({ data, count: data.length, success: true });
            }
        } catch (err) {
            res.send({ success: false });
        }
    }

    async UserHistory(id, previousObject, newObject, req: Request) {
        try {
            if (_.isEmpty(previousObject)) return true;
            Object.keys(newObject).forEach(async (key) => {
                if (!['isActive', 'passwordEdit'].includes(key) && newObject[key] !== previousObject[key]) {
                    const h: any = {};
                    h.addedBy = req.user._id;
                    h.field = key;
                    h.previousValue = previousObject[key];
                    h.currentValue = newObject[key];
                    h.createdAt = new Date();
                    h.User = id;
                    const newOne = new HistoryModel(h);
                    await newOne.save();
                }

                if (['passwordEdit'].includes(key)) {
                    const h: any = {};
                    h.addedBy = req.user._id;
                    h.field = key;
                    h.createdAt = new Date();
                    h.User = id;
                    const newOne = new HistoryModel(h);
                    await newOne.save();
                }
            });
            return true;
        } catch (err) {
            return true;
        }
    }

    async LeadHistory(id, previousObject, newObject, req: Request) {
        try {
            if (_.isEmpty(previousObject)) return true;
            Object.keys(newObject).forEach(async (key) => {
                let isAddEntry = false;
                if (notHistoryFields.includes(key)) isAddEntry = false;
                if (!['serviceType'].includes(key) && newObject[key] !== previousObject[key]) isAddEntry = true;
                if (['serviceType'].includes(key) && !(JSON.stringify(previousObject[key]) == JSON.stringify(newObject[key]))) isAddEntry = true;

                if (isAddEntry) {
                    const h: any = {};
                    h.addedBy = req.user._id;
                    h.field = key;
                    h.previousValue = previousObject[key];
                    h.currentValue = newObject[key];
                    h.createdAt = new Date();
                    h.Lead = id;
                    const newOne = new HistoryModel(h);
                    await newOne.save();
                }
            });

            return true;
        } catch (err) {
            return true;
        }
    }

    async CompanyHistory(id, previousObject, newObject, req: Request, actionFor = '') {
        try {
            if (_.isEmpty(previousObject)) return true;
            Object.keys(newObject).forEach(async (key) => {
                let isAddEntry = false;
                if (['User'].includes(key) || notHistoryFields.includes(key)) isAddEntry = false;
                if (!['serviceType'].includes(key) && newObject[key] !== previousObject[key]) isAddEntry = true;
                if (['serviceType'].includes(key) && !(JSON.stringify(previousObject[key]) == JSON.stringify(newObject[key]))) isAddEntry = true;

                if (isAddEntry) {
                    const h: any = {};
                    h.addedBy = req.user._id;
                    h.field = fieldsArray[key] !== undefined ? fieldsArray[key] : key;
                    h.previousValue = previousObject[key];
                    if (actionFor && !['creditScoreDate'].includes(key) && !['isCompanyClose'].includes(key) ) {
                        if (actionFor === 'Site') h.currentValue = `${newObject[key]} (updated in ${previousObject.siteName} site)`;
                        if (actionFor === 'Company') h.currentValue = `${newObject[key]} (updated basic detail)`;
                        if (actionFor === 'Contact') h.currentValue = `${newObject[key]} (updated in ${previousObject.name} contact)`;
                    } else {
                        h.currentValue = newObject[key];
                    }
                    h.createdAt = new Date();
                    h.Company = id;
                    const newOne = new HistoryModel(h);
                    await newOne.save();
                }
            });

            return true;
        } catch (err) {
            return true;
        }
    }

    async ConsumerHistory(id, previousObject, newObject, req: Request) {
        try {
            if (_.isEmpty(previousObject)) return true;
            Object.keys(newObject).forEach(async (key) => {
                let isAddEntry = false;
                if (notHistoryFields.includes(key)) isAddEntry = false;
                if (!['serviceType'].includes(key) && newObject[key] !== previousObject[key]) isAddEntry = true;
                if (['serviceType'].includes(key) && !(JSON.stringify(previousObject[key]) == JSON.stringify(newObject[key]))) isAddEntry = true;

                if (isAddEntry) {
                    const h: any = {};
                    h.addedBy = req.user._id;
                    h.field = fieldsArray[key] !== undefined ? fieldsArray[key] : key;
                    h.previousValue = previousObject[key];
                    h.currentValue = newObject[key];
                    h.createdAt = new Date();
                    h.Consumer = id;
                    const newOne = new HistoryModel(h);
                    await newOne.save();
                }
            });

            return true;
        } catch (err) {
            return true;
        }
    }

    async SupplierHistory(id, previousObject, newObject, req: Request) {
        try {
            if (_.isEmpty(previousObject)) return true;
            Object.keys(newObject).forEach(async (key) => {
                let isAddEntry = false;
                if (notHistoryFields.includes(key)) isAddEntry = false;
                else if (!['serviceType'].includes(key) && newObject[key] !== previousObject[key]) isAddEntry = true;
                else if (['serviceType'].includes(key) && !(JSON.stringify(previousObject[key]) == JSON.stringify(newObject[key]))) isAddEntry = true;
                else isAddEntry = false;

                if (isAddEntry) {
                    const h: any = {};
                    h.addedBy = req.user._id;
                    h.field = fieldsArray[key] !== undefined ? fieldsArray[key] : key;
                    h.previousValue = previousObject[key];
                    h.currentValue = newObject[key];
                    h.createdAt = new Date();
                    h.Supplier = id;
                    const newOne = new HistoryModel(h);
                    await newOne.save();
                }
            });

            return true;
        } catch (err) {
            return true;
        }
    }

    async TaskHistory(id, previousObject, newObject, req: Request) {
        try {
            if (_.isEmpty(previousObject)) return true;
            Object.keys(newObject).forEach(async (key) => {
                let isAddEntry = false;
                if (notHistoryFields.includes(key)) isAddEntry = false;
                else if (!['Status'].includes(key) && newObject[key] !== previousObject[key]) isAddEntry = true;
                else if (['Status'].includes(key) && Number(newObject[key]) !== Number(previousObject[key])) isAddEntry = true;
                else isAddEntry = false;
                if (isAddEntry) {
                    const h: any = {};
                    h.addedBy = req.user._id;
                    h.field = fieldsArray[key] !== undefined ? fieldsArray[key] : key;
                    if (['Status'].includes(key)) {
                        h.previousValue = TaskStuff.TaskStatus[previousObject[key]];
                        h.currentValue = TaskStuff.TaskStatus[newObject[key]];
                    } else if (['Assignee'].includes(key)) {
                        const ad = await UserModel.findOne({ _id: newObject[key] }).select('name');
                        h.currentValue = `${ad.name} assignee updated`;
                    } else if (['Observer'].includes(key)) {
                        const ro = [];
                        const ao = [];
                        previousObject[key].filter((o) => { if (!newObject[key].includes(String(o))) ro.push(String(o)) });
                        newObject[key].filter((o) => { if (!previousObject[key].includes(String(o))) ao.push(String(o)) });

                        const ro_ad = await UserModel.find({ _id: { $in: ro } }).select('name');
                        const ao_ad = await UserModel.find({ _id: { $in: ao } }).select('name');
                        let ro_as = ''
                        let ao_as = ''
                        if (ro.length > 0) {
                            ro_ad.forEach((i, idx, ad) => {
                                if (ad.length === 1) {
                                    ro_as += `${i.name} observer removed`
                                }
                                else if (idx === ad.length - 1) {
                                    ro_as += `and ${i.name} observers removed`
                                } else {
                                    ro_as += `${i.name}, `
                                }
                            });
                        }

                        if (ao.length > 0) {
                            ao_ad.forEach((i, idx, ad) => {
                                if (ad.length === 1) {
                                    ao_as += `${i.name} observer added`
                                }
                                else if (idx === ad.length - 1) {
                                    ao_as += `and ${i.name} observers added`
                                } else {
                                    ao_as += `${i.name}, `
                                }
                            });
                        }
                        if (ro_as && ao_as) h.currentValue = `${ro_as} & ${ao_as}`;
                        if (ro_as && !ao_as) h.currentValue = `${ro_as}`;
                        if (!ro_as && ao_as) h.currentValue = `${ao_as}`;
                    } else if (['Reminder'].includes(key)) {
                        h.currentValue = `Reminder updated`;
                    } else if (['AttachmentHistory'].includes(key)) {
                        h.currentValue = `Attachment added`;
                    } else {
                        h.previousValue = previousObject[key];
                        h.currentValue = newObject[key];
                    }
                    h.createdAt = new Date();
                    h.Task = id;
                    const newOne = new HistoryModel(h);
                    await newOne.save();
                }
            });

            return true;
        } catch (err) {
            return true;
        }
    }

    async QuoteHistory(id, previousObject, newObject, req: Request, forService = '') {
        try {
            if (_.isEmpty(previousObject)) return true;
            Object.keys(newObject).forEach(async (key) => {
                let isAddEntry = false;
                const h: any = {};
                if (notHistoryFields.includes(key)) isAddEntry = false;
                else if (['Extras'].includes(key) && !(JSON.stringify(previousObject[key]) == JSON.stringify(newObject[key]))) {
                    isAddEntry = true;
                    h.field = fieldsArray[key] !== undefined ? fieldsArray[key] : key;
                    h.previousValue = previousObject[key];
                    h.currentValue = newObject[key];
                }
                else if (!['Extras', 'estateAgent', 'lender', 'solicitors'].includes(key) && newObject[key] !== previousObject[key]) {
                    isAddEntry = true;
                    if (forService === 'gas' && key === 'meterNumber') {
                        h.field = 'MPRN';
                    } else {
                        h.field = fieldsArray[key] !== undefined ? fieldsArray[key] : key;
                    }
                    h.previousValue = previousObject[key];
                    h.currentValue = newObject[key];
                }
                else if (['estateAgent', 'lender', 'solicitors'].includes(key)) {
                    Object.keys(previousObject[key]).forEach(el => {
                        if (previousObject[key][el] !== newObject[key][el] && !notHistoryFields.includes(el)) {
                            isAddEntry = true;
                            h.field = fieldsArray[el] !== undefined ? fieldsArray[el] : el;
                            h.previousValue = previousObject[key][el];
                            h.currentValue = newObject[key][el];
                        }
                    });
                }
                else isAddEntry = false;

                h.addedBy = req.user._id;
                h.createdAt = new Date();
                h.Quote = id;
                if (isAddEntry) {
                    const newOne = new HistoryModel(h);
                    await newOne.save();
                }
            });

            return true;
        } catch (err) {
            return true;
        }
    }

    async QuoteActionHistory(id, status, negotiation, req: Request) {
        try {
            const h: any = {};
            h.addedBy = req.user._id;
            h.field = 'Quote Action';
            h.createdAt = new Date();
            h.currentValue = String(status);
            h.Quote = id;
            if (['1004'].includes(String(status))) {
                h.invoice = {
                    name: req.files.Invoice[0].originalname,
                    value: req.files.Invoice[0].location,
                    type: req.files.Invoice[0].mimetype
                }
            } else {
                // 1001, 1002
                h.negotiation = negotiation;
                h.notes = negotiation.Notes;
            }
            if (!negotiation.isLiveDateProvided) {

                const newOne = new HistoryModel(h);
                await newOne.save();
            }
            return true;
        } catch (err) {
            return true;
        }
    }

    async RenewalHistory(id, previousObject, newObject, req: Request, forService = '') {
        try {
            if (_.isEmpty(previousObject)) return true;
            Object.keys(newObject).forEach(async (key) => {
                let isAddEntry = false;
                const h: any = {};
                if (notHistoryFields.includes(key)) isAddEntry = false;
                else if (['Extras'].includes(key) && !(JSON.stringify(previousObject[key]) == JSON.stringify(newObject[key]))) {
                    isAddEntry = true;
                    h.field = fieldsArray[key] !== undefined ? fieldsArray[key] : key;
                    h.previousValue = previousObject[key];
                    h.currentValue = newObject[key];
                }
                else if (!['Extras', 'estateAgent', 'lender', 'solicitors'].includes(key) && newObject[key] !== previousObject[key]) {
                    isAddEntry = true;
                    if (forService === 'gas' && key === 'meterNumber') {
                        h.field = 'MPRN';
                    } else {
                        h.field = fieldsArray[key] !== undefined ? fieldsArray[key] : key;
                    }
                    h.previousValue = previousObject[key];
                    h.currentValue = newObject[key];
                }
                else if (['estateAgent', 'lender', 'solicitors'].includes(key)) {
                    Object.keys(previousObject[key]).forEach(el => {
                        if (previousObject[key][el] !== newObject[key][el] && !notHistoryFields.includes(el)) {
                            isAddEntry = true;
                            h.field = fieldsArray[el] !== undefined ? fieldsArray[el] : el;
                            h.previousValue = previousObject[key][el];
                            h.currentValue = newObject[key][el];
                        }
                    });
                }
                else isAddEntry = false;
                if (req) h.addedBy = req.user._id;
                h.createdAt = new Date();
                h.Renewal = id;
                if (isAddEntry) {
                    const newOne = new HistoryModel(h);
                    await newOne.save();
                }
            });

            return true;
        } catch (err) {
            return true;
        }
    }

    async RenewalActionHistory(id, status, negotiation, req: Request) {
        try {
            const h: any = {};
            h.addedBy = req.user._id;
            h.field = 'Renewal Action';
            h.createdAt = new Date();
            h.currentValue = String(status);
            h.Renewal = id;
            if (['1004'].includes(String(status))) {
                h.invoice = {
                    name: req.files.Invoice[0].originalname,
                    value: req.files.Invoice[0].location,
                    type: req.files.Invoice[0].mimetype
                }
            } else {
                // 1001, 1002
                h.negotiation = negotiation;
                h.notes = negotiation.Notes;
            }

            const newOne = new HistoryModel(h);
            await newOne.save();
            return true;
        } catch (err) {
            return true;
        }
    }
}

export default HistoryController;