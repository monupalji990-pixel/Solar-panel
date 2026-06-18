const chalk = require('chalk');
const moment = require('moment');
const Promise = require('bluebird');
const async = require('async');
const fs = require('fs');
const path = require('path');
import RenewalModel from '../../models/Renewal';
import TaskModel from '../../models/Task';
import QuoteModel from '../../models/Quotes';
import CompanyModel from '../../models/Company';
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import ControllerUtils from "../../utils/ControllerUtils";
import QuoteController from '../quote/controller'
import HistoryModule from "../../sharedModules/smallModules/historyModule";
const QuoteObject = new QuoteController();
export default class CronController extends ControllerUtils {
    constructor() {
        super();
    }

    CRON_QuoteExpired() {
        console.log('%s CRON QuoteExpired job is running\n', chalk.green('✓'));
        QuoteModel.find({
            quoteStatus: {
                $ne: 1008
            },
            contractLengthDate: {
                $gte: moment(moment(), 'DD-MM-YYYY').add(-1, 'days'),
                $lte: moment(moment(), 'DD-MM-YYYY')
            }
        }, (err, result) => {
            if (err || !result) {
                console.log('no record founds for QuoteExpired');
            } else {
                const pr = result.map(sq => new
                    Promise(() => {
                        QuoteModel
                            .findByIdAndUpdate(sq._id, { quoteStatus: 1008 })
                            .then(() => { })
                            .catch(() => { });
                    }));

                Promise
                    .all(pr)
                    .then(() => { });
            }
        });
    };

    RenewalExpired() {
        console.log('%s CRON RenewalExpired job is running\n', chalk.green('✓'));
        RenewalModel.find({
            Status: {
                $ne: 1008
            },
            contractLengthDate: {
                $gte: moment(moment(), 'DD-MM-YYYY').add(-1, 'days'),
                $lte: moment(moment(), 'DD-MM-YYYY')
            }

        }, (err, result) => {
            if (err || !result) {
                console.log('no record founds for RenewalExpired');
            } else {
                const P = result.map(sr => new Promise(() => {
                    RenewalModel
                        .findByIdAndUpdate(sr._id, { Status: 1008 })
                        .then(() => { })
                        .catch(() => { });
                }));

                Promise
                    .all(P)
                    .then(() => { });
            }
        });
    };

    RenewalAutoCreation() {
        console.log('%s CRON RenewalAutoCreation job is running\n', chalk.green('✓'));
        QuoteModel.find({
            IsRenewalCreated: {
                $ne: 1
            },
            contractLengthDate: {
                $lte: moment(moment(), 'DD-MM-YYYY').add(364, 'days')
            }
        }, (err, result) => {
            if (err || !result) {
                console.log('no record founds for RenewalAutoCreation');
            } else {
                let Quotes: any, nextRenewalID: any;
                Quotes = result;

                async.series({
                    GenerateNextRenewalID(cb) {
                        if (Quotes.length > 0) {
                            RenewalModel
                                .findOne()
                                .sort({ createdAt: -1 })
                                .exec((error, newResult) => {
                                    if (error) {
                                        cb(error);
                                    } else {
                                        if (newResult) {
                                            const a = newResult
                                                .RenewalID
                                                .split('-');
                                            nextRenewalID = Number(a[1]) + 1;
                                        } else {
                                            nextRenewalID = 1;
                                        }
                                        cb(null, 'next');
                                    }
                                });
                        } else {
                            cb(null, 'next');
                        }
                    },

                    CreateRenewals(cb) {
                        async.eachSeries(Quotes, (singleItem, outerCallback) => {
                            const sq = singleItem;
                            const seriesTasks = [
                                function CR(cb2) {
                                    let data: any = {};
                                    data.RenewalID = `REN-${nextRenewalID}`;
                                    data.LinkedQuote = sq._id;
                                    data.Company = sq.Company;
                                    data.Site = sq.Site;
                                    data.Supplier = sq.Supplier;
                                    data.serviceType = sq.serviceType;
                                    data.service = QuoteObject.regUser.serviceUpdate(sq);
                                    data.contractLength = sq.contractLength;
                                    data.contractLengthDate = QuoteObject.regUser.ContractLengthUpdate(sq);
                                    data.Price = sq.quotePrice;
                                    data.createdBy = sq.createdBy;
                                    data.Status = 1000;
                                    const newRenewal = new RenewalModel(data);
                                    const history = new HistoryModule();
                                    history.RenewalHistory(newRenewal._id, { Create: '' }, { Create: 'Renewal created' }, null);

                                    newRenewal.save((error) => {
                                        if (error) {
                                            cb(error);
                                        } else {
                                            QuoteModel.updateOne({
                                                _id: sq._id
                                            }, { IsRenewalCreated: 1 })
                                                .exec((e) => {
                                                    nextRenewalID += 1;
                                                    if (e) {
                                                        cb2(e);
                                                    } else {
                                                        cb2(null, 'next');
                                                    }
                                                });
                                        }
                                    });
                                }
                            ];
                            async.series(seriesTasks, (err, result) => {
                                outerCallback(null, result);
                            });
                        }, (err, result) => {
                            cb(null, result);
                        });
                    }
                }, () => { });
            }
        });
    };

    RenewalToQuote() {
        console.log('%s CRON RenewalToQuote job is running\n', chalk.green('✓'));

        RenewalModel.find({
            Status: {
                $ne: 1008
            },
            contractLengthDate: {
                $lte: moment(moment(), 'DD-MM-YYYY')
            }
        }, (err, result) => {
            if (err || !result) {
                console.log('no record founds for RenewalToQuote');
            } else {
                let Renewal_Quotes: any, CompanyInfo: any, quoteCount: number, nextRenewalID: any;
                Renewal_Quotes = result;

                async.series({
                    CreateQuotes(cb) {
                        async.eachSeries(Renewal_Quotes, (singleItem, outerCallback) => {
                            const sq = singleItem;
                            const seriesTasks = [
                                function FindCompanyForQuote(cb2) {
                                    CompanyModel
                                        .findOne({ _id: sq.Company })
                                        .then((resp) => {
                                            CompanyInfo = resp;
                                            cb2(null, resp);
                                        })
                                        .catch(resp => cb2(resp));
                                },
                                function GenerateQuoteId(cb2) {
                                    QuoteModel
                                        .find({ Company: sq.Company })
                                        .countDocuments()
                                        .exec((error, count) => {
                                            if (error) {
                                                cb2(error);
                                            } else {
                                                quoteCount = Number(count) + 1;
                                                cb2(null, 'next');
                                            }
                                        });
                                },
                                function CQ(cb2) {
                                    let data: any = {};
                                    data.QuoteID = `Q${quoteCount}-${CompanyInfo.companyID}`;
                                    data.Company = CompanyInfo._id;
                                    data.isRenewal = 0;
                                    data.contractLengthDate = sq.contractLengthDate;
                                    data.IsRenewalCreated = 0;
                                    data.serviceType = sq.serviceType;
                                    data.quotePrice = sq.Price;
                                    data.contractLength = sq.contractLength;
                                    data.Site = sq.Site;
                                    data.Supplier = sq.Supplier;
                                    data.service = sq.service;
                                    data.quoteStatus = sq.Status;

                                    if (sq.Invoiced !== undefined && sq.Invoiced) {
                                        const newName = sq
                                            .Invoiced
                                            .replace(sq.RenewalID, data.QuoteID);
                                        if (!sq.Invoiced) {
                                            data.Invoiced = sq.Invoiced;
                                        } else {
                                            data.Invoiced = newName;
                                        }

                                        if (sq.Status === 1004) {
                                            fs
                                                .rename(path.join(__dirname, '../uploads/', sq.Invoiced), path.join(__dirname, '../uploads/', newName), () => { });
                                        }
                                    }
                                    const newQuote = new QuoteModel(data);
                                    newQuote.save((error) => {
                                        if (error) {
                                            cb2(error);
                                        } else {
                                            RenewalModel
                                                .remove({ _id: sq._id })
                                                .exec((e) => {
                                                    nextRenewalID += 1;
                                                    if (e) {
                                                        cb2(e);
                                                    } else {
                                                        cb2(null, 'next');
                                                    }
                                                });
                                        }
                                    });
                                }
                            ];

                            async.series(seriesTasks, (err, result) => {
                                outerCallback(null, result);
                            });
                        }, (err, result) => {
                            cb(null, result);
                        });
                    }
                }, () => { });
            }
        });
    };

    TaskDueDateFlagged_3() {
        console.log('%s CRON TaskDueDateFlagged_3 job is running\n', chalk.green('✓'));
        TaskModel.find({
            DueDate: {
                $gte: moment(moment(), 'DD-MM-YYYY').add(2, 'days'),
                $lte: moment(moment(), 'DD-MM-YYYY').add(3, 'days')
            }
        })
            .populate('Assignee Observer Company')
            .then((resp) => {
                if (resp.err || !resp) {
                    console.log('no record founds for TaskDueDateFlagged_3');
                } else {
                    let Tasks: any;
                    Tasks = resp;
                    async.series({
                        SendFlaggedMail(cb) {
                            if (Tasks.length > 0) {
                                async.eachSeries(Tasks, (singleItem, outerCallback) => {
                                    const sq = singleItem;
                                    const seriesTasks = [
                                        function SendMail(cb2) {
                                            let promise = new Promise((resolve) => {
                                                commonUtils
                                                    .SendMailUsers(sq, 'FlaggedForThirdDay')
                                                    .then(() => { });
                                                resolve('done');
                                            });

                                            Promise
                                                .all([promise])
                                                .then(() => {
                                                    cb2(null, 'next');
                                                });
                                        }
                                    ];

                                    async.series(seriesTasks, (err, result) => {
                                        outerCallback(null, result);
                                    });
                                }, (err, result) => {
                                    cb(null, result);
                                });
                            } else {
                                cb(null, 'next');
                            }
                        }
                    }, () => { });
                }
            });
    };

    TaskDueDateFlagged_1() {
        console.log('%s CRON TaskDueDateFlagged_1 job is running\n', chalk.green('✓'));
        TaskModel.find({
            DueDate: {
                $gte: moment(moment(), 'DD-MM-YYYY').add(-1, 'days'),
                $lte: moment(moment(), 'DD-MM-YYYY')
            }
        })
            .populate('Assignee Observer Company')
            .then((resp) => {
                if (resp.err || !resp) {
                    console.log('no record founds for TaskDueDateFlagged_1');
                } else {
                    let Tasks: any;
                    Tasks = resp;
                    async.series({
                        SendFlaggedMail(cb) {
                            async.eachSeries(Tasks, (singleItem, outerCallback) => {
                                const sq = singleItem;
                                const seriesTasks = [
                                    function SendMail(cb2) {
                                        let promise = new Promise((resolve) => {
                                            commonUtils
                                                .SendMailUsers(sq, 'FlaggedForOneDay')
                                                .then(() => { });
                                            resolve('done');
                                        });

                                        Promise
                                            .all([promise])
                                            .then(() => {
                                                cb2(null, 'next');
                                            });
                                    }
                                ];

                                async.series(seriesTasks, (err, result) => {
                                    outerCallback(null, result);
                                });
                            }, (err, result) => {
                                cb(null, result);
                            });
                        }
                    }, () => { });
                }
            });
    };

    TaskReminder() {
        console.log('%s CRON TaskReminder job is running\n', chalk.green('✓'));
        TaskModel.find({})
            .populate('Assignee Observer Company')
            .then((resp) => {
                if (resp.err || !resp) {
                    console.log('no record founds for TaskReminder');
                } else {
                    let Tasks: any;
                    Tasks = resp;
                    async.series({
                        SendReminderMail(cb) {
                            async.eachSeries(Tasks, (singleItem, outerCallback) => {
                                const sq = singleItem;
                                let isSent = false;
                                sq.Reminder.forEach((se, singleIndex) => {
                                    if (!se.IsSent) {
                                        const seriesTasks = [
                                            function (cb2) {
                                                isSent = false;
                                                const d = new Date(sq.DueDate);
                                                const now = new Date();
                                                const DifferenceInTime = d.getTime() - now.getTime();
                                                const DifferenceInDays = Math.round(DifferenceInTime / (1000 * 3600 * 24));
                                                if (se.ReminderType === 'Day' && se.ReminderBefore <= DifferenceInDays && DifferenceInDays < se.ReminderBefore + 1) {
                                                    isSent = true;
                                                } else if (se.ReminderType === 'Week' && (se.ReminderBefore * 7) >= DifferenceInDays && DifferenceInDays < ((se.ReminderBefore * 7) + 1)) {
                                                    isSent = true;
                                                } else {
                                                    const DifferenceInHours = Math.round(DifferenceInTime / (1000 * 3600));
                                                    if (se.ReminderType === 'Hour' && se.ReminderBefore <= DifferenceInHours && DifferenceInHours < (se.ReminderBefore + 1)) {
                                                        isSent = true;
                                                    }
                                                }

                                                if (isSent) {
                                                    let promise = new Promise((resolve) => {
                                                        commonUtils
                                                            .SendMailUsers(sq, 'ReminderMail')
                                                            .then(() => { });
                                                        resolve('done');
                                                    });

                                                    let newOne = new Promise((resolve, reject) => {
                                                        const key = `Reminder.${singleIndex}.IsSent`;
                                                        const h = {
                                                            [key]: true
                                                        };
                                                        const si = {
                                                            $set: h
                                                        };
                                                        TaskModel.updateOne({
                                                            _id: sq._id
                                                        }, si)
                                                            .exec((e) => {
                                                                if (e) {
                                                                    reject(e);
                                                                } else {
                                                                    resolve('done');
                                                                }
                                                            });
                                                    });

                                                    Promise
                                                        .all([promise, newOne])
                                                        .then(() => {
                                                            cb2(null, 'next');
                                                        });
                                                }
                                            }
                                        ];

                                        async.series(seriesTasks, () => { });
                                    }
                                });

                                async.series({}, (err, result) => {
                                    outerCallback(null, result);
                                });
                            }, (err, result) => {
                                cb(null, result);
                            });
                        }
                    }, () => { });
                }
            });
    };

    DueTaskMoveToNextDay() {
        console.log('%s CRON DueTaskMoveToNextDay job is running\n', chalk.green('✓'));
        const filter: any = {};
        filter.Status = { $ne: 1010 };
        filter.DueDate = {
            $gt: new Date((moment().add(-2, 'days').format('YYYY-MM-DD')) + "T23:59:59.100Z"),
            $lt: new Date((moment().format('YYYY-MM-DD')) + "T00:00:00.000Z")
        };

        TaskModel.find(filter, (err, result) => {
            if (err || !result) {
                console.log('no record founds for DueTaskMoveToNextDay');
            } else {
                const pr = result.map(sq => new
                    Promise(() => {
                        TaskModel
                            .findByIdAndUpdate(sq._id, { DueDate: new Date() })
                            .then(() => { })
                            .catch(() => { });
                    }));

                Promise
                    .all(pr)
                    .then(() => { });
            }
        });
    };
}

