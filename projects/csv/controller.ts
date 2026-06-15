const fs = require('fs');
const csv = require('csv-parser');
const async = require('async');
let path = require('path');
let moment = require('moment');

import CompanyModel from '../../models/Company';
import UserModel from '../../models/user';
import SiteModel from '../../models/Site';
import QuoteModel from '../../models/Quotes';
import RenewalModel from '../../models/Renewal';
import SupplierModel from '../../models/Supplier';
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import ControllerUtils from "../../utils/ControllerUtils";
import { Request, Response } from "../../templates/commandInterface";
import { CONSUMER_ROLE_ID } from "../../sharedModules/constants/roleId";
import LeadModel from '../../models/Lead';
import HistoryModule from "../../sharedModules/smallModules/historyModule";
const dirPath = process.env.SERVER === 'local' ? '../../' : '../../../';

const BillDateType = {
    1: 'Date Range',
    2: 'Number Days'
};

const CompanyTypes = {
    'Sole trader': 'Sole trader',
    Partnership: 'Partnership',
    'Limited company': 'Limited company',
    PLCSueb: 'PLCSueb',
    'Registered charity': 'Registered charity',
    Other: 'Other'
};

function formatDate(date) {
    const incomingDate = date;
    if (incomingDate !== undefined && incomingDate) {
        const parts = incomingDate.split('-');
        const newDate = `${parts[1]}-${parts[0]}-${parts[2]}`;
        if (Number.isNaN(Number(new Date(newDate).getTime()))) {
            return new Date().getTime();
        }
        return new Date(newDate).getTime();
    } else {
        return new Date().getTime();
    }
}

export default class CSVController extends ControllerUtils {
    constructor() {
        super();
    }

    saveCSVAndReturnName = async (req: Request, res: Response) => {
        res.send({ success: true, fileName: req.file.filename });
    };

    importCompanyCSVData = async (req: Request, res: Response) => {
        let insertCount: number = 0, AllDataCount: number = 0, companyAlreadyExist: boolean = true,
            AllData: any, companyID: any

        async.series({
            fetchAllData(cb) {
                AllData = [];
                fs
                    .createReadStream(`./uploads/${req.body.fileName}`)
                    .pipe(csv())
                    .on('data', (data) => {
                        AllDataCount++;
                        if (data.Company_Name !== undefined && data.Company_Name) {
                            AllData
                                .push(data);
                        }
                    })
                    .on('end', () => {
                        if (AllData.length < 1) {
                            res.send({ success: true, total: AllDataCount, insert: 0 });
                        } else {
                            cb(null, AllData);
                        }
                    });
            },

            importDataInTheCompanyModule(cb) {
                async.eachSeries(AllData, (singleItem, outerCallback) => {
                    companyAlreadyExist = false;
                    const seriesTasks = [
                        function checkCompanyAlreadyExist(cb2) {
                            CompanyModel
                                .findOne({
                                    businessName: singleItem
                                        .Company_Name
                                        .trim()
                                })
                                .exec((err, result) => {
                                    if (err) {
                                        cb2(err);
                                    } else if (result) {
                                        companyAlreadyExist = true;
                                        cb2(null, 'next');
                                    } else {
                                        companyAlreadyExist = false;
                                        cb2(null, 'next');
                                    }
                                });
                        },

                        function findCompanyId(cb2) {
                            if (!companyAlreadyExist) {
                                CompanyModel
                                    .findOne({
                                        companyID: {
                                            $exists: true
                                        }
                                    })
                                    .sort({ _id: -1 })
                                    .exec((err, result) => {
                                        if (err) {
                                            cb2(err);
                                        } else if (result) {
                                            companyID = Number(result.companyID) + 1;
                                            cb2(null, 'next');
                                        } else {
                                            companyID = 1000;
                                            cb2(null, 'next');
                                        }
                                    });
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        function crateCompany(cb2) {
                            if (!companyAlreadyExist) {
                                const ass = [];
                                let CompanyObj: any = {};
                                CompanyObj.companyID = companyID;
                                CompanyObj.businessName = singleItem.Company_Name;
                                CompanyObj.trendingName = singleItem.Trading_name;
                                CompanyObj.firstLine = singleItem.Address_line_1;
                                CompanyObj.secondLine = singleItem.Address_line_2;
                                CompanyObj.town = singleItem.Town;
                                CompanyObj.country = singleItem.County;
                                CompanyObj.postcode = singleItem.Postcode;
                                CompanyObj.registerNumber = singleItem.Registration_Number;
                                CompanyObj.vatNumber = singleItem.VAT_Number;
                                CompanyObj.isActive = 1;
                                if (singleItem.Company_Type) {
                                    CompanyObj.businessType = CompanyTypes[
                                        singleItem
                                            .Company_Type
                                            .trim()
                                    ] || 'Other';
                                } else {
                                    CompanyObj.businessType = 'Other';
                                }
                                if (req.user.role.roleName === 'Management' || req.user.role.roleName === 'Partner') {
                                    ass.push(req.user._id);
                                }
                                if (ass.length > 0) {
                                    CompanyObj.Assignee = ass;
                                }
                                const newCompany = new CompanyModel(CompanyObj);
                                newCompany.save((err) => {
                                    companyID += 1;
                                    if (err) {
                                        cb2(null, 'next');
                                    } else {
                                        insertCount++;
                                        cb2(null, 'next');
                                    }
                                });
                            } else {
                                cb2(null, 'next');
                            }
                        }
                    ];
                    async.series(seriesTasks, (err, result) => {
                        outerCallback(null, result);
                    });
                }, (err, result) => {
                    cb(null, result);
                });
            },

            deleteThisFile(cb) {
                fs
                    .unlink(`./uploads/${req.body.fileName}`, () => {
                        cb(null, 'next');
                    });
            }

        }, (err) => {
            if (err) {
                res.send({ success: false, AllData });
            } else {
                res.send({ success: true, total: AllDataCount, insert: insertCount, AllData });
            }
        });
    };

    importContactCSVData = async (req: Request, res: Response) => {
        let insertCount: number = 0, AllDataCount: number = 0, AllData: any, contactDetail: any

        async.series({
            fetchAllData(cb) {
                AllData = [];
                fs
                    .createReadStream(`./uploads/${req.body.fileName}`)
                    .pipe(csv())
                    .on('data', (data) => {
                        AllDataCount++;
                        if (data.Email !== undefined && data.Email) {
                            AllData
                                .push(data);
                        }
                    })
                    .on('end', () => {
                        if (AllData.length < 1) {
                            res.send({ success: true, total: AllDataCount, insert: 0 });
                        } else {
                            cb(null, AllData);
                        }
                    });
            },

            importDataInTheUserModule(cb) {
                async.eachSeries(AllData, (singleItem, outerCallback) => {
                    let alreadyExist: boolean = true, isCompanyExist: boolean = true, companyMongoID: any;
                    async.series([
                        function (cb2) {
                            CompanyModel
                                .findOne({
                                    businessName: singleItem
                                        .Company_Name
                                        .trim()
                                })
                                .exec((err, result) => {
                                    if (err) {
                                        isCompanyExist = false;
                                        cb2(err);
                                    } else if (result) {
                                        companyMongoID = result._id;
                                        cb2(null, 'next');
                                    } else {
                                        isCompanyExist = false;
                                        cb2(null, 'next');
                                    }
                                });
                        },

                        function (cb2) {
                            if (isCompanyExist) {
                                UserModel
                                    .findOne({
                                        email: (singleItem.Email).trim()
                                    })
                                    .exec((err, result) => {
                                        if (!result) {
                                            let pass = '123456';
                                            let role = '';
                                            if (singleItem.Portal_Access !== undefined && singleItem.Portal_Access.toLowerCase() === 'yes') {
                                                pass = ((singleItem.Password !== undefined && singleItem.Password) ? singleItem.Password : '123456');
                                                role = '5d5b92031c9d440000c99912';
                                            }
                                            const userData = {
                                                email: singleItem
                                                    .Email
                                                    .toLowerCase(),
                                                password: pass,
                                                companyId: companyMongoID,
                                                mobile: singleItem.Mobile_Number,
                                                name: singleItem.Name,
                                                phone: singleItem.Office_Number,
                                                jobTitle: singleItem.Job_Title,
                                                portalAccess: singleItem.Portal_Access !== undefined
                                                    ? (singleItem.Portal_Access.toLowerCase() === 'yes')
                                                    : false,
                                                role,
                                                createdBy: req.user._id
                                            };
                                            const newUser = new UserModel(userData);
                                            newUser.save((error, newResult) => {
                                                if (error || !newResult) {
                                                    cb2(error);
                                                } else {
                                                    insertCount++;
                                                    contactDetail = newResult;
                                                    cb2(null, 'next');
                                                }
                                            });
                                        } else {
                                            alreadyExist = false;
                                            cb2(null, 'next');
                                        }
                                    });
                            } else {
                                alreadyExist = false;
                                cb2(null, 'next');
                            }
                        },

                        function (cb2) {
                            if (alreadyExist && isCompanyExist) {
                                CompanyModel.updateOne({
                                    _id: companyMongoID
                                }, {
                                    $push: {
                                        Contact: contactDetail._id
                                    }
                                }, (err, result) => {
                                    if (err) {
                                        cb2(null, 'next');
                                    } else {
                                        cb2(null, result);
                                    }
                                });
                            } else {
                                cb2(null, 'next');
                            }
                        }
                    ], (err, result) => {
                        outerCallback(null, result);
                    });
                }, (err, result) => {
                    cb(null, result);
                });
            },

            deleteThisFile(cb) {
                fs
                    .unlink(`./uploads/${req.body.fileName}`, () => {
                        cb(null, 'next');
                    });
            }

        }, (err) => {
            if (err) {
                res.send({ success: false });
            } else {
                res.send({ success: true, total: AllDataCount, insert: insertCount });
            }
        });
    };

    importSiteCSVData = async (req: Request, res: Response) => {
        let insertCount: number = 0, AllDataCount: number = 0, AllData: any, siteDetail: any

        async.series({
            fetchAllData(cb) {
                AllData = [];
                fs
                    .createReadStream(`./uploads/${req.body.fileName}`)
                    .pipe(csv())
                    .on('data', (data) => {
                        AllDataCount++;
                        if (data.Site_Name !== undefined && data.Site_Name) {
                            AllData
                                .push(data);
                        }
                    })
                    .on('end', () => {
                        if (AllData.length < 1) {
                            res.send({ success: true, total: AllDataCount, insert: 0 });
                        } else {
                            cb(null, AllData);
                        }
                    });
            },

            importDataInTheSiteModule(cb) {
                async.eachSeries(AllData, (singleItem, outerCallback) => {
                    let alreadyExist: boolean = true, isCompanyExist: boolean = true, companyMongoID: any = '',
                        Contact: any = '';

                    const seriesTasks = [
                        function findCompanyId(cb2) {
                            CompanyModel
                                .findOne({
                                    businessName: singleItem
                                        .Company_Name
                                        .trim()
                                })
                                .populate({
                                    path: 'Site',
                                    match: {
                                        siteName: singleItem
                                            .Site_Name
                                            .trim()
                                    }
                                })
                                .exec((err, result) => {
                                    if (err) {
                                        isCompanyExist = false;
                                        cb2(err);
                                    } else if (result) {
                                        if (result.Site !== undefined && result.Site.length < 1) {
                                            companyMongoID = result._id;
                                        } else {
                                            isCompanyExist = false;
                                        }
                                        cb2(null, 'next');
                                    } else {
                                        isCompanyExist = false;
                                        cb2(null, 'next');
                                    }
                                });
                        },

                        function findContactInformation(cb2) {
                            if (isCompanyExist) {
                                UserModel
                                    .findOne({
                                        email: (singleItem.Site_Contact_Person).trim()
                                    })
                                    .exec((err, result) => {
                                        if (err || !result) {
                                            Contact = '';
                                            cb2(null, 'next');
                                        } else {
                                            Contact = result._id;
                                            cb2(null, 'next');
                                        }
                                    });
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        function insertSite(cb2) {
                            if (isCompanyExist) {
                                const newSite = new SiteModel({
                                    siteName: singleItem.Site_Name,
                                    siteAddress: singleItem.Site_Address,
                                    town: singleItem.Town,
                                    city: singleItem.City,
                                    country: singleItem.County,
                                    postcode: singleItem.Postcode,
                                    company: companyMongoID,
                                    User: (Contact)
                                        ? [Contact]
                                        : []
                                });

                                newSite.save((err, result) => {
                                    if (err) {
                                        cb2(err);
                                    } else {
                                        insertCount++;
                                        siteDetail = result;
                                        cb2(null, 'next');
                                    }
                                });
                            } else {
                                alreadyExist = false;
                                cb2(null, 'next');
                            }
                        },

                        function updateCompany(cb2) {
                            if (alreadyExist && isCompanyExist) {
                                CompanyModel.updateOne({
                                    _id: companyMongoID
                                }, {
                                    $push: {
                                        Site: [siteDetail._id]
                                    }
                                }, (err, result) => {
                                    if (err) {
                                        cb2(null, 'next');
                                    } else {
                                        cb2(null, result);
                                    }
                                });
                            } else {
                                cb2(null, 'next');
                            }
                        }
                    ];

                    async.series(seriesTasks, (err, result) => {
                        outerCallback(null, result);
                    });
                }, (err, result) => {
                    cb(null, result);
                });
            },

            deleteThisFile(cb) {
                fs
                    .unlink(`./uploads/${req.body.fileName}`, () => {
                        cb(null, 'next');
                    });
            }

        }, (err) => {
            if (err) {
                res.send({ success: false });
            } else {
                res.send({ success: true, total: AllDataCount, insert: insertCount });
            }
        });
    };

    exportCompanyCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        CompanyModel
            .find({})
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let allCompanyData = result.map((single) => {
                        let combine: any = {};
                        combine.Company_Name = single.businessName;
                        combine.Trading_name = single.trendingName;
                        combine.Address_line_1 = single.firstLine;
                        combine.Address_line_2 = single.secondLine;
                        combine.Town = single.town;
                        combine.County = single.country;
                        combine.Postcode = single.postcode;
                        combine.Registration_Number = single.registerNumber;
                        combine.VAT_Number = single.vatNumber;
                        return combine;
                    });

                    if (allCompanyData.length < 1) {
                        allCompanyData = [
                            {
                                Company_Name: '',
                                Trading_name: '',
                                Address_line_1: '',
                                Address_line_2: '',
                                Town: '',
                                County: '',
                                Postcode: '',
                                Registration_Number: '',
                                VAT_Number: '',
                                Partner_Email: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(allCompanyData, 'Company')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Company.csv`));
                    }
                }
            });
    };

    exportContactCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        UserModel
            .find({ role: '5d5b92031c9d440000c99912' })
            .populate('companyId')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let allContacts = result.map((single) => {
                        let combine: any = {};
                        combine.Company_Name = single.companyId !== undefined && single.companyId
                            ? single.companyId.businessName
                            : '';
                        combine.Name = single.name;
                        combine.Office_Number = single.phone;
                        combine.Mobile_Number = single.mobile;
                        combine.Email = single.email;
                        combine.Job_Title = single.jobTitle;
                        combine.Portal_Access = single.portalAccess
                            ? 'Yes'
                            : 'No';
                        return combine;
                    });

                    if (allContacts.length < 1) {
                        allContacts = [
                            {
                                Company_Name: '',
                                Name: '',
                                Office_Number: '',
                                Mobile_Number: '',
                                Email: '',
                                Job_Title: '',
                                Portal_Access: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(allContacts, 'Contact')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Contact.csv`));
                    }
                }
            });
    };

    exportSiteCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();
        SiteModel
            .find({})
            .populate('company User')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let allSites = result.map((single) => {
                        let combine: any = {};
                        combine.Company_Name = single.company !== undefined && single.company
                            ? single.company.businessName
                            : '';
                        combine.Site_Name = single.siteName;
                        combine.Site_Address = single.siteAddress;
                        combine.Town = single.town;
                        combine.City = single.city;
                        combine.County = single.country;
                        combine.Postcode = single.postcode;
                        combine.Site_Contact_Person = single
                            .User
                            .map(user => user.email)
                            .join(', ');
                        return combine;
                    });

                    if (allSites.length < 1) {
                        allSites = [
                            {
                                Company_Name: '',
                                Site_Name: '',
                                Site_Address: '',
                                Town: '',
                                City: '',
                                Country: '',
                                Postcode: '',
                                Site_Contact_Person: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(allSites, 'Site')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Site.csv`));
                    }
                }
            });
    };

    exportGasCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();
        let query = QuoteModel.find({ serviceType: 'Gas' });
        if (req.route.path.includes('renewal')) {
            query = RenewalModel.find({ serviceType: 'Gas' });
        }

        query
            .populate('Company Site User')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let gasQuotes = result
                        .map((single) => {
                            let combine: any = {};
                            combine.Company_Name = single.Company !== undefined
                                ? single.Company.businessName
                                : '';
                            combine.Site_Name = single.Site !== undefined
                                ? single.Site.siteName
                                : '';
                            combine.Contact_Email = commonUtils.findIntroducerEmail(single.User);
                            combine.Meter_Number = single.service.gas !== undefined
                                ? single.service.gas.meterNumber
                                : '';
                            combine.Postcode = single.service.gas !== undefined
                                ? single.service.gas.postcode
                                : '';
                            combine.Supplier = single.service.gas !== undefined
                                ? single.service.gas.current_supplier
                                : '';
                            combine.Contract_Length = single.service.gas !== undefined
                                ? single.service.gas.Contract_length
                                : '';
                            combine.Daily_Charges = single.service.gas !== undefined
                                ? single.service.gas.dailyCharges
                                : '';
                            combine.Unit_Rate = single.service.gas !== undefined
                                ? single.service.gas.unitRate
                                : '';
                            combine.Unit_Rate_KWH = single.service.gas !== undefined
                                ? single.service.gas.kWH
                                : '';
                            combine.Contract_Start_Date = single.service.gas !== undefined
                                ? moment(single.service.gas.contract_start_date).format('DD-MM-YYYY')
                                : '';
                            combine.Bill_Date_Type = single.service.gas !== undefined
                                ? BillDateType[single.service.gas.bill_date_type]
                                : '';
                            combine.Bill_Start_Date = single.service.gas !== undefined
                                ? moment(single.service.gas.bill_start_date).format('DD-MM-YYYY')
                                : '';
                            combine.Bill_End_Date = single.service.gas !== undefined
                                ? moment(single.service.gas.bill_end_date).format('DD-MM-YYYY')
                                : '';
                            combine.Number_Of_Days = single.service.gas !== undefined
                                ? single.service.gas.no_of_days
                                : '';
                            return combine;
                        });

                    if (gasQuotes.length < 1) {
                        gasQuotes = [
                            {
                                Company_Name: '',
                                Site_Name: '',
                                Contact_Email: '',
                                Meter_Number: '',
                                Postcode: '',
                                Supplier: '',
                                Contract_Length: '',
                                Daily_Charges: '',
                                Unit_Rate: '',
                                Unit_Rate_KWH: '',
                                Contract_Start_Date: '',
                                Bill_Date_Type: '',
                                Bill_Start_Date: '',
                                Bill_End_Date: '',
                                Number_Of_Days: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(gasQuotes, 'Gas-Quote')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Gas-Quote.csv`));
                    }
                }
            });
    };

    exportElectricCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        let query = QuoteModel.find({ serviceType: 'Electric' });
        if (req.route.path.includes('renewal')) {
            query = RenewalModel.find({ serviceType: 'Electric' });
        }

        query
            .populate('Company Site User')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let gasQuotes = result.map((single) => {
                        let combine: any = {};

                        combine.Company_Name = single.Company !== undefined
                            ? single.Company.businessName
                            : '';
                        combine.Site_Name = single.Site !== undefined
                            ? single.Site.siteName
                            : '';
                        combine.Contact_Email = commonUtils.findIntroducerEmail(single.User);
                        combine.Meter_Number = single.service.electric !== undefined
                            ? single.service.electric.meterNumber
                            : '';
                        combine.Current_Supplier_Name = single.service.electric !== undefined
                            ? single.service.electric.current_supplier
                            : '';
                        combine.Contract_Length = single.service.electric !== undefined
                            ? single.service.electric.Contract_Length
                            : '';
                        combine.Daily_Charges = single.service.electric !== undefined
                            ? single.service.electric.dailyCharges
                            : '';
                        combine.Contract_Start_Date = single.service.electric !== undefined
                            ? moment(single.service.electric.contract_start_date).format('DD-MM-YYYY')
                            : '';
                        combine.Bill_Date_Type = single.service.electric !== undefined
                            ? BillDateType[single.service.electric.bill_date_type]
                            : '';
                        combine.Bill_Start_Date = single.service.electric !== undefined
                            ? moment(single.service.electric.bill_start_date).format('DD-MM-YYYY')
                            : '';
                        combine.Bill_End_Date = single.service.electric !== undefined
                            ? moment(single.service.electric.bill_end_date).format('DD-MM-YYYY')
                            : '';
                        combine.Number_Of_Days = single.service.electric !== undefined
                            ? single.service.electric.no_of_days
                            : '';
                        combine.Day_Rate = single.service.electric !== undefined
                            ? single.service.electric.unitDayRate
                            : '';
                        combine.Day_KWH = single.service.electric !== undefined
                            ? single.service.electric.unitDaykWh
                            : '';
                        combine.Night_Rate = single.service.electric !== undefined
                            ? single.service.electric.unitNightRate
                            : '';
                        combine.Night_KWH = single.service.electric !== undefined
                            ? single.service.electric.unitNightkWH
                            : '';
                        combine.Weekend_Rate = single.service.electric !== undefined
                            ? single.service.electric.unitWkdRate
                            : '';
                        combine.Weekend_KWH = single.service.electric !== undefined
                            ? single.service.electric.unitWkdkWh
                            : '';
                        combine.Winter_Rate = single.service.electric !== undefined
                            ? single.service.electric.unitWinterRate
                            : '';
                        combine.Winter_KWH = single.service.electric !== undefined
                            ? single.service.electric.unitWinterkWH
                            : '';
                        return combine;
                    });

                    if (gasQuotes.length < 1) {
                        gasQuotes = [
                            {
                                Company_Name: '',
                                Site_Name: '',
                                Contact_Email: '',
                                Meter_Number: '',
                                Current_Supplier_Name: '',
                                Contract_Length: '',
                                Daily_Charges: '',
                                Contract_Start_Date: '',
                                Bill_Date_Type: '',
                                Bill_Start_Date: '',
                                Bill_End_Date: '',
                                Number_Of_Days: '',
                                Day_Rate: '',
                                Day_KWH: '',
                                Night_Rate: '',
                                Night_KWH: '',
                                Weekend_Rate: '',
                                Weekend_KWH: '',
                                Winter_Rate: '',
                                Winter_KWH: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(gasQuotes, 'Electric-Quote')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Electric-Quote.csv`));
                    }
                }
            });
    };

    exportWaterCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        let query = QuoteModel.find({ serviceType: 'Water' });
        if (req.route.path.includes('renewal')) {
            query = RenewalModel.find({ serviceType: 'Water' });
        }

        query
            .populate('Company Site User')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let gasQuotes = result.map((single) => {
                        let combine: any = {};

                        combine.Company_Name = single.Company !== undefined
                            ? single.Company.businessName
                            : '';
                        combine.Site_Name = single.Site !== undefined
                            ? single.Site.siteName
                            : '';
                        combine.Contact_Email = commonUtils.findIntroducerEmail(single.User);
                        combine.Water_Supplier = single.service.water !== undefined
                            ? single.service.water.WaterSupplier
                            : '';
                        combine.Water_Core_Spid = single.service.water !== undefined
                            ? single.service.water.WaterCorespId
                            : '';
                        combine.Core_Spid_Rate = single.service.water !== undefined
                            ? single.service.water.CoreSpidRates
                            : '';
                        combine.Sewage_Spid = single.service.water !== undefined
                            ? single.service.water.SewageSpid
                            : '';
                        combine.Sewage_Apid_Rate = single.service.water !== undefined
                            ? single.service.water.SewageApidRates
                            : '';
                        combine.Water_Meter_SN = single.service.water !== undefined
                            ? single.service.water.WaterMeterSN
                            : '';
                        combine.Water_Annual_Spend = single.service.water !== undefined
                            ? single.service.water.WaterAnnualSpend
                            : '';
                        combine.Water_Discount = single.service.water !== undefined
                            ? single.service.water.WaterDiscount
                            : '';
                        combine.Water_Renewal_Date = single.service.water !== undefined
                            ? moment(single.service.water.WaterRenewalDate).format('DD-MM-YYYY')
                            : '';
                        return combine;
                    });

                    if (gasQuotes.length < 1) {
                        gasQuotes = [
                            {
                                Company_Name: '',
                                Site_Name: '',
                                Contact_Email: '',
                                Water_Supplier: '',
                                Water_Core_Spid: '',
                                Core_Spid_Rate: '',
                                Sewage_Spid: '',
                                Sewage_Apid_Rate: '',
                                Water_Meter_SN: '',
                                Water_Annual_Spend: '',
                                Water_Discount: '',
                                Water_Renewal_Date: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(gasQuotes, 'Water-Quote')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Water-Quote.csv`));
                    }
                }
            });
    };

    exportChipAndPinCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        let query = QuoteModel.find({ serviceType: 'ChipAndPin' });
        if (req.route.path.includes('renewal')) {
            query = RenewalModel.find({ serviceType: 'ChipAndPin' });
        }

        query
            .populate('Company Site User')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let gasQuotes = result.map((single) => {
                        let combine: any = {};

                        combine.Company_Name = single.Company !== undefined
                            ? single.Company.businessName
                            : '';
                        combine.Site_Name = single.Site !== undefined
                            ? single.Site.siteName
                            : '';
                        combine.Contact_Email = commonUtils.findIntroducerEmail(single.User);
                        combine.Machine_Type = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.MachineType
                            : '';
                        combine.Pdq_Finance_Status = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.PDQFinanceStatus
                            : '';
                        combine.No_Of_Terminals = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.NumberTerminals
                            : '';
                        combine.Provider_Ref_Number = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.ProviderRefNumber
                            : '';
                        combine.Merchant_Rental = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.MerchantRental
                            : '';
                        combine.Package = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.Package
                            : '';
                        combine.Anlytics_Cost = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.AnalyticsCost
                            : '';
                        combine.Creditcard_Rate = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.CreditCardRate
                            : '';
                        combine.Debitcard_Rate = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.DebitCardRate
                            : '';
                        combine.Businesscard_Rate = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.BusinessCardRate
                            : '';
                        combine.Deployment_Rent = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.DeploymentCost
                            : '';
                        combine.Authorization_Fees = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.AuthorizationFee
                            : '';
                        combine.Pci_Dss_Charge = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.PCIDSSCharge
                            : '';
                        combine.Connection_Type = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.ConnectionType
                            : '';
                        combine.Delivery_Date = single.service.chipAndPin !== undefined
                            ? moment(single.service.chipAndPin.DeliveryDate).format('DD-MM-YYYY')
                            : '';
                        combine.First_Transaction_Date = single.service.chipAndPin !== undefined
                            ? moment(single.service.chipAndPin.FirstTransactionDate).format('DD-MM-YYYY')
                            : '';
                        combine.Renewal_Date = single.service.chipAndPin !== undefined
                            ? moment(single.service.chipAndPin.RenewalDate).format('DD-MM-YYYY')
                            : '';
                        combine.Pci_Dss_Username = single.service.chipAndPin !== undefined
                            ? single.service.chipAndPin.PCIDSSUserName
                            : '';
                        combine.Pci_Compliment_Date = single.service.chipAndPin !== undefined
                            ? moment(single.service.chipAndPin.PCIComplaintDate).format('DD-MM-YYYY')
                            : '';
                        return combine;
                    });

                    if (gasQuotes.length < 1) {
                        gasQuotes = [
                            {
                                Company_Name: '',
                                Site_Name: '',
                                Contact_Email: '',
                                Machine_Type: '',
                                Pdq_Finance_Status: '',
                                No_Of_Terminals: '',
                                Provider_Ref_Number: '',
                                Merchant_Rental: '',
                                Package: '',
                                Anlytics_Cost: '',
                                Creditcard_Rate: '',
                                Debitcard_Rate: '',
                                Businesscard_Rate: '',
                                Deployment_Rent: '',
                                Authorization_Fees: '',
                                Pci_Dss_Charge: '',
                                Connection_Type: '',
                                Delivery_Date: '',
                                First_Transaction_Date: '',
                                Renewal_Date: '',
                                Pci_Dss_Username: '',
                                Pci_Compliment_Date: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(gasQuotes, 'ChipAndPin-Quote')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/ChipAndPin-Quote.csv`));
                    }
                }
            });
    };

    exportTelecomsCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        let query = QuoteModel.find({ serviceType: 'Telecoms' });
        if (req.route.path.includes('renewal')) {
            query = RenewalModel.find({ serviceType: 'Telecoms' });
        }

        query
            .populate('Company Site User')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let gasQuotes = result.map((single) => {
                        let combine: any = {};

                        combine.Company_Name = single.Company !== undefined
                            ? single.Company.businessName
                            : '';
                        combine.Site_Name = single.Site !== undefined
                            ? single.Site.siteName
                            : '';
                        combine.Contact_Email = commonUtils.findIntroducerEmail(single.User);
                        combine.Phone_Number_One = single.service.telecoms !== undefined
                            ? single.service.telecoms.PhoneNumber1
                            : '';
                        combine.Phone_Number_Two = single.service.telecoms !== undefined
                            ? single.service.telecoms.PhoneNumber2
                            : '';
                        combine.Phone_Number_Three = single.service.telecoms !== undefined
                            ? single.service.telecoms.PhoneNumber3
                            : '';
                        combine.Line_Rental = single.service.telecoms !== undefined
                            ? single.service.telecoms.LineRental
                            : '';
                        combine.Connection_Charge = single.service.telecoms !== undefined
                            ? single.service.telecoms.ConnectionCharges
                            : '';
                        combine.Contract_Length = single.service.telecoms !== undefined
                            ? single.service.telecoms.ContractLength
                            : '';
                        combine.Add_Extras = single.service.telecoms !== undefined
                            ? single.service.telecoms.AddExtras
                            : '';

                        if (single.service.telecoms !== undefined && single.service.telecoms.Extras !== undefined && single.service.telecoms.Extras.length > 0) {
                            combine.Extras = single.service.telecoms !== undefined
                                ? single
                                    .service
                                    .telecoms
                                    .Extras
                                    .toString()
                                : '';
                        }
                        combine.Telecoms_Live_Date = single.service.telecoms !== undefined
                            ? moment(single.service.telecoms.BroadbandLiveDate).format('DD-MM-YYYY')
                            : '';
                        combine.Telecoms_Renewal_Date = single.service.telecoms !== undefined
                            ? moment(single.service.telecoms.BroadbandRenewalDate).format('DD-MM-YYYY')
                            : '';
                        return combine;
                    });

                    if (gasQuotes.length < 1) {
                        gasQuotes = [
                            {
                                Company_Name: '',
                                Site_Name: '',
                                Contact_Email: '',
                                Phone_Number_One: '',
                                Phone_Number_Two: '',
                                Phone_Number_Three: '',
                                Line_Rental: '',
                                Connection_Charge: '',
                                Contract_Length: '',
                                Add_Extras: '',
                                Extras: '',
                                Telecoms_Live_Date: '',
                                Telecoms_Renewal_Date: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(gasQuotes, 'Telecoms-Quote')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Telecoms-Quote.csv`));
                    }
                }
            });
    };

    exportBroadbandCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        let query = QuoteModel.find({ serviceType: 'Broadband' });
        if (req.route.path.includes('renewal')) {
            query = RenewalModel.find({ serviceType: 'Broadband' });
        }

        query
            .populate('Company Site User')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let gasQuotes = result.map((single) => {
                        let combine: any = {};

                        combine.Company_Name = single.Company !== undefined
                            ? single.Company.businessName
                            : '';
                        combine.Site_Name = single.Site !== undefined
                            ? single.Site.siteName
                            : '';
                        combine.Contact_Email = commonUtils.findIntroducerEmail(single.User);
                        combine.Product = single.service.broadband !== undefined
                            ? single.service.broadband.Products
                            : '';
                        combine.Rental = single.service.broadband !== undefined
                            ? single.service.broadband.Rental
                            : '';
                        combine.Connection_Charge = single.service.broadband !== undefined
                            ? single.service.broadband.ConnectionCharges
                            : '';
                        combine.Contract_Length = single.service.broadband !== undefined
                            ? single.service.broadband.ContractLength
                            : '';
                        combine.IP_Address = single.service.broadband !== undefined
                            ? single.service.broadband.IPAddress
                            : '';
                        combine.Router_Model = single.service.broadband !== undefined
                            ? single.service.broadband.RouterModel
                            : '';
                        combine.Serial_Number = single.service.broadband !== undefined
                            ? single.service.broadband.SerialNumber
                            : '';
                        combine.Programmed_Date = single.service.broadband !== undefined
                            ? moment(single.service.broadband.ProgrammedDate).format('DD-MM-YYYY')
                            : '';
                        combine.Broadband_Postage_Proof = single.service.broadband !== undefined
                            ? single.service.broadband.BroadbandPostageProof
                            : '';
                        combine.Broadband_Live_Date = single.service.broadband !== undefined
                            ? moment(single.service.broadband.BroadbandLiveDate).format('DD-MM-YYYY')
                            : '';
                        combine.Broadband_Renew_Date = single.service.broadband !== undefined
                            ? moment(single.service.broadband.BroadbandRenewalDate).format('DD-MM-YYYY')
                            : '';
                        return combine;
                    });

                    if (gasQuotes.length < 1) {
                        gasQuotes = [
                            {
                                Company_Name: '',
                                Site_Name: '',
                                Contact_Email: '',
                                Product: '',
                                Rental: '',
                                Connection_Charge: '',
                                Contract_Length: '',
                                IP_Address: '',
                                Router_Model: '',
                                Serial_Number: '',
                                Programmed_Date: '',
                                Broadband_Postage_Proof: '',
                                Broadband_Live_Date: '',
                                Broadband_Renew_Date: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(gasQuotes, 'Broadband-Quote')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Broadband-Quote.csv`));
                    }
                }
            });
    };

    exportEnergyCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        let query = QuoteModel.find({ serviceType: 'Energy' });
        if (req.route.path.includes('renewal')) {
            query = RenewalModel.find({ serviceType: 'Energy' });
        }

        query
            .populate('Consumer')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let quoteData = result.map((single) => {
                        let combine: any = {};
                        combine.CONSUMERNAME = single.Consumer !== undefined ? single.Consumer.firstName : '';
                        combine.CURRENTARIFF = single.service.energy !== undefined ? single.service.energy.currentTariff : '';
                        combine.ECONOMY = single.service.energy !== undefined ? single.service.energy.economy : '';
                        combine.ELECTRICANNUAL = single.service.energy !== undefined ? single.service.energy.electricAnnual : '';
                        combine.GASANNUAL = single.service.energy !== undefined ? single.service.energy.gasAnnual : '';
                        combine.PAYMENTOPTION = single.service.energy !== undefined ? single.service.energy.paymentOption : '';
                        combine.WARMHOUSEDISCOUNT = single.service.energy !== undefined ? single.service.energy.warmHomeDiscount : '';
                        combine.NEWTARIFF = single.service.energy !== undefined ? single.service.energy.newTariff : '';
                        combine.PROMOTIONCODE = single.service.energy !== undefined ? single.service.energy.pcode : '';
                        combine.ELECTRICANNUALCOST = single.service.energy !== undefined ? single.service.energy.EAnnualCost : '';
                        combine.GASMONTHLYCOST = single.service.energy !== undefined ? single.service.energy.GMonthlyCost : '';
                        return combine;
                    });

                    if (quoteData.length < 1) {
                        quoteData = [
                            {
                                CONSUMERNAME: '',
                                CURRENTARIFF: '',
                                ECONOMY: '',
                                ELECTRICANNUAL: '',
                                GASANNUAL: '',
                                PAYMENTOPTION: '',
                                WARMHOUSEDISCOUNT: '',
                                NEWTARIFF: '',
                                PROMOTIONCODE: '',
                                ELECTRICANNUALCOST: '',
                                GASMONTHLYCOST: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(quoteData, 'Energy-Quote')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Energy-Quote.csv`));
                    }
                }
            });
    };

    exportFuneralCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        let query = QuoteModel.find({ serviceType: 'Funeral' });
        if (req.route.path.includes('renewal')) {
            query = RenewalModel.find({ serviceType: 'Funeral' });
        }

        query
            .populate('Consumer')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let data = result.map((single) => {
                        let combine: any = {};

                        combine.CONSUMERNAME = single.Consumer !== undefined ? single.Consumer.firstName : '';
                        combine.PROVIDERNAME = single.service.funeral !== undefined ? single.service.funeral.funeralProvider : '';
                        combine.NAME = single.service.funeral !== undefined ? single.service.funeral.name : '';
                        combine.PHONE = single.service.funeral !== undefined ? single.service.funeral.phone : '';
                        combine.EMAIL = single.service.funeral !== undefined ? single.service.funeral.email : '';
                        combine.ADDRESS = single.service.funeral !== undefined ? single.service.funeral.address : '';
                        combine.FUNERALTYPE = single.service.funeral !== undefined ? single.service.funeral.funeralType : '';
                        combine.PAYMENTTYPE = single.service.funeral !== undefined ? single.service.funeral.paymentType : '';
                        combine.AGE = single.service.funeral !== undefined ? single.service.funeral.age : '';
                        combine.PAYMENTPLAN = single.service.funeral !== undefined ? single.service.funeral.paymentPlan : '';
                        combine.SPECIALFIELD = single.service.funeral !== undefined ? single.service.funeral.specialRequest : '';
                        return combine;
                    });

                    if (data.length < 1) {
                        data = [
                            {
                                CONSUMERNAME: '',
                                PROVIDERNAME: '',
                                NAME: '',
                                PHONE: '',
                                EMAIL: '',
                                ADDRESS: '',
                                FUNERALTYPE: '',
                                PAYMENTTYPE: '',
                                AGE: '',
                                PAYMENTPLAN: '',
                                SPECIALFIELD: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(data, 'Funeral-Quote')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Funeral-Quote.csv`));
                    }
                }
            });
    };

    exportMortgageCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        let query = QuoteModel.find({ serviceType: 'Mortgage' });
        if (req.route.path.includes('renewal')) {
            query = RenewalModel.find({ serviceType: 'Mortgage' });
        }

        query
            .populate('Consumer')
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let data = result.map((single) => {
                        let combine: any = {};

                        combine.CONSUMERNAME = single.Consumer !== undefined ? single.Consumer.firstName : '';
                        combine.PROPERTYADDRESS = single.service.mortgage !== undefined ? single.service.mortgage.addproperty : '';
                        combine.MORTGAGETYPE = single.service.mortgage !== undefined ? single.service.mortgage.morgage_type : '';
                        combine.PHONE = single.service.mortgage !== undefined ? single.service.mortgage.phone : '';
                        combine.ESTATEAGENTCOMPANYNAME = single.service.mortgage !== undefined && single.service.mortgage.estateAgent !== undefined ? single.service.mortgage.estateAgent.EAcompanyName : '';
                        combine.ESTATEAGENTPHONE = single.service.mortgage !== undefined && single.service.mortgage.estateAgent !== undefined ? single.service.mortgage.estateAgent.EAphoneNumber : '';
                        combine.ESTATEAGENTEMAIL = single.service.mortgage !== undefined && single.service.mortgage.estateAgent !== undefined ? single.service.mortgage.estateAgent.EAcompanyName : '';
                        combine.ESTATEAGENTCONTACTNAME = single.service.mortgage !== undefined && single.service.mortgage.estateAgent !== undefined ? single.service.mortgage.estateAgent.EAnameOfContact : '';
                        combine.SOLICITORSCOMPANYNAME = single.service.mortgage !== undefined && single.service.mortgage.solicitors !== undefined ? single.service.mortgage.solicitors.ScompanyName : '';
                        combine.SOLICITORSPHONE = single.service.mortgage !== undefined && single.service.mortgage.solicitors !== undefined ? single.service.mortgage.solicitors.SphoneNumber : '';
                        combine.SOLICITORSEMAIL = single.service.mortgage !== undefined && single.service.mortgage.solicitors !== undefined ? single.service.mortgage.solicitors.Semail : '';
                        combine.SOLICITORSCONTACTNAME = single.service.mortgage !== undefined && single.service.mortgage.solicitors !== undefined ? single.service.mortgage.solicitors.SnameOfContact : '';
                        combine.LENDERCOMPANYNAME = single.service.mortgage !== undefined && single.service.mortgage.estateAgent !== undefined ? single.service.mortgage.lender.LcompanyName : '';
                        combine.LENDERPHONE = single.service.mortgage !== undefined && single.service.mortgage.lender !== undefined ? single.service.mortgage.lender.LphoneNumber : '';
                        combine.LENDEREMAIL = single.service.mortgage !== undefined && single.service.mortgage.lender !== undefined ? single.service.mortgage.lender.Lemail : '';
                        combine.LENDERCONTACTNAME = single.service.mortgage !== undefined && single.service.mortgage.lender !== undefined ? single.service.mortgage.lender.LnameOfContact : '';
                        combine.PROPERTYVALUE = single.service.mortgage !== undefined ? single.service.mortgage.propertyValue : '';
                        combine.AVAILABLEDEPOSIT = single.service.mortgage !== undefined ? single.service.mortgage.deposit : '';
                        combine.LOANOFVALUE = single.service.mortgage !== undefined ? single.service.mortgage.loanValue : '';
                        combine.CREDITSCORE = single.service.mortgage !== undefined ? moment(single.service.mortgage.creditScore).format('DD-MM-YYYY') : '';
                        combine.VALUATIONDATE = single.service.mortgage !== undefined ? moment(single.service.mortgage.valuationDate).format('DD-MM-YYYY') : '';
                        combine.CONFIRMEDVALUATIONVALUE = single.service.mortgage !== undefined ? single.service.mortgage.cValuation : '';
                        combine.OFFERDATE = single.service.mortgage !== undefined ? moment(single.service.mortgage.dateOffer).format('DD-MM-YYYY') : '';
                        combine.CONTRACTEXCHANGEDATE = single.service.mortgage !== undefined ? moment(single.service.mortgage.contract_exchange_date).format('DD-MM-YYYY') : '';
                        combine.COMPLETIONDATE = single.service.mortgage !== undefined ? moment(single.service.mortgage.completionDate).format('DD-MM-YYYY') : '';
                        combine.LIFEINSURANCE = single.service.mortgage !== undefined ? single.service.mortgage.lifeInsurance : '';
                        combine.CRITICALILLNESS = single.service.mortgage !== undefined ? single.service.mortgage.criticalIllness : '';
                        combine.HOMEINSURANCE = single.service.mortgage !== undefined ? single.service.mortgage.homeInsurance : '';
                        combine.FUNERALPLAN = single.service.mortgage !== undefined ? single.service.mortgage.funeralPlan : '';
                        return combine;
                    });

                    if (data.length < 1) {
                        data = [
                            {
                                CONSUMERNAME: '',
                                PROPERTYADDRESS: '',
                                MORTGAGETYPE: '',
                                PHONE: '',
                                ESTATEAGENTCOMPANYNAME: '',
                                ESTATEAGENTPHONE: '',
                                ESTATEAGENTEMAIL: '',
                                ESTATEAGENTCONTACTNAME: '',
                                SOLICITORSCOMPANYNAME: '',
                                SOLICITORSPHONE: '',
                                SOLICITORSEMAIL: '',
                                SOLICITORSCONTACTNAME: '',
                                LENDERCOMPANYNAME: '',
                                LENDERPHONE: '',
                                LENDEREMAIL: '',
                                LENDERCONTACTNAME: '',
                                PROPERTYVALUE: '',
                                AVAILABLEDEPOSIT: '',
                                LOADOFVALUE: '',
                                CREDITSCORE: '',
                                VALUATIONDATE: '',
                                CONFIRMEDVALUARIONDATE: '',
                                OFFERDATE: '',
                                CONTRACTEXCHANGEDATE: '',
                                COMPLETIONDATE: '',
                                LIFEINSURANCE: '',
                                CRITICALILLNESS: '',
                                HOMEINSURANCE: '',
                                FUNERALPLAN: ''
                            }
                        ];
                    }

                    if (commonUtils.storefiles(data, 'Mortgage-Quote')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Mortgage-Quote.csv`));
                    }
                }
            });
    };

    importQuotesCSVData = async (req: Request, res: Response) => {
        let insertCount: number = 0, AllDataCount: number = 0, AllData: any
        async.series({
            fetchAllData(cb) {
                AllData = [];
                fs
                    .createReadStream(`./uploads/${req.body.fileName}`)
                    .pipe(csv())
                    .on('data', (data) => {
                        AllDataCount++;
                        if (data.Company_Name !== undefined && data.Company_Name) {
                            AllData
                                .push(data);
                        }
                    })
                    .on('end', () => {
                        if (AllData.length < 1) {
                            res.send({ success: true, total: AllDataCount, insert: 0 });
                        } else {
                            cb(null, AllData);
                        }
                    });
            },

            importGasQuotes(cb) {
                async.eachSeries(AllData, (singleItem, outerCallback) => {
                    let SupplierID: number = 0;
                    let alreadyExist: boolean = true;
                    let isCompanyExist: boolean = true;
                    let isSiteExist: boolean = true;
                    let isIntroducerExist: boolean = true;
                    let companyMongoID: any = '';
                    let siteMongoID: any = '';
                    let introducerMongoID: any = '';
                    let partnerMongoID: any = '';
                    let quoteCount: number = 0;
                    let companyID: number = 0;

                    async.series([
                        function (cb2) {
                            CompanyModel
                                .findOne({
                                    businessName: singleItem
                                        .Company_Name
                                        .trim()
                                })
                                .exec((err, result) => {
                                    if (err) {
                                        isCompanyExist = false;
                                        cb2(err);
                                    } else if (result) {
                                        companyMongoID = result._id;
                                        companyID = result.companyID;
                                        cb2(null, 'next');
                                    } else {
                                        isCompanyExist = false;
                                        cb2(null, 'next');
                                    }
                                });
                        },
                        function (cb2) {
                            if (isCompanyExist) {
                                QuoteModel
                                    .find({ Company: companyMongoID })
                                    .countDocuments()
                                    .exec((err, count) => {
                                        if (err) {
                                            cb2(err);
                                        } else {
                                            quoteCount = Number(count) + 1;
                                            cb2(null, 'next');
                                        }
                                    });
                            } else {
                                cb2(null, 'next');
                            }
                        },
                        function (cb2) {
                            SiteModel
                                .findOne({
                                    siteName: singleItem
                                        .Site_Name
                                        .trim(),
                                    company: companyMongoID
                                })
                                .exec((err, result) => {
                                    if (err) {
                                        isSiteExist = false;
                                        cb2(err);
                                    } else if (result) {
                                        siteMongoID = result._id;
                                        cb2(null, 'next');
                                    } else {
                                        isSiteExist = false;
                                        cb2(null, 'next');
                                    }
                                });
                        },
                        function (cb2) {
                            UserModel
                                .findOne({
                                    email: singleItem
                                        .Contact_Email
                                        .trim(),
                                    companyId: companyMongoID
                                })
                                .exec((err, result) => {
                                    if (err) {
                                        isIntroducerExist = false;
                                        cb2(err);
                                    } else if (result) {
                                        introducerMongoID = result._id;
                                        cb2(null, 'next');
                                    } else {
                                        isIntroducerExist = false;
                                        cb2(null, 'next');
                                    }
                                });
                        },
                        function (cb2) {
                            if (singleItem.Supplier !== undefined && singleItem.Supplier) {
                                SupplierModel
                                    .findOne({
                                        supplierName: singleItem
                                            .Supplier
                                            .trim()
                                    })
                                    .exec((err, result) => {
                                        if (err) {
                                            cb2(err);
                                        } else if (result) {
                                            SupplierID = result._id;
                                            cb2(null, 'next');
                                        } else {
                                            cb2(null, 'next');
                                        }
                                    });
                            } else {
                                cb2(null, 'next');
                            }
                        },
                        function (cb2) {
                            if (isCompanyExist && isSiteExist && isIntroducerExist) {
                                let quoteData: any = {};
                                quoteData.QuoteID = `Q${quoteCount}-${companyID}`;
                                if (req.body.type === 'Gas') {
                                    quoteData.service = {
                                        gas: {
                                            bill_date_type: singleItem.Bill_Date_Type,
                                            contract_length: singleItem.Contract_Length,
                                            contract_start_date: formatDate(singleItem.Contract_Start_Date),
                                            current_supplier: singleItem.Supplier,
                                            dailyCharges: singleItem.Daily_Charges,
                                            kWH: singleItem.Unit_Rate_KWH,
                                            meterNumber: singleItem.Meter_Number,
                                            no_of_days: singleItem.Number_Of_Days,
                                            postcode: singleItem.Postcode,
                                            unitRate: singleItem.Unit_Rate,
                                            bill_start_date: formatDate(singleItem.Bill_Start_Date),
                                            bill_end_date: formatDate(singleItem.Bill_End_Date)
                                        }
                                    };
                                } else if (req.body.type === 'Electric') {
                                    quoteData.service = {
                                        electric: {
                                            meterNumber: singleItem.Meter_Number,
                                            current_supplier: singleItem.Current_Supplier_Name,
                                            contract_length: singleItem.Contract_Length,
                                            dailyCharges: singleItem.Daily_Charges,
                                            contract_start_date: formatDate(singleItem.Contract_Start_Date),
                                            bill_date_type: BillDateType[singleItem.Bill_Date_Type],
                                            bill_start_date: formatDate(singleItem.Bill_Start_Date),
                                            bill_end_date: formatDate(singleItem.Bill_End_Date),
                                            no_of_days: singleItem.Number_Of_Days,
                                            unitDayRate: singleItem.Day_Rate,
                                            unitDaykWh: singleItem.Day_KWH,
                                            unitNightRate: singleItem.Night_Rate,
                                            unitNightkWH: singleItem.Night_KWH,
                                            unitWkdRate: singleItem.Weekend_Rate,
                                            unitWkdkWh: singleItem.Weekend_KWH,
                                            unitWinterRate: singleItem.Winter_Rate,
                                            unitWinterkWH: singleItem.Winter_KWH
                                        }
                                    };
                                } else if (req.body.type === 'Water') {
                                    quoteData.service = {
                                        water: {
                                            WaterSupplier: singleItem.Water_Supplier,
                                            WaterCorespId: singleItem.Water_Core_Spid,
                                            CoreSpidRates: singleItem.Core_Spid_Rate,
                                            SewageSpid: singleItem.Sewage_Spid,
                                            SewageApidRates: singleItem.Sewage_Apid_Rate,
                                            WaterRenewalDate: formatDate(singleItem.Water_Renewal_Date),
                                            WaterMeterSN: singleItem.Water_Meter_SN,
                                            WaterAnnualSpend: singleItem.Water_Annual_Spend,
                                            WaterDiscount: singleItem.Water_Discount
                                        }
                                    };
                                } else if (req.body.type === 'ChipAndPin') {
                                    quoteData.service = {
                                        chipAndPin: {
                                            MachineType: singleItem.Machine_Type,
                                            PDQFinanceStatus: singleItem.Pdq_Finance_Status,
                                            NumberTerminals: singleItem.No_Of_Terminals,
                                            ConnectionType: singleItem.Connection_Type,
                                            DeliveryDate: formatDate(singleItem.Delivery_Date),
                                            FirstTransactionDate: formatDate(singleItem.First_Transaction_Date),
                                            RenewalDate: formatDate(singleItem.Renewal_Date),
                                            ProviderRefNumber: singleItem.Provider_Ref_Number,
                                            MerchantRental: singleItem.Merchant_Rental,
                                            Package: singleItem.Package,
                                            AnalyticsCost: singleItem.Anlytics_Cost,
                                            CreditCardRate: singleItem.Creditcard_Rate,
                                            DebitCardRate: singleItem.Debitcard_Rate,
                                            BusinessCardRate: singleItem.Businesscard_Rate,
                                            DeploymentCost: singleItem.Deployment_Rent,
                                            AuthorizationFee: singleItem.Authorization_Fees,
                                            PCIDSSCharge: singleItem.Pci_Dss_Charge,
                                            PCIDSSUserName: singleItem.Pci_Dss_Username,
                                            PCIDSSPassword: singleItem.Pci_Dss_Password,
                                            PCIComplaintDate: formatDate(singleItem.Pci_Compliment_Date)
                                        }
                                    };
                                } else if (req.body.type === 'Telecoms') {
                                    quoteData.service = {
                                        telecoms: {
                                            LineRental: singleItem.Line_Rental,
                                            ConnectionCharges: singleItem.Connection_Charge,
                                            ContractLength: singleItem.Contract_Length,
                                            AddExtras: singleItem.Add_Extras,
                                            Extras: singleItem
                                                .Extras
                                                .split(','),
                                            TelecomsLiveDate: formatDate(singleItem.Telecoms_Live_Date),
                                            TelecomsRenewalDate: formatDate(singleItem.Telecoms_Renewal_Date),
                                            PhoneNumber1: singleItem.Phone_Number_One,
                                            PhoneNumber2: singleItem.Phone_Number_Two,
                                            PhoneNumber3: singleItem.Phone_Number_Three
                                        }
                                    };
                                } else { // Broadband
                                    quoteData.service = {
                                        broadband: {
                                            Products: singleItem.Product,
                                            Rental: singleItem.Rental,
                                            ConnectionCharges: singleItem.Connection_Charge,
                                            ContractLength: singleItem.Contract_Length,
                                            BroadbandLiveDate: formatDate(singleItem.Broadband_Live_Date),
                                            BroadbandRenewalDate: formatDate(singleItem.Broadband_Renew_Date),
                                            ProgrammedDate: formatDate(singleItem.Programmed_Date),
                                            UserName: singleItem.Username,
                                            Password: singleItem.Password,
                                            IPAddress: singleItem.IP_Address,
                                            RouterModel: singleItem.Router_Model,
                                            SerialNumber: singleItem.Serial_Number,
                                            BroadbandPostageProof: singleItem.Broadband_Postage_Proof
                                        }
                                    };
                                }
                                if (SupplierID !== undefined && Number(SupplierID) !== 0) quoteData.Supplier = SupplierID;
                                quoteData.createdBy = req.user._id;
                                quoteData.Company = companyMongoID;
                                quoteData.Site = siteMongoID;
                                quoteData.serviceType = req.body.type;
                                quoteData.quoteStatus = req.body.status ? req.body.status : 1000;
                                const newQuote = new QuoteModel(quoteData);
                                newQuote.save((err, result) => {
                                    if (err) {
                                        cb2(err);
                                    } else {
                                        insertCount++;
                                        cb2(null, result);
                                    }
                                });
                            } else {
                                cb2(null, 'next');
                            }
                        }
                    ], (err, result) => {
                        outerCallback(null, result);
                    });
                }, (err, result) => {
                    cb(null, result);
                });
            },

            deleteThisFile(cb) {
                fs
                    .unlink(`./uploads/${req.body.fileName}`, () => {
                        cb(null, 'next');
                    });
            }

        }, (err) => {
            if (err) {
                res.send({ success: false });
            } else {
                res.send({ success: true, total: AllDataCount, insert: insertCount });
            }
        });
    };

    importRenewalCSVData = async (req: Request, res: Response) => {
        let insertCount: number = 0, AllDataCount: number = 0, AllData: any
        async.series({
            fetchAllData(cb) {
                AllData = [];
                fs
                    .createReadStream(`./uploads/${req.body.fileName}`)
                    .pipe(csv())
                    .on('data', (data) => {
                        AllDataCount++;
                        if (data.Company_Name !== undefined && data.Company_Name) {
                            AllData
                                .push(data);
                        }
                    })
                    .on('end', () => {
                        if (AllData.length < 1) {
                            res.send({ success: true, total: AllDataCount, insert: 0 });
                        } else {
                            cb(null, AllData);
                        }
                    });
            },

            ImportRenewals(cb) {
                async.eachSeries(AllData, (singleItem, outerCallback) => {
                    let SupplierID: number = 0, alreadyExist: boolean = true, isCompanyExist: boolean = true,
                        isSiteExist: boolean = true, isIntroducerExist: boolean = true, companyMongoID: boolean = true,
                        siteMongoID: boolean = true, introducerMongoID: boolean = true,
                        partnerMongoID: any = '',
                        quoteCount: number = 0,
                        companyID: number = 0,
                        nextRenewalID: any;

                    const seriesTasks = [
                        function findCompanyId(cb2) {
                            CompanyModel
                                .findOne({
                                    businessName: singleItem
                                        .Company_Name
                                        .trim()
                                })
                                .exec((err, result) => {
                                    if (err) {
                                        isCompanyExist = false;
                                        cb2(err);
                                    } else if (result) {
                                        companyMongoID = result._id;
                                        companyID = result.companyID;
                                        cb2(null, 'next');
                                    } else {
                                        isCompanyExist = false;
                                        cb2(null, 'next');
                                    }
                                });
                        },

                        function GenerateNextRenewalID(cb2) {
                            RenewalModel
                                .findOne()
                                .sort({ createdAt: -1 })
                                .exec((err, result) => {
                                    if (err) {
                                        cb2(err);
                                    } else if (result) {
                                        const a = result
                                            .RenewalID
                                            .split('-');
                                        nextRenewalID = Number(a[1]) + 1;
                                        cb2(null, 'next');
                                    } else {
                                        nextRenewalID = 1;
                                        cb2(null, 'next');
                                    }
                                });
                        },

                        function findSiteId(cb2) {
                            SiteModel
                                .findOne({
                                    siteName: singleItem
                                        .Site_Name
                                        .trim(),
                                    company: companyMongoID
                                })
                                .exec((err, result) => {
                                    if (err) {
                                        isSiteExist = false;
                                        cb2(err);
                                    } else if (result) {
                                        siteMongoID = result._id;
                                        cb2(null, 'next');
                                    } else {
                                        isSiteExist = false;
                                        cb2(null, 'next');
                                    }
                                });
                        },

                        function findContactId(cb2) {
                            UserModel.findOne({
                                email: singleItem
                                    .Contact_Email
                                    .trim(),
                                companyId: companyMongoID
                            }).exec((err, result) => {
                                if (err) {
                                    isIntroducerExist = false;
                                    cb2(err);
                                } else if (result) {
                                    introducerMongoID = result._id;
                                    cb2(null, 'next');
                                } else {
                                    isIntroducerExist = false;
                                    cb2(null, 'next');
                                }
                            });
                        },

                        function findSupplier(cb2) {
                            if (singleItem.Supplier !== undefined && singleItem.Supplier) {
                                SupplierModel
                                    .findOne({
                                        supplierName: singleItem
                                            .Supplier
                                            .trim()
                                    })
                                    .exec((err, result) => {
                                        if (err) {
                                            cb2(err);
                                        } else if (result) {
                                            SupplierID = result._id;
                                            cb2(null, 'next');
                                        } else {
                                            cb2(null, 'next');
                                        }
                                    });
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        function crateRenewal(cb2) {
                            if (isCompanyExist && isSiteExist && isIntroducerExist) {
                                let renewalData: any = {};
                                renewalData.RenewalID = `REN-${nextRenewalID}`;
                                if (req.body.type === 'Gas') {
                                    renewalData.service = {
                                        gas: {
                                            bill_date_type: singleItem.Bill_Date_Type,
                                            contract_length: singleItem.Contract_Length,
                                            contract_start_date: formatDate(singleItem.Contract_Start_Date),
                                            current_supplier: singleItem.Supplier,
                                            dailyCharges: singleItem.Daily_Charges,
                                            kWH: singleItem.Unit_Rate_KWH,
                                            meterNumber: singleItem.Meter_Number,
                                            no_of_days: singleItem.Number_Of_Days,
                                            postcode: singleItem.Postcode,
                                            unitRate: singleItem.Unit_Rate,
                                            bill_start_date: formatDate(singleItem.Bill_Start_Date),
                                            bill_end_date: formatDate(singleItem.Bill_End_Date)
                                        }
                                    };
                                } else if (req.body.type === 'Electric') {
                                    renewalData.service = {
                                        electric: {
                                            meterNumber: singleItem.Meter_Number,
                                            current_supplier: singleItem.Current_Supplier_Name,
                                            contract_length: singleItem.Contract_Length,
                                            dailyCharges: singleItem.Daily_Charges,
                                            contract_start_date: formatDate(singleItem.Contract_Start_Date),
                                            bill_date_type: BillDateType[singleItem.Bill_Date_Type],
                                            bill_start_date: formatDate(singleItem.Bill_Start_Date),
                                            bill_end_date: formatDate(singleItem.Bill_End_Date),
                                            no_of_days: singleItem.Number_Of_Days,
                                            unitDayRate: singleItem.Day_Rate,
                                            unitDaykWh: singleItem.Day_KWH,
                                            unitNightRate: singleItem.Night_Rate,
                                            unitNightkWH: singleItem.Night_KWH,
                                            unitWkdRate: singleItem.Weekend_Rate,
                                            unitWkdkWh: singleItem.Weekend_KWH,
                                            unitWinterRate: singleItem.Winter_Rate,
                                            unitWinterkWH: singleItem.Winter_KWH
                                        }
                                    };
                                } else if (req.body.type === 'Water') {
                                    renewalData.service = {
                                        water: {
                                            WaterSupplier: singleItem.Water_Supplier,
                                            WaterCorespId: singleItem.Water_Core_Spid,
                                            CoreSpidRates: singleItem.Core_Spid_Rate,
                                            SewageSpid: singleItem.Sewage_Spid,
                                            SewageApidRates: singleItem.Sewage_Apid_Rate,
                                            WaterRenewalDate: formatDate(singleItem.Water_Renewal_Date),
                                            WaterMeterSN: singleItem.Water_Meter_SN,
                                            WaterAnnualSpend: singleItem.Water_Annual_Spend,
                                            WaterDiscount: singleItem.Water_Discount
                                        }
                                    };
                                } else if (req.body.type === 'ChipAndPin') {
                                    renewalData.service = {
                                        chipAndPin: {
                                            MachineType: singleItem.Machine_Type,
                                            PDQFinanceStatus: singleItem.Pdq_Finance_Status,
                                            NumberTerminals: singleItem.No_Of_Terminals,
                                            ConnectionType: singleItem.Connection_Type,
                                            DeliveryDate: formatDate(singleItem.Delivery_Date),
                                            FirstTransactionDate: formatDate(singleItem.First_Transaction_Date),
                                            RenewalDate: formatDate(singleItem.Renewal_Date),
                                            ProviderRefNumber: singleItem.Provider_Ref_Number,
                                            MerchantRental: singleItem.Merchant_Rental,
                                            Package: singleItem.Package,
                                            AnalyticsCost: singleItem.Anlytics_Cost,
                                            CreditCardRate: singleItem.Creditcard_Rate,
                                            DebitCardRate: singleItem.Debitcard_Rate,
                                            BusinessCardRate: singleItem.Businesscard_Rate,
                                            DeploymentCost: singleItem.Deployment_Rent,
                                            AuthorizationFee: singleItem.Authorization_Fees,
                                            PCIDSSCharge: singleItem.Pci_Dss_Charge,
                                            PCIDSSUserName: singleItem.Pci_Dss_Username,
                                            PCIDSSPassword: singleItem.Pci_Dss_Password,
                                            PCIComplaintDate: formatDate(singleItem.Pci_Compliment_Date)
                                        }
                                    };
                                } else if (req.body.type === 'Telecoms') {
                                    renewalData.service = {
                                        telecoms: {
                                            LineRental: singleItem.Line_Rental,
                                            ConnectionCharges: singleItem.Connection_Charge,
                                            ContractLength: singleItem.Contract_Length,
                                            AddExtras: singleItem.Add_Extras,
                                            Extras: singleItem
                                                .Extras
                                                .split(','),
                                            TelecomsLiveDate: formatDate(singleItem.Telecoms_Live_Date),
                                            TelecomsRenewalDate: formatDate(singleItem.Telecoms_Renewal_Date),
                                            PhoneNumber1: singleItem.Phone_Number_One,
                                            PhoneNumber2: singleItem.Phone_Number_Two,
                                            PhoneNumber3: singleItem.Phone_Number_Three
                                        }
                                    };
                                } else { // Broadband
                                    renewalData.service = {
                                        broadband: {
                                            Products: singleItem.Product,
                                            Rental: singleItem.Rental,
                                            ConnectionCharges: singleItem.Connection_Charge,
                                            ContractLength: singleItem.Contract_Length,
                                            BroadbandLiveDate: formatDate(singleItem.Broadband_Live_Date),
                                            BroadbandRenewalDate: formatDate(singleItem.Broadband_Renew_Date),
                                            ProgrammedDate: formatDate(singleItem.Programmed_Date),
                                            UserName: singleItem.Username,
                                            Password: singleItem.Password,
                                            IPAddress: singleItem.IP_Address,
                                            RouterModel: singleItem.Router_Model,
                                            SerialNumber: singleItem.Serial_Number,
                                            BroadbandPostageProof: singleItem.Broadband_Postage_Proof
                                        }
                                    };
                                }
                                if (SupplierID !== undefined && Number(SupplierID) !== 0) {
                                    renewalData.Supplier = SupplierID;
                                }
                                renewalData.createdBy = req.user._id;
                                renewalData.Company = companyMongoID;
                                renewalData.Site = siteMongoID;
                                renewalData.serviceType = req.body.type;
                                renewalData.Status = '1000';
                                const NewRenewal = new RenewalModel(renewalData);
                                NewRenewal.save((err, result) => {
                                    if (err) {
                                        cb2(err);
                                    } else {
                                        insertCount++;
                                        cb2(null, result);
                                    }
                                });
                            } else {
                                cb2(null, 'next');
                            }
                        }
                    ];

                    async.series(seriesTasks, (err, result) => {
                        outerCallback(null, result);
                    });
                }, (err, result) => {
                    cb(null, result);
                });
            },

            deleteThisFile(cb) {
                fs
                    .unlink(`./uploads/${req.body.fileName}`, () => {
                        cb(null, 'next');
                    });
            }

        }, (err) => {
            if (err) {
                res.send({ success: false });
            } else {
                res.send({ success: true, total: AllDataCount, insert: insertCount });
            }
        });
    };

    importConsumerCSVData = async (req: Request, res: Response) => {
        let insertCount: number = 0;
        let AllDataCount: number = 0;
        let consumerAlreadyExist: boolean = true;
        let AllData = req.body.Consumers;
        let consumerId: any;
        let contactMongoId: any;
        let newEmail: any;
        let allAssignee: any = [];
        let consumerMongoID: any;

        async.series({
            importDataInTheConsumerModule(cb) {
                async.eachSeries(AllData, (singleItem, outerCallback) => {
                    consumerAlreadyExist = false;
                    AllDataCount++;
                    contactMongoId = '';
                    newEmail = ''

                    const seriesTasks = [
                        async function createContactWithEmail(cb2) {
                            if (singleItem.EMAIL && !contactMongoId) {
                                let email = '';
                                const sd = await UserModel.findOne({ email: singleItem.EMAIL });
                                if (sd) {
                                    const e = singleItem.EMAIL;
                                    const name = e.substring(0, e.lastIndexOf("@"));
                                    const domain = e.substring(e.lastIndexOf("@") + 1);
                                    let i = 1;
                                    let thisNotExist = true;
                                    while (thisNotExist) {
                                        email = `${name}+${i}@${domain}`;
                                        const isExist = await UserModel.findOne({ email });
                                        if (isExist) {
                                            contactMongoId = isExist._id;
                                            thisNotExist = false;
                                        }
                                        if (!isExist) thisNotExist = false;
                                        i++;
                                    }
                                    newEmail = email;
                                    cb2(null, 'next');
                                } else {
                                    newEmail = singleItem.EMAIL.toLowerCase();
                                    cb2(null, 'next');
                                }
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function createContactWithFirstName(cb2) {
                            if ((singleItem.FIRSTNAME || singleItem.SURNAME) && !contactMongoId && !newEmail) {
                                let email = '';
                                let j = 0;
                                let thisNotExist = true;
                                let n = '';
                                if (singleItem.FIRSTNAME && singleItem.SURNAME) n = `${singleItem.FIRSTNAME.toLowerCase().replace(/\s/g, '')}${singleItem.SURNAME.toLowerCase().replace(/\s/g, '')}`;
                                else if (singleItem.FIRSTNAME) n = `${singleItem.FIRSTNAME.toLowerCase().replace(/\s/g, '')}`;
                                else if (singleItem.SURNAME) n = `${singleItem.SURNAME.toLowerCase().replace(/\s/g, '')}`;
                                while (thisNotExist) {
                                    if (j === 0) {
                                        email = `${n}@thepowerportal.co.uk`;
                                    } else {
                                        email = `${n}+${j}@thepowerportal.co.uk`;
                                    }
                                    const isExist = await UserModel.findOne({ email });
                                    if (isExist) {
                                        contactMongoId = isExist._id;
                                        thisNotExist = false;
                                    }
                                    if (!isExist) thisNotExist = false;
                                    j++;
                                }
                                newEmail = email;
                                cb2(null, 'next');
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        function checkConsumerAlreadyExist(cb2) {
                            if (singleItem.EMAIL || newEmail) {
                                UserModel
                                    .findOne({
                                        email: newEmail.toLowerCase()
                                    })
                                    .exec((err, result) => {
                                        if (err) {
                                            cb2(err);
                                        } else if (result) {
                                            consumerAlreadyExist = true;
                                            cb2(null, 'next');
                                        } else {
                                            consumerAlreadyExist = false;
                                            cb2(null, 'next');
                                        }
                                    });
                            } else {
                                consumerAlreadyExist = true;
                                cb2(null, 'next');
                            }
                        },

                        async function allManagementAssignee(cb2) {
                            if (allAssignee.length < 1) {
                                const aa = [];
                                const AllManagement = await UserModel.find({ role: "5d5b92031c9d440000c99914" }).select('name');
                                AllManagement.map(v => { aa.push(v._id) })
                                allAssignee = aa.filter((value, index, self) => {
                                    return self.indexOf(value) === index;
                                })
                                cb2(null, 'next');
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        function findConsumerId(cb2) {
                            if (!consumerAlreadyExist) {
                                UserModel
                                    .findOne({
                                        consumerId: {
                                            $exists: true
                                        }
                                    })
                                    .sort({ _id: -1 })
                                    .exec((err, result) => {
                                        if (err) {
                                            cb2(err);
                                        } else if (result) {
                                            consumerId = Number(result.consumerId) + 1;
                                            cb2(null, 'next');
                                        } else {
                                            consumerId = 1000;
                                            cb2(null, 'next');
                                        }
                                    });
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        function crateConsumer(cb2) {
                            if (!consumerAlreadyExist && newEmail) {
                                const consumer: any = {};
                                consumer.email = newEmail;
                                consumer.role = CONSUMER_ROLE_ID;
                                consumer.Assignee = allAssignee;
                                consumer.consumerId = consumerId;
                                consumer.title = singleItem.TITLE;
                                consumer.firstName = singleItem.FIRSTNAME;
                                consumer.surName = singleItem.SURNAME;
                                consumer.addressOne = singleItem.ADDRESSONE;
                                consumer.addressTwo = singleItem.ADDRESSTWO;
                                consumer.town = singleItem.TOWN;
                                consumer.city = singleItem.CITY;
                                consumer.postcode = singleItem.POSTCODE;
                                consumer.telephoneNumber = singleItem.TELEPHONENUMBER;
                                consumer.mobile = singleItem.MOBILE;
                                consumer.DOB = singleItem.DOB;
                                consumer.bankName = singleItem.BANKNAME;
                                consumer.sortCode = singleItem.SORTCODE;
                                consumer.accountNumber = singleItem.ACCOUNTNUMBER;
                                consumer.additionalFieldOne = singleItem.ADDITIONALFIELDONE;
                                consumer.additionalFieldTwo = singleItem.ADDITIONALFIELDTWO;
                                const newConsumer = new UserModel(consumer);
                                newConsumer.save((err, result) => {
                                    consumerId += 1;
                                    if (err) {
                                        cb2(null, 'next');
                                    } else {
                                        insertCount++;
                                        consumerMongoID = result._id;

                                        const history = new HistoryModule();
                                        history.ConsumerHistory(result._id, { Create: '' }, { Create: "Consumer created" }, req);
                                        cb2(null, 'next');
                                    }
                                });
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function createLead(cb2) {
                            if (consumerMongoID) {
                                const ConsumerInfo = await UserModel.findById(consumerMongoID);
                                const leadData: any = {};
                                leadData.Consumer = consumerMongoID;
                                // leadData.status = "Lead Imported";
                                leadData.status="New Paid Solar"
                                if (ConsumerInfo && ConsumerInfo.Lead) {
                                    leadData.leadId = `L${ConsumerInfo.Lead.length + 1}-${ConsumerInfo.consumerId}`;

                                } else {
                                    leadData.leadId = `L${1}-${ConsumerInfo.consumerId}`;
                                }
                                // leadData.serviceType = ['Gas', 'Electric', 'Energy', 'Funeral', 'Mortgage'];
                                leadData.serviceType = ['PaidSolar']
                                // leadData.subServiceType = ['Solar']
                                leadData.serviceData = singleItem.service
                                leadData.notesComment = []
                                leadData.leadImportedTag = "PaidSolar"
                                // leadData.source = "Leads.io"
                                console.log("------lead notes-----")
                                console.log(singleItem.leadNotes)
                                if (singleItem.leadNotes && Array.isArray(singleItem.leadNotes) && singleItem.leadNotes.length > 0) {
                                    singleItem.leadNotes.forEach(n => {
                                        leadData.notesComment.push({
                                            addedBy: req.user._id,
                                            notes: n,

                                            timestamps: new Date().getTime(),
                                            createdAt: new Date()
                                        })
                                    })
                                }
                                const newLead = new LeadModel(leadData);
                                newLead.save(async (err, result) => {
                                    if (err) {
                                        cb2(null, 'next');
                                    } else {
                                        await UserModel.updateOne({ _id: consumerMongoID },
                                            {
                                                $push: {
                                                    Lead: [result._id],
                                                }
                                            }
                                        );

                                        const history = new HistoryModule();
                                        history.LeadHistory(newLead._id, { Create: '' }, { Create: "Lead created" }, req);
                                        cb2(null, 'next');
                                    }
                                })
                            } else {
                                cb2(null, 'next');
                            }
                        }
                    ];
                    async.series(seriesTasks, (err, result) => {
                        outerCallback(null, result);
                    });
                }, (err, result) => {
                    cb(null, result);
                });
            }

        }, (err) => {
            if (err) {
                res.send({ success: false });
            } else {
                res.send({ success: true, total: AllDataCount, insert: insertCount });
            }
        });
    };

    importAllInOne = async (req: Request, res: Response) => {
        let insertCount: number = 0;
        let insertContact: number = 0;
        let insertSite: number = 0;
        let insertLead: number = 0;
        let AllDataCount: number = 0;
        let companyAlreadyExist: boolean = true;
        let AllData: any;
        let companyID: any;
        let companyMongoID: any;
        let contactMongoId: any;
        let siteMongoID: any;
        let combine: any = [];
        let isCompanyCreated: boolean;
        let isContactCreated: boolean;
        let isSiteCreated: boolean;
        let isLeadCreated: boolean;
        let allAssignee: any = [];

        async.series({
            fetchAllData(cb) {
                AllData = [];
                fs
                    .createReadStream(`./uploads/${req.body.fileName}`)
                    .pipe(csv())
                    .on('data', (data) => {
                        if (data.BUSINESSNAME !== undefined && data.BUSINESSNAME) {
                            AllDataCount++;
                            AllData.push(data);
                        }
                    })
                    .on('end', () => {
                        if (AllData.length < 1) {
                            res.send({ success: true, total: AllDataCount, insert: 0 });
                        } else {
                            cb(null, AllData);
                        }
                    });
            },

            importDataInTheCompanyModule(cb) {
                async.eachSeries(AllData, async (singleItem, outerCallback) => {
                    companyAlreadyExist = false;
                    companyMongoID = '';
                    contactMongoId = '';
                    isCompanyCreated = false;
                    isContactCreated = false;
                    isSiteCreated = false;
                    isLeadCreated = false;
                    const seriesTasks = [
                        function checkCompanyAlreadyExist(cb2) {
                            CompanyModel
                                .findOne({ businessName: singleItem.BUSINESSNAME.trim() })
                                .exec((err, result) => {
                                    if (err) {
                                        cb2(null, 'next');
                                    } else if (result) {
                                        companyAlreadyExist = true;
                                        companyMongoID = result._id;
                                        cb2(null, 'next');
                                    } else {
                                        companyAlreadyExist = false;
                                        cb2(null, 'next');
                                    }
                                });
                        },

                        function findCompanyId(cb2) {
                            if (!companyAlreadyExist) {
                                CompanyModel
                                    .findOne({ companyID: { $exists: true } })
                                    .sort({ _id: -1 })
                                    .exec((err, result) => {
                                        if (err) {
                                            cb2(null, 'next');
                                        } else if (result) {
                                            companyID = Number(result.companyID) + 1;
                                            cb2(null, 'next');
                                        } else {
                                            companyID = 1000;
                                            cb2(null, 'next');
                                        }
                                    });
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function allManagementAssignee(cb2) {
                            if (allAssignee.length < 1) {
                                const aa = [];
                                const AllManagement = await UserModel.find({ role: "5d5b92031c9d440000c99914" }).select('name');
                                AllManagement.map(v => { aa.push(v._id) })
                                allAssignee = aa.filter((value, index, self) => {
                                    return self.indexOf(value) === index;
                                })
                                cb2(null, 'next');
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function crateCompany(cb2) {
                            if (!companyAlreadyExist) {
                                const ass = [];
                                let CompanyObj: any = {};
                                CompanyObj.companyID = companyID;
                                CompanyObj.Assignee = allAssignee;
                                CompanyObj.businessName = singleItem.BUSINESSNAME;
                                CompanyObj.trendingName = singleItem.TRADINGNAME;
                                CompanyObj.firstLine = singleItem.ADDRESSLINE1;
                                CompanyObj.secondLine = singleItem.ADDRESSLINE2;
                                CompanyObj.town = singleItem.TOWN;
                                CompanyObj.country = singleItem.COUNTY;
                                CompanyObj.postcode = singleItem.POSTCODE;
                                CompanyObj.registerNumber = singleItem.REGISTRATIONNUMBER;
                                CompanyObj.vatNumber = singleItem.VATNUMBER;
                                CompanyObj.gatewayNumber = singleItem.GATEWAYNUMBER;
                                CompanyObj.bankSortcode = singleItem.BANKSORTCODE;
                                CompanyObj.creditScore = singleItem.CREDITSCORE;
                                CompanyObj.creditScoreDate = singleItem.CREDITSCOREDATE;
                                CompanyObj.bankName = singleItem.BANKNAME;
                                CompanyObj.bankAccountNumber = singleItem.BANKACCOUNTNUMBER;
                                CompanyObj.website = singleItem.WEBSITE;
                                CompanyObj.businessSector = singleItem.BUSINESSSECTOR;
                                CompanyObj.isActive = 1;
                                if (singleItem.COMPANYTYPE) {
                                    CompanyObj.businessType = CompanyTypes[
                                        singleItem
                                            .COMPANYTYPE
                                            .trim()
                                    ] || 'Other';
                                } else {
                                    CompanyObj.businessType = 'Other';
                                }
                                if (req.user.role.roleName === 'Management' || req.user.role.roleName === 'Partner') {
                                    ass.push(req.user._id);
                                }
                                if (ass.length > 0) CompanyObj.Assignee = ass;
                                const newCompany = new CompanyModel(CompanyObj);
                                newCompany.save((err, result) => {
                                    companyID += 1;
                                    if (err) {
                                        cb2(null, 'next');
                                    } else {
                                        insertCount++;
                                        companyMongoID = result._id;
                                        isCompanyCreated = true;

                                        const history = new HistoryModule();
                                        history.CompanyHistory(result._id, { Create: '' }, { Create: ("Company created") }, req);

                                        cb2(null, 'next');
                                    }
                                });
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function createContactWithEmail(cb2) {
                            if (singleItem.EMAIL && !contactMongoId) {
                                let email = '';
                                const sd = await UserModel.findOne({ email: singleItem.EMAIL });
                                if (sd) {
                                    if (String(sd.companyId) === String(companyMongoID)) {
                                        contactMongoId = sd._id;
                                        cb2(null, 'next');
                                    } else {
                                        const e = singleItem.EMAIL;
                                        const name = e.substring(0, e.lastIndexOf("@"));
                                        const domain = e.substring(e.lastIndexOf("@") + 1);
                                        let i = 1;
                                        let thisNotExist = true;
                                        while (thisNotExist) {
                                            email = `${name}+${i}@${domain}`;
                                            const isExist = await UserModel.findOne({ email });
                                            if (isExist && String(isExist.companyId) === String(companyMongoID)) {
                                                contactMongoId = isExist._id;
                                                thisNotExist = false;
                                            }
                                            if (!isExist) thisNotExist = false;
                                            i++;
                                        }
                                        if (!contactMongoId) {
                                            const userData = {
                                                email,
                                                companyId: companyMongoID,
                                                mobile: singleItem.MOBILENUMBER,
                                                name: singleItem.NAME ? singleItem.NAME : `${singleItem.TITLE} ${singleItem.FIRSTNAME} ${singleItem.SURNAME}`,
                                                phone: singleItem.OFFICENUMBER,
                                                jobTitle: singleItem.JOBTITLE,
                                                nationalInsurance: singleItem.NATIONAINSURANCE,
                                                createdBy: req.user._id
                                            };
                                            const newUser = new UserModel(userData);
                                            newUser.save((error, newResult) => {
                                                if (error || !newResult) {
                                                    cb2(null, 'next');
                                                } else {
                                                    contactMongoId = newResult._id;
                                                    isContactCreated = true;
                                                    insertContact++;
                                                    const history = new HistoryModule();
                                                    history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Contact created") }, req);
                                                    cb2(null, 'next');
                                                }
                                            })
                                        } else {
                                            cb2(null, 'next');
                                        }
                                    }
                                } else {
                                    email = singleItem.EMAIL.toLowerCase();
                                    const userData = {
                                        email,
                                        companyId: companyMongoID,
                                        mobile: singleItem.MOBILENUMBER,
                                        name: singleItem.NAME ? singleItem.NAME : `${singleItem.TITLE} ${singleItem.FIRSTNAME} ${singleItem.SURNAME}`,
                                        phone: singleItem.OFFICENUMBER,
                                        jobTitle: singleItem.JOBTITLE,
                                        nationalInsurance: singleItem.NATIONAINSURANCE,
                                        createdBy: req.user._id
                                    };
                                    const newUser = new UserModel(userData);
                                    newUser.save((error, newResult) => {
                                        if (error || !newResult) {
                                            cb2(null, 'next');
                                        } else {
                                            contactMongoId = newResult._id;
                                            isContactCreated = true;
                                            insertContact++;

                                            const history = new HistoryModule();
                                            history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Contact created") }, req);

                                            cb2(null, 'next');
                                        }
                                    })
                                }
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function createContactWithName(cb2) {
                            if (singleItem.NAME && !contactMongoId) {
                                let email = '';
                                let j = 0;
                                let thisNotExist = true;
                                while (thisNotExist) {
                                    if (j === 0) {
                                        email = `${singleItem.NAME.toLowerCase().replace(/\s/g, '')}@thepowerportal.co.uk`;
                                    } else {
                                        email = `${singleItem.NAME.toLowerCase().replace(/\s/g, '')}+${j}@thepowerportal.co.uk`;
                                    }
                                    const isExist = await UserModel.findOne({ email });
                                    if (isExist && String(isExist.companyId) === String(companyMongoID)) {
                                        contactMongoId = isExist._id;
                                        thisNotExist = false;
                                    }
                                    if (!isExist) thisNotExist = false;
                                    j++;
                                }
                                if (!contactMongoId) {
                                    const userData = {
                                        email,
                                        companyId: companyMongoID,
                                        mobile: singleItem.MOBILENUMBER,
                                        name: singleItem.NAME ? singleItem.NAME : `${singleItem.TITLE} ${singleItem.FIRSTNAME} ${singleItem.SURNAME}`,
                                        phone: singleItem.OFFICENUMBER,
                                        jobTitle: singleItem.JOBTITLE,
                                        nationalInsurance: singleItem.NATIONAINSURANCE,
                                        createdBy: req.user._id
                                    };
                                    const newUser = new UserModel(userData);
                                    newUser.save((error, newResult) => {
                                        if (error || !newResult) {
                                            cb2(null, 'next');
                                        } else {
                                            contactMongoId = newResult._id;
                                            isContactCreated = true;
                                            insertContact++;

                                            const history = new HistoryModule();
                                            history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Contact created") }, req);

                                            cb2(null, 'next');
                                        }
                                    })
                                } else {
                                    cb2(null, 'next');
                                }
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function createContactWithFirstName(cb2) {
                            if ((singleItem.FIRSTNAME || singleItem.SURNAME) && !contactMongoId) {
                                let email = '';
                                let j = 0;
                                let thisNotExist = true;
                                let n = '';
                                if (singleItem.FIRSTNAME && singleItem.SURNAME) n = `${singleItem.FIRSTNAME.toLowerCase().replace(/\s/g, '')}${singleItem.SURNAME.toLowerCase().replace(/\s/g, '')}`;
                                else if (singleItem.FIRSTNAME) n = `${singleItem.FIRSTNAME.toLowerCase().replace(/\s/g, '')}`;
                                else if (singleItem.SURNAME) n = `${singleItem.SURNAME.toLowerCase().replace(/\s/g, '')}`;
                                while (thisNotExist) {
                                    if (j === 0) {
                                        email = `${n}@thepowerportal.co.uk`;
                                    } else {
                                        email = `${n}+${j}@thepowerportal.co.uk`;
                                    }
                                    const isExist = await UserModel.findOne({ email });
                                    if (isExist && String(isExist.companyId) === String(companyMongoID)) {
                                        contactMongoId = isExist._id;
                                        thisNotExist = false;
                                    }
                                    if (!isExist) thisNotExist = false;
                                    j++;
                                }
                                if (!contactMongoId) {
                                    let DOB = (singleItem.DOB && !isNaN(Date.parse(singleItem.DOB))) ? Date.parse(singleItem.DOB) : Date.now()
                                    const userData = {
                                        email,
                                        DOB,
                                        companyId: companyMongoID,
                                        mobile: singleItem.MOBILENUMBER,
                                        name: singleItem.NAME ? singleItem.NAME : `${singleItem.TITLE} ${singleItem.FIRSTNAME} ${singleItem.SURNAME}`,
                                        phone: singleItem.OFFICENUMBER,
                                        jobTitle: singleItem.JOBTITLE,
                                        nationalInsurance: singleItem.NATIONAINSURANCE,
                                        createdBy: req.user._id
                                    };
                                    const newUser = new UserModel(userData);
                                    newUser.save((error, newResult) => {
                                        if (error || !newResult) {
                                            cb2(null, 'next');
                                        } else {
                                            contactMongoId = newResult._id;
                                            isContactCreated = true;
                                            insertContact++;

                                            const history = new HistoryModule();
                                            history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Contact created") }, req);
                                            cb2(null, 'next');
                                        }
                                    })
                                } else {
                                    cb2(null, 'next');
                                }
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function createSite(cb2) {
                            if (singleItem.SITENAME) {
                                const sd = await SiteModel.findOne({ siteName: singleItem.SITENAME, company: companyMongoID })
                                if (sd) {
                                    if (String(sd.company) === String(companyMongoID)) siteMongoID = sd._id;
                                    cb2(null, 'next');
                                } else {
                                    const newSite = new SiteModel({
                                        siteName: singleItem.SITENAME,
                                        siteAddress: singleItem.SITEADDRESS,
                                        town: singleItem.SITETOWN,
                                        city: singleItem.SITECITY,
                                        country: singleItem.SITECOUNTY,
                                        postcode: singleItem.SITEPOSTCODE,
                                        company: companyMongoID,
                                        User: (contactMongoId)
                                            ? [contactMongoId]
                                            : []
                                    });

                                    newSite.save(async (err, result) => {
                                        if (err) {
                                            cb2(null, 'next');
                                        } else {
                                            siteMongoID = result._id;
                                            isSiteCreated = true;
                                            insertSite++;
                                            await CompanyModel.updateOne({ _id: companyMongoID }, { $push: { Site: [siteMongoID] } });

                                            const history = new HistoryModule();
                                            history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Site created") }, req);
                                            cb2(null, 'next');
                                        }
                                    })
                                }
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function createLead(cb2) {
                            if (singleItem.LEAD && singleItem.LEAD.toLowerCase() === 'yes' && siteMongoID) {
                                const CompanyInformation = await CompanyModel.findById(companyMongoID);
                                const leadData: any = {};
                                leadData.Company = companyMongoID;
                                if (contactMongoId) leadData.Contact = contactMongoId;
                                if (siteMongoID) leadData.Site = siteMongoID;
                                leadData.status = "Lead Imported";
                                leadData.leadId = `L${CompanyInformation.Lead.length + 1}-${CompanyInformation.companyID}`;
                                leadData.serviceType = ['Gas', 'Electric', 'Water', 'ChipAndPin', 'Telecoms', 'Broadband', 'Waste', 'Insurance'];
                                leadData.serviceData = {};
                                leadData.serviceData.gas = {}
                                if (singleItem.MPRN) {
                                    leadData.serviceData.gas.meterNumber = singleItem.MPRN;
                                }
                                if (singleItem.Gas_Current_Contract_End_Date && moment(singleItem.Gas_Current_Contract_End_Date, "DD-MM-YYYY").isValid()) {
                                    leadData.serviceData.gas.previous_contract_start_date = Number(moment(singleItem.Gas_Current_Contract_End_Date, "DD-MM-YYYY").format('x'));
                                }
                                if (singleItem.Gas_Supplier) {
                                    let supplier_id = await SupplierModel.findOne({ supplierName: { $regex: `.*${singleItem.Gas_Supplier.trim()}.*`, $options: "i" } }).select("_id supplierName");
                                    if (supplier_id)
                                        leadData.serviceData.gas.SupplerID = String(supplier_id._id);
                                }
                                if (singleItem.Gas_Aq) {
                                    leadData.serviceData.gas.kWH = singleItem.Gas_Aq;
                                }
                                leadData.serviceData.electric = {};
                                if (singleItem.MPAN && singleItem.MPAN.length == 22) {
                                    leadData.serviceData.electric.topLine = singleItem.MPAN.slice(1, 9)
                                    leadData.serviceData.electric.meterNumber = singleItem.MPAN.slice(9, 22);
                                }
                                if (singleItem.Electric_Current_Contract_End_Date && moment(singleItem.Electric_Current_Contract_End_Date, "DD-MM-YYYY").isValid()) {
                                    leadData.serviceData.electric.previous_contract_start_date = Number(moment(singleItem.Electric_Current_Contract_End_Date, "DD-MM-YYYY").format('x'));
                                }
                                if (singleItem.Electric_Supplier) {
                                    let supplier_id = await SupplierModel.findOne({ supplierName: { $regex: `.*${singleItem.Electric_Supplier.trim()}.*`, $options: "i" } }).select("_id supplierName");
                                    if (supplier_id)
                                        leadData.serviceData.electric.SupplerID = String(supplier_id._id);
                                }
                                if (singleItem.UnitDayKWH) {
                                    leadData.serviceData.electric.unitDaykWh = singleItem.UnitDayKWH;

                                }
                                if (singleItem.UnitNightKWH) {
                                    leadData.serviceData.electric.unitNightkWH = singleItem.UnitNightKWH;
                                }
                                if (singleItem.UnitEveWkd) {
                                    leadData.serviceData.electric.unitWkdkWh = singleItem.UnitEveWkd;
                                }
                                if (singleItem.UnitWinterKWH) {
                                    leadData.serviceData.electric.unitWinterkWH = singleItem.UnitWinterKWH;
                                }

                                const newLead = new LeadModel(leadData);
                                newLead.save(async (err, result) => {
                                    if (err) {
                                        cb2(null, 'next');
                                    } else {
                                        await CompanyModel.updateOne({ _id: companyMongoID },
                                            {
                                                $push: {
                                                    Lead: [result._id],
                                                }
                                            }
                                        );
                                        const history = new HistoryModule();
                                        history.LeadHistory(newLead._id, { create: '' }, { create: ("Lead created") }, req);

                                        isLeadCreated = true;
                                        insertLead++;
                                        cb2(null, 'next');
                                    }
                                })
                            } else {
                                cb2(null, 'next');
                            }
                        },

                        async function logGenerated(cb2) {
                            let thisOne: any = {};
                            thisOne.BUSINESSNAME = singleItem.BUSINESSNAME;
                            thisOne.COMPANY = isCompanyCreated ? 'Yes' : 'No';
                            thisOne.CONTACT = isContactCreated ? 'Yes' : 'No';
                            thisOne.SITE = isSiteCreated ? 'Yes' : 'No';
                            thisOne.LEAD = isLeadCreated ? 'Yes' : 'No';
                            combine.push(thisOne);
                            cb2(null, 'next');
                        }
                    ];
                    async.series(seriesTasks, (err, result) => {
                        outerCallback(null, result);
                    });
                }, (err, result) => {
                    cb(null, result);
                });
            },

            deleteThisFile(cb) {
                fs
                    .unlink(`../../../uploads/${req.body.fileName}`, () => {
                        cb(null, 'next');
                    });
            }

        }, (err) => {
            if (err) {
                res.send({ success: false });
            } else {
                if (commonUtils.storefiles(combine, 'LOG-DETAIL')) {
                    res.send({ success: true, total: AllDataCount, insert: insertCount, insertContact, insertSite, insertLead });
                }
            }
        });
    };

    importAllInOneWithMapping = async (req: Request, res: Response) => {
        try {
            let insertCount: number = 0;
            let insertContact: number = 0;
            let insertSite: number = 0;
            let insertLead: number = 0;
            let AllDataCount: number = 0;
            let companyAlreadyExist: boolean = true;
            let AllData: any;
            let companyID: any;
            let companyMongoID: any;
            let contactMongoId: any;
            let siteMongoID: any;
            let combine: any = [];
            let isCompanyCreated: boolean;
            let isContactCreated: boolean;
            let isSiteCreated: boolean;
            let isLeadCreated: boolean;
            let allAssignee: any = [];
            AllData = req.body;
            AllDataCount = req.body.length;
            async.series({
                importDataInTheCompanyModule(cb) {
                    async.eachSeries(AllData, async (singleItem, outerCallback) => {
                        companyAlreadyExist = false;
                        companyMongoID = '';
                        contactMongoId = '';
                        isCompanyCreated = false;
                        isContactCreated = false;
                        isSiteCreated = false;
                        isLeadCreated = false;
                        const seriesTasks = [
                            function checkCompanyAlreadyExist(cb2) {
                                CompanyModel
                                    .findOne({ businessName: singleItem.BUSINESSNAME.trim() })
                                    .exec((err, result) => {
                                        if (err) {
                                            cb2(null, 'next');
                                        } else if (result) {
                                            companyAlreadyExist = true;
                                            companyMongoID = result._id;
                                            cb2(null, 'next');
                                        } else {
                                            companyAlreadyExist = false;
                                            cb2(null, 'next');
                                        }
                                    });
                            },

                            function findCompanyId(cb2) {
                                if (!companyAlreadyExist) {
                                    CompanyModel
                                        .findOne({ companyID: { $exists: true } })
                                        .sort({ _id: -1 })
                                        .exec((err, result) => {
                                            if (err) {
                                                cb2(null, 'next');
                                            } else if (result) {
                                                companyID = Number(result.companyID) + 1;
                                                cb2(null, 'next');
                                            } else {
                                                companyID = 1000;
                                                cb2(null, 'next');
                                            }
                                        });
                                } else {
                                    cb2(null, 'next');
                                }
                            },

                            async function allManagementAssignee(cb2) {
                                if (allAssignee.length < 1) {
                                    const aa = [];
                                    const AllManagement = await UserModel.find({ role: "5d5b92031c9d440000c99914" }).select('name');
                                    AllManagement.map(v => { aa.push(v._id) })
                                    allAssignee = aa.filter((value, index, self) => {
                                        return self.indexOf(value) === index;
                                    })
                                    cb2(null, 'next');
                                } else {
                                    cb2(null, 'next');
                                }
                            },

                            async function crateCompany(cb2) {
                                if (!companyAlreadyExist) {
                                    const ass = [];
                                    let CompanyObj: any = {};
                                    CompanyObj.companyID = companyID;
                                    CompanyObj.Assignee = allAssignee;
                                    CompanyObj.businessName = singleItem.BUSINESSNAME;
                                    CompanyObj.trendingName = singleItem.TRADINGNAME;
                                    CompanyObj.firstLine = singleItem.ADDRESSLINE1;
                                    CompanyObj.secondLine = singleItem.ADDRESSLINE2;
                                    CompanyObj.town = singleItem.TOWN;
                                    CompanyObj.country = singleItem.COUNTY;
                                    CompanyObj.postcode = singleItem.POSTCODE;
                                    CompanyObj.registerNumber = singleItem.REGISTRATIONNUMBER;
                                    CompanyObj.vatNumber = singleItem.VATNUMBER;
                                    CompanyObj.gatewayNumber = singleItem.GATEWAYNUMBER;
                                    CompanyObj.bankSortcode = singleItem.BANKSORTCODE;
                                    CompanyObj.creditScore = singleItem.CREDITSCORE;
                                    if (singleItem.CREDITSCOREDATE) {
                                        let date: any = new String(singleItem.CREDITSCOREDATE)
                                        date = date.split('/');
                                        if (date.length == 3) {

                                            CompanyObj.creditScoreDate = new Date(`${date[1]}-${date[0]}-${date[2]}`);

                                        }
                                    }
                                    CompanyObj.bankName = singleItem.BANKNAME;
                                    CompanyObj.bankAccountNumber = singleItem.BANKACCOUNTNUMBER;
                                    CompanyObj.website = singleItem.WEBSITE;
                                    CompanyObj.businessSector = singleItem.BUSINESSSECTOR;
                                    CompanyObj.isActive = 1;
                                    if (singleItem.COMPANYTYPE) {
                                        CompanyObj.businessType = CompanyTypes[
                                            singleItem
                                                .COMPANYTYPE
                                                .trim()
                                        ] || 'Other';
                                    } else {
                                        CompanyObj.businessType = 'Other';
                                    }
                                    if (req.user.role.roleName === 'Management' || req.user.role.roleName === 'Partner') {
                                        ass.push(req.user._id);
                                    }
                                    if (ass.length > 0) CompanyObj.Assignee = ass;

                                    const newCompany = new CompanyModel(CompanyObj);
                                    newCompany.save((err, result) => {
                                        companyID += 1;
                                        if (err) {
                                            cb2(null, 'next');
                                        } else {
                                            insertCount++;
                                            companyMongoID = result._id;
                                            isCompanyCreated = true;

                                            const history = new HistoryModule();
                                            history.CompanyHistory(result._id, { Create: '' }, { Create: ("Company created") }, req);

                                            cb2(null, 'next');
                                        }
                                    });
                                } else {
                                    cb2(null, 'next');
                                }
                            },

                            async function createContactWithEmail(cb2) {
                                if (singleItem.EMAIL && !contactMongoId) {
                                    let email = '';
                                    const sd = await UserModel.findOne({ email: singleItem.EMAIL });
                                    if (sd) {
                                        if (String(sd.companyId) === String(companyMongoID)) {
                                            contactMongoId = sd._id;
                                            cb2(null, 'next');
                                        } else {
                                            const e = singleItem.EMAIL;
                                            const name = e.substring(0, e.lastIndexOf("@"));
                                            const domain = e.substring(e.lastIndexOf("@") + 1);
                                            let i = 1;
                                            let thisNotExist = true;
                                            while (thisNotExist) {
                                                email = `${name}+${i}@${domain}`;
                                                const isExist = await UserModel.findOne({ email });
                                                if (isExist && String(isExist.companyId) === String(companyMongoID)) {
                                                    contactMongoId = isExist._id;
                                                    thisNotExist = false;
                                                }
                                                if (!isExist) thisNotExist = false;
                                                i++;
                                            }
                                            if (!contactMongoId) {
                                                const userData = {
                                                    email,
                                                    companyId: companyMongoID,
                                                    mobile: singleItem.MOBILENUMBER,
                                                    name: singleItem.NAME ? singleItem.NAME : `${singleItem.TITLE} ${singleItem.FIRSTNAME} ${singleItem.SURNAME}`,
                                                    phone: singleItem.OFFICENUMBER,
                                                    jobTitle: singleItem.JOBTITLE,
                                                    nationalInsurance: singleItem.NATIONAINSURANCE,
                                                    createdBy: req.user._id
                                                };
                                                const newUser = new UserModel(userData);
                                                newUser.save((error, newResult) => {
                                                    if (error || !newResult) {
                                                        cb2(null, 'next');
                                                    } else {
                                                        contactMongoId = newResult._id;
                                                        isContactCreated = true;
                                                        insertContact++;
                                                        const history = new HistoryModule();
                                                        history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Contact created") }, req);
                                                        cb2(null, 'next');
                                                    }
                                                })
                                            } else {
                                                cb2(null, 'next');
                                            }
                                        }
                                    } else {
                                        email = singleItem.EMAIL.toLowerCase();
                                        const userData = {
                                            email,
                                            companyId: companyMongoID,
                                            mobile: singleItem.MOBILENUMBER,
                                            name: singleItem.NAME ? singleItem.NAME : `${singleItem.TITLE} ${singleItem.FIRSTNAME} ${singleItem.SURNAME}`,
                                            phone: singleItem.OFFICENUMBER,
                                            jobTitle: singleItem.JOBTITLE,
                                            nationalInsurance: singleItem.NATIONAINSURANCE,
                                            createdBy: req.user._id
                                        };
                                        const newUser = new UserModel(userData);
                                        newUser.save((error, newResult) => {
                                            if (error || !newResult) {
                                                cb2(null, 'next');
                                            } else {
                                                contactMongoId = newResult._id;
                                                isContactCreated = true;
                                                insertContact++;

                                                const history = new HistoryModule();
                                                history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Contact created") }, req);

                                                cb2(null, 'next');
                                            }
                                        })
                                    }
                                } else {
                                    cb2(null, 'next');
                                }
                            },

                            async function createContactWithName(cb2) {
                                if (singleItem.NAME && !contactMongoId) {
                                    let email = '';
                                    let j = 0;
                                    let thisNotExist = true;
                                    while (thisNotExist) {
                                        if (j === 0) {
                                            email = `${singleItem.NAME.toLowerCase().replace(/\s/g, '')}@thepowerportal.co.uk`;
                                        } else {
                                            email = `${singleItem.NAME.toLowerCase().replace(/\s/g, '')}+${j}@thepowerportal.co.uk`;
                                        }
                                        const isExist = await UserModel.findOne({ email });
                                        if (isExist && String(isExist.companyId) === String(companyMongoID)) {
                                            contactMongoId = isExist._id;
                                            thisNotExist = false;
                                        }
                                        if (!isExist) thisNotExist = false;
                                        j++;
                                    }
                                    if (!contactMongoId) {
                                        const userData = {
                                            email,
                                            companyId: companyMongoID,
                                            mobile: singleItem.MOBILENUMBER,
                                            name: singleItem.NAME ? singleItem.NAME : `${singleItem.TITLE} ${singleItem.FIRSTNAME} ${singleItem.SURNAME}`,
                                            phone: singleItem.OFFICENUMBER,
                                            jobTitle: singleItem.JOBTITLE,
                                            nationalInsurance: singleItem.NATIONAINSURANCE,
                                            createdBy: req.user._id
                                        };
                                        const newUser = new UserModel(userData);
                                        newUser.save((error, newResult) => {
                                            if (error || !newResult) {
                                                cb2(null, 'next');
                                            } else {
                                                contactMongoId = newResult._id;
                                                isContactCreated = true;
                                                insertContact++;

                                                const history = new HistoryModule();
                                                history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Contact created") }, req);

                                                cb2(null, 'next');
                                            }
                                        })
                                    } else {
                                        cb2(null, 'next');
                                    }
                                } else {
                                    cb2(null, 'next');
                                }
                            },

                            async function createContactWithFirstName(cb2) {
                                if ((singleItem.FIRSTNAME || singleItem.SURNAME) && !contactMongoId) {
                                    let email = '';
                                    let j = 0;
                                    let thisNotExist = true;
                                    let n = '';
                                    if (singleItem.FIRSTNAME && singleItem.SURNAME) n = `${singleItem.FIRSTNAME.toLowerCase().replace(/\s/g, '')}${singleItem.SURNAME.toLowerCase().replace(/\s/g, '')}`;
                                    else if (singleItem.FIRSTNAME) n = `${singleItem.FIRSTNAME.toLowerCase().replace(/\s/g, '')}`;
                                    else if (singleItem.SURNAME) n = `${singleItem.SURNAME.toLowerCase().replace(/\s/g, '')}`;
                                    while (thisNotExist) {
                                        if (j === 0) {
                                            email = `${n}@thepowerportal.co.uk`;
                                        } else {
                                            email = `${n}+${j}@thepowerportal.co.uk`;
                                        }
                                        const isExist = await UserModel.findOne({ email });
                                        if (isExist && String(isExist.companyId) === String(companyMongoID)) {
                                            contactMongoId = isExist._id;
                                            thisNotExist = false;
                                        }
                                        if (!isExist) thisNotExist = false;
                                        j++;
                                    }
                                    if (!contactMongoId) {
                                        let DOB = (singleItem.DOB && !isNaN(Date.parse(singleItem.DOB))) ? Date.parse(singleItem.DOB) : Date.now()
                                        const userData = {
                                            email,
                                            DOB,
                                            companyId: companyMongoID,
                                            mobile: singleItem.MOBILENUMBER,
                                            name: singleItem.NAME ? singleItem.NAME : `${singleItem.TITLE} ${singleItem.FIRSTNAME} ${singleItem.SURNAME}`,
                                            phone: singleItem.OFFICENUMBER,
                                            jobTitle: singleItem.JOBTITLE,
                                            nationalInsurance: singleItem.NATIONAINSURANCE,
                                            createdBy: req.user._id
                                        };
                                        const newUser = new UserModel(userData);
                                        newUser.save((error, newResult) => {
                                            if (error || !newResult) {
                                                cb2(null, 'next');
                                            } else {
                                                contactMongoId = newResult._id;
                                                isContactCreated = true;
                                                insertContact++;

                                                const history = new HistoryModule();
                                                history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Contact created") }, req);
                                                cb2(null, 'next');
                                            }
                                        })
                                    } else {
                                        cb2(null, 'next');
                                    }
                                } else {
                                    cb2(null, 'next');
                                }
                            },

                            async function createSite(cb2) {
                                if (singleItem.SITENAME) {
                                    const sd = await SiteModel.findOne({ siteName: singleItem.SITENAME, company: companyMongoID })
                                    if (sd) {
                                        if (String(sd.company) === String(companyMongoID)) siteMongoID = sd._id;
                                        cb2(null, 'next');
                                    } else {
                                        const newSite = new SiteModel({
                                            siteName: singleItem.SITENAME,
                                            siteAddress: singleItem.SITEADDRESS,
                                            town: singleItem.SITETOWN,
                                            city: singleItem.SITECITY,
                                            country: singleItem.SITECOUNTY,
                                            postcode: singleItem.SITEPOSTCODE,
                                            company: companyMongoID,
                                            User: (contactMongoId)
                                                ? [contactMongoId]
                                                : []
                                        });

                                        newSite.save(async (err, result) => {
                                            if (err) {
                                                cb2(null, 'next');
                                            } else {
                                                siteMongoID = result._id;
                                                isSiteCreated = true;
                                                insertSite++;
                                                await CompanyModel.updateOne({ _id: companyMongoID }, { $push: { Site: [siteMongoID] } });

                                                const history = new HistoryModule();
                                                history.CompanyHistory(companyMongoID, { Create: '' }, { Create: ("Site created") }, req);
                                                cb2(null, 'next');
                                            }
                                        })
                                    }
                                } else {
                                    cb2(null, 'next');
                                }
                            },

                            async function createLead(cb2) {
                                let isLeadDataExist = false;
                                if (siteMongoID) {
                                    const CompanyInformation = await CompanyModel.findById(companyMongoID);
                                    const leadData: any = {};
                                    leadData.Company = companyMongoID;
                                    if (contactMongoId) leadData.Contact = contactMongoId;
                                    if (siteMongoID) leadData.Site = siteMongoID;
                                    leadData.status = "Lead Imported";
                                    leadData.leadId = `L${CompanyInformation.Lead.length + 1}-${CompanyInformation.companyID}`;
                                    leadData.serviceType = ['Gas', 'Electric', 'Water', 'ChipAndPin', 'Telecoms', 'Broadband', 'Waste', 'Insurance', 'BusinessRates'];
                                    let serviceSet = new Set();
                                    leadData.serviceData = {};
                                    leadData.serviceData.gas = {}
                                    if (singleItem.MPRN) {
                                        serviceSet.add('Gas')
                                        leadData.serviceData.gas.meterNumber = singleItem.MPRN;
                                        isLeadDataExist = true;
                                    }
                                    if (singleItem.Gas_Current_Contract_End_Date) {
                                        serviceSet.add('Gas')
                                        let date: any = new String(singleItem.Gas_Current_Contract_End_Date)
                                        if (date.includes('/'))
                                            date = date.split('/');
                                        else if (date.includes('-'))
                                            date = date.split('-');
                                        if (date.length == 3) {

                                            singleItem.Gas_Current_Contract_End_Date = new Date(`${date[1]}-${date[0]}-${date[2]}`);

                                        }
                                    }
                                    if (singleItem.Gas_Current_Contract_End_Date && moment(singleItem.Gas_Current_Contract_End_Date, "DD-MM-YYYY").isValid()) {
                                        leadData.serviceData.gas.previous_contract_start_date = Number(moment(singleItem.Gas_Current_Contract_End_Date, "DD-MM-YYYY").format('x'));
                                        isLeadDataExist = true;
                                    }
                                    if (singleItem.Gas_Supplier) {
                                        serviceSet.add('Gas')
                                        let supplier_id = await SupplierModel.findOne({ supplierName: { $regex: `.*${singleItem.Gas_Supplier.trim()}.*`, $options: "i" } }).select("_id supplierName");
                                        if (supplier_id)
                                            leadData.serviceData.gas.SupplerID = String(supplier_id._id);
                                        isLeadDataExist = true;
                                    }
                                    if (singleItem.Gas_Aq) {
                                        serviceSet.add('Gas')
                                        leadData.serviceData.gas.kWH = singleItem.Gas_Aq;
                                        isLeadDataExist = true;
                                    }
                                    leadData.serviceData.electric = {};
                                    if (singleItem.MPAN) {
                                        serviceSet.add('Electric')
                                        leadData.serviceData.electric.meterNumber = singleItem.MPAN
                                        isLeadDataExist = true;

                                    }
                                    if (singleItem.topLineMPAN) {
                                        serviceSet.add('Electric');
                                        leadData.serviceData.electric.topLine = singleItem.topLineMPAN;
                                        isLeadDataExist = true;

                                    }

                                    if (singleItem.Electric_Current_Contract_End_Date) {
                                        serviceSet.add('Electric')

                                        let date: any = new String(singleItem.Electric_Current_Contract_End_Date)
                                        if (date.includes('/'))
                                            date = date.split('/');
                                        else if (date.includes('-'))
                                            date = date.split('-');
                                        if (date.length == 3) {

                                            singleItem.Electric_Current_Contract_End_Date = new Date(`${date[1]}-${date[0]}-${date[2]}`);

                                        }
                                    }
                                    if (singleItem.Electric_Current_Contract_End_Date && !isNaN(singleItem.Electric_Current_Contract_End_Date.getTime())) {
                                        leadData.serviceData.electric.previous_contract_start_date = singleItem.Electric_Current_Contract_End_Date.getTime();
                                        isLeadDataExist = true;
                                    }
                                    if (singleItem.Electric_Supplier) {
                                        serviceSet.add('Electric')
                                        let supplier_id = await SupplierModel.findOne({ supplierName: { $regex: `.*${singleItem.Electric_Supplier.trim()}.*`, $options: "i" } }).select("_id supplierName");
                                        if (supplier_id)
                                            leadData.serviceData.electric.SupplerID = String(supplier_id._id);
                                        isLeadDataExist = true;
                                    }
                                    if (singleItem.UnitDayKWH) {
                                        serviceSet.add('Electric')
                                        leadData.serviceData.electric.unitDaykWh = singleItem.UnitDayKWH;
                                        isLeadDataExist = true;
                                    }
                                    if (singleItem.UnitNightKWH) {
                                        serviceSet.add('Electric')

                                        leadData.serviceData.electric.unitNightkWH = singleItem.UnitNightKWH;
                                        isLeadDataExist = true;
                                    }
                                    if (singleItem.UnitEveWkd) {
                                        serviceSet.add('Electric')

                                        leadData.serviceData.electric.unitWkdkWh = singleItem.UnitEveWkd;
                                        isLeadDataExist = true;
                                    }
                                    if (singleItem.UnitWinterKWH) {
                                        serviceSet.add('Electric')

                                        leadData.serviceData.electric.unitWinterkWH = singleItem.UnitWinterKWH;
                                        isLeadDataExist = true;
                                    }

                                    leadData.serviceData.chipAndPin = {};
                                    if (singleItem.MIDNUMBER) {
                                        serviceSet.add('ChipAndPin')

                                        leadData.serviceData.chipAndPin.midNumber = singleItem.MIDNUMBER;
                                        isLeadDataExist = true;

                                    }
                                    if (singleItem.ChipAndPin_Current_Contract_End_Date) {
                                        serviceSet.add('ChipAndPin')

                                        let date: any = new String(singleItem.ChipAndPin_Current_Contract_End_Date)
                                        if (date.includes('/'))
                                            date = date.split('/');
                                        else if (date.includes('-'))
                                            date = date.split('-');
                                        if (date.length == 3) {

                                            singleItem.ChipAndPin_Current_Contract_End_Date = new Date(`${date[1]}-${date[0]}-${date[2]}`);

                                        }
                                    }

                                    leadData.serviceData.chipAndPin.previous_contract_start_date = singleItem.ChipAndPin_Current_Contract_End_Date;
                                    if (singleItem.ChipAndPin_Current_Contract_End_Date && !isNaN(singleItem.ChipAndPin_Current_Contract_End_Date.getTime())) {
                                        leadData.serviceData.chipAndPin.previous_contract_start_date = singleItem.ChipAndPin_Current_Contract_End_Date.getTime();
                                        isLeadDataExist = true;
                                    }


                                    if (isLeadDataExist) {
                                        leadData.status = "Lead With Data Imported";
                                    }

                                    const newLead = new LeadModel(leadData);
                                    newLead.save(async (err, result) => {
                                        if (err) {
                                            cb2(null, 'next');
                                        } else {
                                            await CompanyModel.updateOne({ _id: companyMongoID },
                                                {
                                                    $push: {
                                                        Lead: [result._id],
                                                    }
                                                }
                                            );
                                            const history = new HistoryModule();
                                            history.LeadHistory(newLead._id, { create: '' }, { create: ("Lead created") }, req);

                                            isLeadCreated = true;
                                            insertLead++;
                                            cb2(null, 'next');
                                        }
                                    })
                                } else {
                                    cb2(null, 'next');
                                }
                            },

                            async function logGenerated(cb2) {
                                let thisOne: any = {};
                                thisOne.BUSINESSNAME = singleItem.BUSINESSNAME;
                                thisOne.COMPANY = isCompanyCreated ? 'Yes' : 'No';
                                thisOne.CONTACT = isContactCreated ? 'Yes' : 'No';
                                thisOne.SITE = isSiteCreated ? 'Yes' : 'No';
                                thisOne.LEAD = isLeadCreated ? 'Yes' : 'No';
                                combine.push(thisOne);
                                cb2(null, 'next');
                            }
                        ];
                        async.series(seriesTasks, (err, result) => {
                            outerCallback(null, result);
                        });
                    }, (err, result) => {
                        cb(null, result);
                    });
                }
            }, (err) => {
                if (err) {
                    res.send({ success: false });
                } else {
                    if (commonUtils.storefiles(combine, 'LOG-DETAIL')) {
                        res.send({ success: true, total: AllDataCount, insert: insertCount, insertContact, insertSite, insertLead });
                    }
                }
            });
        } catch (error) {

        }
    }
    downloadLogFile = async (req: Request, res: Response) => {
        res.download(path.join(__dirname, `${dirPath}/temp/LOG-DETAIL.csv`));
    };

    exportConsumerCSVData = async (req: Request, res: Response) => {
        commonUtils.removeFiles();

        UserModel
            .find({
                role: '5d5b92031c9d440000c99915'
            })
            .sort({ createdAt: -1 })
            .exec((err, result) => {
                if (err) {
                    res.send(err);
                } else {
                    let ConsumerData = result.map((single) => {
                        let combine: any = {};
                        combine.TITLE = single.title;
                        combine.FIRSTNAME = single.firstName;
                        combine.SURNAME = single.surName;
                        combine.ADDRESSONE = single.addressOne;
                        combine.ADDRESSTWO = single.addressTwo;
                        combine.TOWN = single.town;
                        combine.CITY = single.city;
                        combine.POSTCODE = single.postcode;
                        combine.TELEPHONENUMBER = single.telephoneNumber;
                        combine.MOBILE = single.mobile;
                        combine.EMAIL = single.email;
                        combine.DOB = single.DOB;
                        combine.BANKNAME = single.bankName;
                        combine.SORTCODE = single.sortCode;
                        combine.ACCOUNTNUMBER = single.accountNumber;
                        return combine;
                    });

                    if (ConsumerData.length < 1) {
                        ConsumerData = [
                            {
                                TITLE: '',
                                FIRSTNAME: '',
                                SURNAME: '',
                                ADDRESSONE: '',
                                ADDRESSTWO: '',
                                TOWN: '',
                                CITY: '',
                                POSTCODE: '',
                                TELEPHONENUMBER: '',
                                MOBILE: '',
                                EMAIL: '',
                                DOB: '',
                                BANKNAME: '',
                                SORTCODE: '',
                                ACCOUNTNUMBER: '',
                            }
                        ];
                    }

                    if (commonUtils.storefiles(ConsumerData, 'Consumer')) {
                        res.download(path.join(__dirname, `${dirPath}/temp/Consumer.csv`));
                    }
                }
            });
    };
}