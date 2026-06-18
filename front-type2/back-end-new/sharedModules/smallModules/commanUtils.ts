const mongoose = require('mongoose');
const moment = require('moment');
const { ObjectId } = mongoose.Types;
const fs = require('fs');
const XLSX = require('xlsx');
const path = require('path');
const Promise = require('bluebird');
const async = require('async');
const projection = require('./projection');
import CompanyModel from '../../models/Company';
import QuoteModel from '../../models/Quotes';
import RenewalModel from '../../models/Renewal';
import UserModel from '../../models/user';
import mail from './mail'

const LengthArray = {
    '3 Months': 3,
    '6 Months': 6,
    '1 year': 12,
    '1 Year': 12,
    '2 years': 24,
    '3 years': 36,
    '4 years': 48,
    '5 years': 60,
    '6 years': 72
};

const mongoObject = mongoose.Types.ObjectId;
const mongoSchemaObject = mongoose.Schema.ObjectId;

const sendResponse = (res, data) => {
    res.send(data);
};

const handleErrors = function (err: any, res: any) {
    if (err.name == "MongoError" && err.errmsg.search("supplierId_1_quoteId_1") > 0) {
        return res.send({
            success: false,
            message: "Payment history already available for this quote and supplier",
        });
    }
    if (err.message) {
        res.send({ success: false, message: err.message })
    } else
        res.send({
            success: false,
            err: err,
            message:
                "General Error Check log for more details. error Time" +
                new Date().toString(),
        });
}

const sendErrorResponse = (req, res, err) => {
    apb(req, err);
    handleErrors(err, res);
};

const apb = (req, err) => {
    // console.log("Action performed by:--------", req.user.name, req.user.email);
    // console.log("On date:--------------------", new Date().toString());
    // console.log("Error Message:--------------", err);
}

const commonFilter = (req, filter, stuff) => {
    const { query } = req;
    if (query.Search) {
        // console.log(query.Search , typeof query.Search)
        const sa = [];
        stuff.searchArray.map(e => {
            if(req.query.Search.includes(' ')){
                    let words = req.query.Search.split(' ')
                    words.forEach(w => {
                sa.push({ [e]: { $regex: `.*${w}.*`, $options: "i" } })

                    })
            }else{
                sa.push({ [e]: { $regex: `.*${query.Search}.*`, $options: "i" } })

            }
        })
        filter.$or = sa;
    }
    if (["Partner", "Sales Rep", "Observing Partner","Installer","Service Partner","Surveyor"].includes(req.user.role.roleName)) {
        filter.Assignee = {
            $in: [ObjectId(req.user._id)]
        };
    }
    if (query.isDelete) filter.isDelete = true;
    if (query.Consumer && typeof query.Consumer === 'string') filter.Assignee = { $in: [query.Consumer] };
    if (query.Consumer && typeof query.Consumer === 'object') filter.Assignee = { $in: query.Consumer };
    if (stuff.role) filter.role =  stuff.role;
    if (query.dateTo && query.dateFrom) {
        const date = new Date(query.dateTo);
        filter.createdAt = {
            $lte: new Date(date.setDate(date.getDate() + 1)),
            $gte: new Date(query.dateFrom)
        };
    } else if (query.dateTo) {
        const date = new Date(query.dateTo);
        filter.createdAt = {
            $lte: new Date(date.setDate(date.getDate() + 1))
        };
    } else if (query.dateFrom) {
        filter.createdAt = {
            $gte: new Date(query.dateFrom)
        };
    }
    return filter;
};

const dateFilter = (req, filter, stuff) => {
    if (req.query.dateTo && req.query.dateFrom) {
        const date = new Date(req.query.dateTo);
        filter.createdAt = {
            $lte: new Date(date.setDate(date.getDate() + 1)),
            $gte: new Date(req.query.dateFrom)
        };
    } else if (req.query.dateTo) {
        const date = new Date(req.query.dateTo);
        filter.createdAt = {
            $lte: new Date(date.setDate(date.getDate() + 1))
        };
    } else if (req.query.dateFrom) {
        filter.createdAt = {
            $gte: new Date(req.query.dateFrom)
        };
    }
    return filter;
}

const creatingFindQueryFromResponse = (modelschema, req, res, next) => {
    let query;
    const Model = require(`../models/${modelschema}`);
    if (req.body.filter) {
        query = Model.find(req.body.filter);
    } else {
        query = Model.find({});
    }
    if (req.body.skip) query = query.skip(req.body.skip);
    if (req.body.projection) query = query.projection(req.body.projection);
    if (req.body.limit) query = query.limit(req.body.limit);
    if (req.body.populate) query = query.populate(req.body.populate);
    query = query.lean();
    req.body.query = query;
    next();
};

const newFindQuery = (Schema, filterOptions) => {
    let query;
    if (filterOptions.filterType) {
        if (filterOptions.filterType === 'byid') {
            query = Schema.findById(filterOptions.filter.id);
        } else if (filterOptions.filterType === 'findOne') {
            query = Schema.findOne(filterOptions.filter);
        } else {
            query = Schema.find();
        }
    } else if (filterOptions.filter) {
        query = Schema.find(filterOptions.filter);
    } else {
        query = Schema.find();
    }

    if (filterOptions.skip) query = query.skip(filterOptions.skip);
    if (filterOptions.projection) query = query.projection(filterOptions.projection);
    if (filterOptions.populate && filterOptions.populateSelect) {
        query = query.populate(filterOptions.populate, filterOptions.populateSelect);
    } else {
        query = query.populate(filterOptions.populate);
    }
    if (filterOptions.select) query = query.select(filterOptions.select);
    query = query.lean();
    return query;
};


const commonFindQuery = (collection, query) => {
    if (query.skip) collection.skip(Number(query.skip))
    if (query.limit) collection.limit(Number(query.limit));
    if (query.sort) {
        const sortType = query.sortType === 'asc' ? 1 : -1;
        collection.sort([[query.sort, sortType]]);
    }
    return collection;
};

const commanFindQuery = (collection, query) => {
    if (query.skip) {
        collection.skip(Number(query.skip));
    }
    if (query.limit) {
        collection.limit(Number(query.limit));
    }
    if (query.sort) {
        const sortType = query.sortType === 'asc'
            ? 1
            : -1;
        collection.sort([
            [query.sort, sortType]
        ]);
    }
    return collection;
};

const commanFindQueryForUsers = (collection, query) => {
    if (query.skip && query.limit) {
        collection.slice(Number(query.skip) * Number(query.limit), Number(query.limit));
    }
    return collection;
};

const formateDate = dt => `${dt.getDate()}/${dt.getMonth()}/${dt.getFullYear()}`;

const SendMailToAllQuoteUser = requestObject => new Promise((resolve: any, reject: any) => {
    // resolve({ success: true });
    let that = this;
    that.PI = [];
    that.M = [];

    async.series({
        FindAllPI: (cb) => {
            if (requestObject.CompanyID) {
                CompanyModel
                    .findById(requestObject.CompanyID)
                    .populate({
                        path: 'Assignee',
                        populate: {
                            path: 'role'
                        }
                    })
                    .then((resp) => {
                        that.CompanyInfo = resp;
                        resp
                            .Assignee
                            .map((s) => {
                                if (String(s.role._id) === '5d5b92031c9d440000c99912' || String(s.role._id) === '5d5b92031c9d440000c99911') {
                                    that
                                        .PI
                                        .push(s);
                                }
                                if (String(s.role._id) === '5d5b92031c9d440000c99914') {
                                    that.M.push(s);
                                }
                            });

                        cb(null, 'next');
                    })
                    .catch(resp => cb(resp));
            }

            if (requestObject.ConsumerID) {
                UserModel
                    .findById(requestObject.ConsumerID)
                    .populate({
                        path: 'Assignee',
                        populate: {
                            path: 'role'
                        }
                    })
                    .then((resp) => {
                        that.ConsumerInfo = resp;
                        resp
                            .Assignee
                            .map((s) => {
                                if (String(s.role._id) === '5d5b92031c9d440000c99912' || String(s.role._id) === '5d5b92031c9d440000c99911') {
                                    that
                                        .PI
                                        .push(s);
                                }
                                if (String(s.role._id) === '5d5b92031c9d440000c99914') {
                                    that.M.push(s);
                                }
                            });

                        cb(null, 'next');
                    })
                    .catch(resp => cb(resp));
            }

        },

        FindQuoteInformation: (cb) => {
            QuoteModel
                .findById(requestObject.QuoteID)
                .exec((err, result) => {
                    if (err) {
                        cb(err);
                    } else {
                        that.QuoteInformation = result;
                        cb(null, result);
                    }
                });
        },

        sendMail: (cb) => {
            if (requestObject.Status && [1002, 1003, 1009, 2000].includes(Number(requestObject.Status)) && that.M.length > 0) {
                that.M.forEach((m) => {
                    console.log('sending mail to mgt', m.email);
                    mail
                        .sendmail(m.email, mail.templates[requestObject.QuoteEmailType], {
                            CompanyName: that.CompanyInfo && that.CompanyInfo.businessName,
                            ConsumerTitle: that.ConsumerInfo && that.ConsumerInfo.title,
                            ConsumerFirstName: that.ConsumerInfo && that.ConsumerInfo.firstName,
                            ConsumerSurName: that.ConsumerInfo && that.ConsumerInfo.surName,
                            Name: m.name,
                            QuoteID: that.QuoteInformation.QuoteID,
                            QuoteCreatedDate: moment().format('DD-MM-YYYY'),
                            CustomerNotes: '',
                            ContractLength: requestObject.ContractLength !== undefined
                                ? requestObject.ContractLength
                                : '',
                            ExpiryDate: requestObject.ExpiryDate !== undefined
                                ? moment(requestObject.ExpiryDate).format('DD-MM-YYYY')
                                : '',
                            Amount: requestObject.Amount !== undefined
                                ? requestObject.Amount
                                : '',
                            Notes: requestObject.Notes !== undefined
                                ? requestObject.Notes
                                : ''
                        });
                });
            }
            if (requestObject.Status && [1000, 1001, 1002, 1003, 1004, 1005, 1008, 1009, 1012, 2001].includes(Number(requestObject.Status)) && that.PI.length > 0) {
                that.PI.forEach((su) => {
                    console.log('sending mail to PI', su.email);
                    mail
                        .sendmail(su.email, mail.templates[requestObject.QuoteEmailType], {
                            CompanyName: that.CompanyInfo && that.CompanyInfo.businessName,
                            ConsumerTitle: that.ConsumerInfo && that.ConsumerInfo.title,
                            ConsumerFirstName: that.ConsumerInfo && that.ConsumerInfo.firstName,
                            ConsumerSurName: that.ConsumerInfo && that.ConsumerInfo.surName,
                            Name: su.name,
                            QuoteID: that.QuoteInformation.QuoteID,
                            QuoteCreatedDate: moment().format('DD-MM-YYYY'),
                            CustomerNotes: '',
                            ContractLength: requestObject.ContractLength !== undefined
                                ? requestObject.ContractLength
                                : '',
                            ExpiryDate: requestObject.ExpiryDate !== undefined
                                ? moment(requestObject.ExpiryDate).format('DD-MM-YYYY')
                                : '',
                            Amount: requestObject.Amount !== undefined
                                ? requestObject.Amount
                                : '',
                            Notes: requestObject.Notes !== undefined
                                ? requestObject.Notes
                                : ''
                        });
                });
            }
            cb(null, 'next');
        }
    }, (err) => {
        if (err) {
            reject({ success: false });
        } else {
            resolve({ success: true });
        }
    });
});

const SendMailToAllRenewalUser = requestObject => new Promise((resolve, reject) => {
    // resolve({ success: true });
    const that = this;
    that.PI = [];
    that.M = [];
    that.RenewalInformation = {};

    async.series({

        FindAllPI: (cb) => {
            if (requestObject.CompanyID) {
                CompanyModel
                    .findById(requestObject.CompanyID)
                    .populate({
                        path: 'Assignee',
                        populate: {
                            path: 'role'
                        }
                    })
                    .then((resp) => {
                        that.CompanyInfo = resp;
                        resp
                            .Assignee
                            .map((s) => {
                                if (String(s.role._id) === '5d5b92031c9d440000c99912' || String(s.role._id) === '5d5b92031c9d440000c99911') {
                                    that
                                        .PI
                                        .push(s);
                                }
                                if (String(s.role._id) === '5d5b92031c9d440000c99914') {
                                    that.M.push(s);
                                }
                            });

                        cb(null, 'next');
                    })
                    .catch(resp => cb(resp));
            }

            if (requestObject.ConsumerID) {
                UserModel
                    .findById(requestObject.ConsumerID)
                    .populate({
                        path: 'Assignee',
                        populate: {
                            path: 'role'
                        }
                    })
                    .then((resp) => {
                        that.ConsumerInfo = resp;
                        resp
                            .Assignee
                            .map((s) => {
                                if (String(s.role._id) === '5d5b92031c9d440000c99912' || String(s.role._id) === '5d5b92031c9d440000c99911') {
                                    that
                                        .PI
                                        .push(s);
                                }
                                if (String(s.role._id) === '5d5b92031c9d440000c99914') {
                                    that.M.push(s);
                                }
                            });

                        cb(null, 'next');
                    })
                    .catch(resp => cb(resp));
            }

        },

        FindRenewalInformation: (cb) => {
            RenewalModel
                .findById(requestObject.RenewalID)
                .exec((err, result) => {
                    if (err) {
                        cb(err);
                    } else {
                        that.RenewalInformation = result;
                        cb(null, result);
                    }
                });
        },

        sendMail: (cb) => {
            if (requestObject.Status && [1002, 1003, 1009, 1011].includes(Number(requestObject.Status)) && that.M.length > 0) {
                that.M.forEach((m) => {
                    console.log('sending mail to mgt', m.email);
                    mail
                        .sendmail(m.email, mail.templates[requestObject.EmailType], {
                            CompanyName: that.CompanyInfo && that.CompanyInfo.businessName,
                            ConsumerTitle: that.ConsumerInfo && that.ConsumerInfo.title,
                            ConsumerFirstName: that.ConsumerInfo && that.ConsumerInfo.firstName,
                            ConsumerSurName: that.ConsumerInfo && that.ConsumerInfo.surName,
                            Name: m.name,
                            RenewalID: that.RenewalInformation.RenewalID,
                            QuoteCreatedDate: moment().format('DD-MM-YYYY'),
                            CustomerNotes: '',
                            ContractLength: requestObject.ContractLength !== undefined
                                ? requestObject.ContractLength
                                : '',
                            ExpiryDate: requestObject.ExpiryDate !== undefined
                                ? moment(requestObject.ExpiryDate).format('DD-MM-YYYY')
                                : '',
                            Amount: requestObject.Amount !== undefined
                                ? requestObject.Amount
                                : '',
                            Notes: requestObject.Notes !== undefined
                                ? requestObject.Notes
                                : ''
                        });
                });
            }
            if (requestObject.Status && [1000, 1001, 1002, 1003, 1004, 1005, 1008, 1009, 1012].includes(Number(requestObject.Status)) && that.PI.length > 0) {
                that.PI.forEach((su) => {
                    console.log('sending mail to PI', su.email);
                    mail
                        .sendmail(su.email, mail.templates[requestObject.EmailType], {
                            CompanyName: that.CompanyInfo && that.CompanyInfo.businessName,
                            ConsumerTitle: that.ConsumerInfo && that.ConsumerInfo.title,
                            ConsumerFirstName: that.ConsumerInfo && that.ConsumerInfo.firstName,
                            ConsumerSurName: that.ConsumerInfo && that.ConsumerInfo.surName,
                            Name: su.name,
                            RenewalID: that.RenewalInformation.RenewalID,
                            QuoteCreatedDate: moment().format('DD-MM-YYYY'),
                            CustomerNotes: '',
                            ContractLength: requestObject.ContractLength !== undefined
                                ? requestObject.ContractLength
                                : '',
                            ExpiryDate: requestObject.ExpiryDate !== undefined
                                ? moment(requestObject.ExpiryDate).format('DD-MM-YYYY')
                                : '',
                            Amount: requestObject.Amount !== undefined
                                ? requestObject.Amount
                                : '',
                            Notes: requestObject.Notes !== undefined
                                ? requestObject.Notes
                                : ''
                        });
                });
            }
            cb(null, 'next');
        }
    }, (err) => {
        if (err) {
            reject({ success: false });
        } else {
            resolve({ success: true });
        }
    });
});

const SendMailUsers = (requestObject, EmailType) => new Promise((resolve, reject) => {
    // resolve({ success: true });
    async.series({
        sendMail: (cb) => {
            if (requestObject.Assignee !== undefined && requestObject.Assignee) {
                // let formatted_date = Date.parse(requestObject.DueDate).getFullYear() + "-" + (Date.parse(requestObject.DueDate).getMonth() + 1) + "-" + Date.parse(requestObject.DueDate).getDate()
                console.log('sending mail to assignee', requestObject.Assignee.email);
                mail
                    .sendmail(requestObject.Assignee.email, mail.templates[EmailType], {
                        Name: requestObject.Assignee.name,
                        CompanyName: requestObject.Company.businessName,
                        TaskName: requestObject.Title,
                        Priority: requestObject.Priority,
                        DueDate: new Date(requestObject.DueDate).toISOString().slice(0, 10)
                    });
            }

            if (requestObject.Observer !== undefined && requestObject.Observer) {
                requestObject.Observer.forEach((su) => {
                    console.log('sending mail to Observer', su.email);
                    mail
                        .sendmail(su.email, mail.templates[EmailType], {
                            Name: su.name,
                            CompanyName: requestObject.Company.businessName,
                            TaskName: requestObject.Title,
                            Priority: requestObject.Priority,
                            DueDate: new Date(requestObject.DueDate).toISOString().slice(0, 10)
                        });
                });
            }
            cb(null, 'next');
        }
    }, (err) => {
        if (err) {
            reject({ success: false });
        } else {
            resolve({ success: true });
        }
    });
});

const storefiles = (AllData, fileName) => {
    const jts = XLSX
        .utils
        .json_to_sheet(AllData);
    const wb = XLSX
        .utils
        .book_new();

    XLSX
        .utils
        .book_append_sheet(wb, jts, fileName);
    if(process.env.NODE_ENV === 'production')
    XLSX.writeFile(wb, `${__dirname}/../../../temp/${fileName}.csv`);
    else
    XLSX.writeFile(wb, `${__dirname}/../../temp/${fileName}.csv`);
    return true;
};

const removeFiles = () => {
    fs.readdir(path.join(__dirname, '../temp'), (err, files) => {
        if (files) {
            for (let file of files) {
                fs.unlink(path.join(__dirname, `../temp/${file}`), () => { });
            }
        }
    });
};

const findIntroducerEmail = (data) => {
    let IntroducerEmail = '';
    data.every((element) => {
        if (String(element.role) === '5d5b92031c9d440000c99912') {
            IntroducerEmail = element.email;
            return false;
        }
    });
    return IntroducerEmail;
};

const getMonthFromLength = l => LengthArray[l];

export default {
    mongoObject,
    mongoSchemaObject,
    projection,
    sendResponse,
    creatingFindQueryFromResponse,
    newFindQuery,
    mail,
    commanFindQuery: commanFindQuery,
    commonFindQuery: commonFindQuery,
    commanFindQueryForUsers,
    formateDate,
    SendMailToAllQuoteUser,
    SendMailToAllRenewalUser,
    SendMailUsers,
    storefiles,
    removeFiles,
    findIntroducerEmail,
    getMonthFromLength,
    sendErrorResponse,
    commonFilter,
    dateFilter,
};
