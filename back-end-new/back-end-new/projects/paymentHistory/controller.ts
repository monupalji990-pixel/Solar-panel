import PaymentHistoryModel from "../../models/PaymentsHistory";
import QuoteModel from "../../models/Quotes";
import { Request, Response } from "../../templates/commandInterface";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
const mongoose = require("mongoose")

function hanldeError(error, res) {
    console.log(error)
    return res.send({ success: false, message: error.message })
}

class RegUserController {
    async addHistory(req: Request, res: Response) {
        try {
            if (!req.body.supplierId)
                throw { message: "SupplierId required" }
            if (!req.body.quoteId)
                throw { message: "QuoteId required" }
            if (!req.body.companyId)
                throw { message: "CompanyId required" }
            if (!req.body.uplift)
                throw { message: "Uplift required" }
            if (!req.body.service)
                throw { message: "Service required" }
            if (req.body.service === "Gas" && !req.body.gasAq)
                throw { message: "Gas Aq required" }
            if (req.body.service === "Electric" && !req.body.electricAq)
                throw { message: "Electric Aq required" }
            if (req.body.service === "Gas" && !req.body.gasUnitRate)
                throw { message: "Gas UnitRate required" }
            if (req.body.service === "Electric" && !req.body.electricUnitRates)
                throw { message: "Electric UnitRates  required" }
            if (!req.body.contractAcceptDate)
                throw { message: "Contract Accept Date required" }

            let paymentHistory = new PaymentHistoryModel();
            paymentHistory.supplierId = req.body.supplierId
            paymentHistory.quoteId = req.body.quoteId
            paymentHistory.companyId = req.body.companyId
            paymentHistory.contractStatus = 1000
            paymentHistory.isFromCRM = false
            paymentHistory.uplift = req.body.uplift
            paymentHistory.service = req.body.service
            paymentHistory.contractAcceptDate = new Date(req.body.contractAcceptDate)
            if (req.body.service == "Gas") {
                paymentHistory.gasAq = req.body.gasAq
                paymentHistory.gasUnitRate = req.body.gasUnitRate
            }
            if (req.body.service === "Electric") {
                paymentHistory.electricAq = req.body.electricAq
                paymentHistory.electricUnitRates = req.body.electricUnitRates
            }


            await paymentHistory.save()
            return res.send({ success: true, message: "Payment history created" })

        } catch (err) {
            commonUtils.sendErrorResponse(req, res, err);
        }
    }
    async addHistoryFunc(req: any) {
        try {
            if (!req.body.supplierId)
                throw { message: "SupplierId required" }
            if (!req.body.quoteId)
                throw { message: "QuoteId required" }
            if (!req.body.companyId)
                throw { message: "CompanyId required" }
            if (!req.body.uplift)
                throw { message: "Uplift required" }
            if (!req.body.service)
                throw { message: "Service required" }
            if (!req.body.contractAcceptDate)
                throw { message: "Contract Accept Date required" }
            if (req.body.service === "Gas" && !req.body.gasAq)
                throw { message: "Gas Aq required" }
            if (req.body.service === "Electric" && !req.body.electricAq)
                throw { message: "Electric Aq required" }
            if (req.body.service === "Gas" && !req.body.gasUnitRate)
                throw { message: "Gas UnitRate required" }
            if (req.body.service === "Electric" && !req.body.electricUnitRates)
                throw { message: "Electric UnitRates  required" }
            let paymentHistory = new PaymentHistoryModel();
            paymentHistory.supplierId = req.body.supplierId
            paymentHistory.quoteId = req.body.quoteId
            paymentHistory.companyId = req.body.companyId
            paymentHistory.contractStatus = 1000
            paymentHistory.uplift = req.body.uplift
            paymentHistory.service = req.body.service
            paymentHistory.contractAcceptDate = new Date(req.body.contractAcceptDate)
            if (req.body.service == "Gas") {
                paymentHistory.gasAq = req.body.gasAq
                paymentHistory.gasUnitRate = req.body.gasUnitRate
            }
            if (req.body.service === "Electric") {
                paymentHistory.electricAq = req.body.electricAq
                paymentHistory.electricUnitRates = req.body.electricUnitRates
            }
            await paymentHistory.save()
        } catch (error) {
            console.log(error)
        }
    }
    async updateHistory(req: Request, res: Response) {
        try {
            if (!req.body.supplierId)
                throw { message: "SupplierId required" }
            if (!req.body.quoteId)
                throw { message: "QuoteId required" }

            let updateObject: any = {};
            if (req.body?.contractStatus) updateObject.contractStatus = req.body.contractStatus
            if (req.body?.lesStatus) updateObject.lesStatus = req.body.lesStatus

            await PaymentHistoryModel.updateOne({ supplierId: req.body.supplierId, quoteId: req.body.quoteId }, updateObject)

            return res.send({ success: true, message: "Payment history updated successfully" })

        } catch (error) {
            return hanldeError(error, res)
        }
    }
    async addSupplierPayment(req: Request, res: Response) {
        try {

            if (!req.body.supplierId)
                throw { message: "SupplierId required" }
            if (!req.body.quoteId)
                throw { message: "QuoteId required" }
            if (!req.body.amount)
                throw { message: "Amount required" }
            if (!req.body.commissionType)
                throw { message: "Commission type required" }

            let payment: any = { ...req.body, amount: Math.abs(req.body.amount) }

            await PaymentHistoryModel.updateOne({ supplierId: req.body.supplierId, quoteId: req.body.quoteId }, { $push: { supplierPayments: payment } })

            return res.send({ success: true, message: "Supplier payment added successfully" })
        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async splitCommission(req: Request, res: Response) {
        try {
            if (!req.body.supplierId)
                throw { message: "SupplierId required" }
            if (!req.body.quoteId)
                throw { message: "QuoteId required" }
            if (!req.body.amount)
                throw { message: "Amount required" }
            if (!req.body.commissionType)
                throw { message: "Commission type required" }

            const qi = await QuoteModel.findById(req.body.quoteId)
                .select("Assignee").populate("Assignee", "fixCommission percentageCommission").lean();

            if (!qi.Assignee) throw { message: "No assignee available in the quote" }
            if (!qi.Assignee.percentageCommission) throw { message: "No percentage commission available for assignee" }

            const allC = await PaymentHistoryModel.findOne({ supplierId: req.body.supplierId, quoteId: req.body.quoteId }).select("commissionPayments").lean()

            let payment: any = { ...req.body }
            let commissions = [];
            let supplierCommission = 0
            let percentage = 0;
            let userRecords = 0;
            let isContainCommissionRecord = false;

            // if at least one commission record found then use average commission % for claw back otherwise user assignee percentageCommission
            allC.commissionPayments && allC.commissionPayments.forEach(ac => {
                if (ac.commissionType === "Commission") {
                    isContainCommissionRecord = true;
                    return;
                }
            });

            if (!isContainCommissionRecord) {
                supplierCommission = (Number(req.body.amount) * Number(qi.Assignee.percentageCommission)) / 100;
                percentage = Number(qi.Assignee.percentageCommission)
            } else {
                if (qi && qi.Assignee) {
                    // claw back then find average %
                    if (payment.commissionType === "Clawback") {
                        allC.commissionPayments && allC.commissionPayments.forEach(ac => {
                            if (ac.user && ac.commissionType === "Commission") {
                                percentage += ac.percentage;
                                userRecords++;
                            }
                        });

                        supplierCommission = Number(((Number(req.body.amount) * Number(Number(percentage / userRecords).toFixed(2))) / 100).toFixed(2))
                        percentage = Number(Number(percentage / userRecords).toFixed(2));
                    } else {
                        supplierCommission = (Number(req.body.amount) * Number(qi.Assignee.percentageCommission)) / 100;
                        percentage = Number(qi.Assignee.percentageCommission)
                    }
                }
            }

            // Sales rep commission
            commissions.push({
                supplierId: payment.supplierId,
                quoteId: payment.quoteId,
                totalCommissionAmount: Number(payment.amount).toFixed(2),
                amount: Number(supplierCommission).toFixed(2),
                paymentType: "Payout Pending",
                comment: payment.comment,
                user: qi.Assignee._id,
                commissionType: payment.commissionType,
                percentage
            })

            // EP commission
            commissions.push({
                supplierId: payment.supplierId,
                quoteId: payment.quoteId,
                totalCommissionAmount: Number(payment.amount).toFixed(2),
                amount: Number(payment.amount - supplierCommission).toFixed(2),
                paymentType: "Paid",
                comment: payment.comment,
                commissionType: payment.commissionType,
                percentage: (100 - percentage)
            })

            await PaymentHistoryModel.updateOne({ supplierId: req.body.supplierId, quoteId: req.body.quoteId }, { $push: { commissionPayments: commissions } })

            return res.send({ success: true, message: `${payment.commissionType} added successfully` })

        } catch (error) {
            return hanldeError(error, res)
        }
    }
    async getHistory(req: Request, res: Response) {
        try {
            if (!req.body.quoteId)
                throw { message: "QuoteId required" }

            let paymentHistoryOfQuote = await PaymentHistoryModel.findOne(req.body)
                .populate({
                    path: 'quoteId',
                    populate: {
                        path: 'Assignee',
                        select: 'name'
                    }
                })
                .populate({ path: 'supplierId', select: 'supplierName status' })
                .populate({ path: 'companyId', select: 'businessName' })
                .populate({ path: 'commissionPayments.user', select: 'name' })
                .lean();

            let totalCommission = 0;
            let totalClawback = 0;
            let totalPaidCommission = 0;
            let totalPendingCommission = 0;
            let totalReceivedClawback = 0;
            let totalPendingClawback = 0;
            let totalSupplierCommission = 0;
            let totalSupplierClawback = 0;
            let totalSalesRepCommission = 0;
            let latestSupplierTransaction = 0;
            let latestSupplierDate = "";

            for (let i = 0; i < paymentHistoryOfQuote.supplierPayments.length; i++) {
                const inside = paymentHistoryOfQuote.supplierPayments[i];

                if (inside.commissionType === "Commission") {
                    totalSupplierCommission += Number(inside.amount)
                } else {
                    totalSupplierClawback += Number(inside.amount)
                }
                if ((i + 1) === paymentHistoryOfQuote.supplierPayments.length) {
                    latestSupplierTransaction = Number(inside.amount)
                    latestSupplierDate = inside.date
                }
            }

            for (let i = 0; i < paymentHistoryOfQuote.commissionPayments.length; i++) {
                const inside = paymentHistoryOfQuote.commissionPayments[i];

                if (inside.commissionType === "Commission") {
                    totalCommission += Number(inside.amount)
                    if (inside.paymentType === "Payout Pending") {
                        totalPendingCommission += Number(inside.amount);
                    } else {
                        if (inside.user !== undefined) {
                            totalSalesRepCommission += Number(inside.amount)
                        }
                        totalPaidCommission += Number(inside.amount);
                    }
                } else {
                    totalClawback += Number(inside.amount)
                    if (inside.paymentType === "Payout Pending") {
                        totalPendingClawback += Number(inside.amount);
                    } else {
                        totalReceivedClawback += Number(inside.amount);
                    }
                }
            }

            return res.send({
                success: true,
                data: paymentHistoryOfQuote,
                totalCommission: totalCommission.toFixed(2),
                totalClawback: totalClawback.toFixed(2),
                totalPaidCommission: totalPaidCommission.toFixed(2),
                totalPendingCommission: totalPendingCommission.toFixed(2),
                totalReceivedClawback: totalReceivedClawback.toFixed(2),
                totalPendingClawback: totalPendingClawback.toFixed(2),
                totalSupplierCommission: totalSupplierCommission.toFixed(2),
                totalSupplierClawback: totalSupplierClawback.toFixed(2),
                totalSalesRepCommission: totalSalesRepCommission.toFixed(2),
                latestSupplierTransaction: latestSupplierTransaction.toFixed(2),
                latestSupplierDate
            })
        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async listPaymentHistory(req: Request, res: Response) {
        try {
            let pipeline = []

            let sortObj: any = { createdAt: 1 };
            if (req.query.sort) sortObj = { [req.query.sort]: req.query.sortType === 'asc' ? 1 : -1 };
            pipeline.push({ $sort: sortObj })

            pipeline.push({
                $lookup: {
                    from: 'quotes',
                    localField: 'quoteId',
                    foreignField: '_id',
                    as: 'quote'
                }
            })
            pipeline.push({
                $lookup: {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                }
            })
            pipeline.push({
                $lookup: {
                    from: 'suppliers',
                    localField: 'supplierId',
                    foreignField: '_id',
                    as: 'supplier'
                }
            })

            pipeline.push({
                $unwind: {
                    path: '$quote',
                    preserveNullAndEmptyArrays: false
                }
            })
            pipeline.push({
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: false
                }
            })
            if (req.body.search && Object.keys(req.body.search).length > 0) {
                let search = {}

                Object.keys(req.body.search).forEach(key => {
                    if (req.body.search[key]) {
                        if (key == "meterNumber") {
                            search['$or'] = [{ "quote.service.gas.meterNumber": { $regex: `.*${req.body.search[key]}.*`, $options: "i" } },
                            { "quote.service.electric.meterNumber": { $regex: `.*${req.body.search[key]}.*`, $options: "i" } }]
                        } else
                            search[key] = { $regex: `.*${req.body.search[key]}.*`, $options: "i" }
                    }
                })

                pipeline.push({
                    $match: search
                })
            }

            if (req.path.includes("/count")) {
                pipeline.push({
                    $count: "count"
                })
                const count = await PaymentHistoryModel.aggregate(pipeline);
                let countData = 0;
                if (count.length > 0) {
                    countData = count[0].count;
                }
                return res.send({ count: countData, success: true });
            }

            if (req.query.skip) {
                pipeline.push({
                    $skip: typeof Number(req.query.skip) === 'number' ? Number(req.query.skip) : 0
                });
            } else {
                pipeline.push({
                    $skip: 0
                });
            }
            if (req.query.limit) {
                pipeline.push({
                    $limit: !isNaN(Number(req.query.limit)) == true ? Number(req.query.limit) + 1 : 100
                })
            } else {
                pipeline.push({
                    $limit: 100
                })
            }
            pipeline.push({
                $project: {
                    "supplier": {
                        $arrayElemAt: ["$supplier.supplierName", 0]
                    },
                    "supplierPayments": 1,
                    "commissionPayments": 1,
                    "supplierId": 1,
                    "quoteId": 1,
                    "contractStatus": 1,
                    "contractAcceptDate": 1,
                    "isFromCRM": 1,
                    "companyId": 1,
                    "quote.service.electric.meterNumber": 1, //bottom line
                    "quote.service.gas.meterNumber": 1, //mprn
                    "quote.QuoteID": 1,
                    "quote.serviceType": 1,
                    "company.businessName": 1
                }
            })

            let result = await PaymentHistoryModel.aggregate(pipeline);
            let isNext = false;
            if (req.query.limit && result.length > Number(req.query.limit)) {
                isNext = true;
                result.pop()
            }
            return res.send({ data: result, count: 0, isNext });

        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async editPayment(req: Request, res: Response) {
        try {
            if (!req.body?.paymentHistoryId) throw { message: "Payment history id is required" }
            if (!req.body.paymentId) throw { message: "Payment id is required" }
            if (!req.body.type) throw { message: "Type is required" }

            const { paymentHistoryId, paymentId, type } = req.body

            if (type === "commissionPayment") {

                let updateObject: any = {}
                if (req.body.amount) updateObject = { ...updateObject, "commissionPayments.$.amount": req.body.amount }
                if (req.body.comment) updateObject = { ...updateObject, "commissionPayments.$.comment": req.body.comment }
                if (req.body.user) updateObject = { ...updateObject, "commissionPayments.$.user": req.body.user }
                if (req.body.date) updateObject = { ...updateObject, "commissionPayments.$.date": req.body.date }
                if (req.body.paymentType) updateObject = { ...updateObject, "commissionPayments.$.paymentType": req.body.paymentType }

                await PaymentHistoryModel.updateOne({ _id: paymentHistoryId, "commissionPayments._id": paymentId }, { $set: updateObject }).lean();
            }

            if (type === "supplierPayment") {

                let updateObject: any = {}
                if (req.body.amount) updateObject = { ...updateObject, "supplierPayments.$.amount": req.body.amount }
                if (req.body.comment) updateObject = { ...updateObject, "supplierPayments.$.comment": req.body.comment }
                if (req.body.date) updateObject = { ...updateObject, "supplierPayments.$.date": req.body.date }
                if (req.body.paymentType) updateObject = { ...updateObject, "supplierPayments.$.paymentType": req.body.paymentType }

                await PaymentHistoryModel.updateOne({ _id: paymentHistoryId, "supplierPayments._id": paymentId }, { $set: updateObject }).lean();
            }

            return res.send({ success: true, message: "Payment updated successfully" })

        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async editBulkPayment(req: Request, res: Response) {
        try {
            if (!req.body?.paymentHistoryId) throw { message: "Payment history id is required" }
            if (!req.body.paymentIds) throw { message: "Payment ids is required" }
            if (typeof req.body.paymentIds !== "object") throw { message: "Payment ids should be array" }
            if (!req.body.type) throw { message: "Type is required" }
            if (!req.body.paymentType) throw { message: "Payment type is required" }

            const { paymentHistoryId, paymentId, type } = req.body

            if (type === "commissionPayment") {
                req.body.paymentIds.forEach(async (single) => {
                    await PaymentHistoryModel.updateOne({ _id: paymentHistoryId, "commissionPayments._id": single }, { "commissionPayments.$.paymentType": req.body.paymentType }).lean();
                });
            }

            if (type === "supplierPayment") {
                req.body.paymentIds.forEach(async (single) => {
                    await PaymentHistoryModel.updateOne({ _id: paymentHistoryId, "supplierPayments._id": single }, { "supplierPayments.$.paymentType": req.body.paymentType }).lean();
                });
            }

            return res.send({ success: true, message: "Payment updated successfully" })

        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async editMonthlyPayoutRecords(req: Request, res: Response) {
        try {
            if (!req.body.user) throw { message: "User is required" }
            if (!req.body.type) throw { message: "Type is required" }
            if (!req.body.paymentType) throw { message: "Payment type is required" }
            if (!req.body.updateAll) throw { message: "Update all is required" }

            if (req.body.updateAll !== 1) {
                if (!req.body.paymentsIds) throw { message: "Payment ids is required" }
                if (typeof req.body.paymentsIds !== "object") throw { message: "Payment ids should be array" }
            }

            const { type, updateAll, user, paymentsIds } = req.body

            if (updateAll === 1) {
                let pipeline = [];
                pipeline.push({
                    $match: { "commissionPayments.user": mongoose.Types.ObjectId(user) }
                })
                pipeline.push({
                    $lookup: {
                        from: 'quotes',
                        localField: 'quoteId',
                        foreignField: '_id',
                        as: 'quote'
                    }
                })
                pipeline.push({
                    $unwind: {
                        path: '$quote',
                        preserveNullAndEmptyArrays: false
                    }
                })
                let otherFilter = []
                if (req.body.search && Object.keys(req.body.search).length > 0) {
                    let search = {}

                    Object.keys(req.body.search).forEach(key => {
                        if (req.body.search[key]) {
                            if (key == "startDate") {
                                otherFilter.push({ "$gte": [`$$commissionPayments.date`, new Date(new Date(req.body.search[key]).setHours(0, 0, 0, 0))] })
                            } else if (key == "endDate") {
                                otherFilter.push({ "$lt": [`$$commissionPayments.date`, new Date(new Date(req.body.search[key]).setHours(23, 59, 59, 59))] })
                            } else {
                                if (["commissionType", "paymentType"].includes(key)) {
                                    otherFilter.push({ "$eq": [`$$commissionPayments.${key}`, req.body.search[key]] })
                                } else {
                                    search[key] = req.body.search[key]
                                }
                            }
                        }
                    })

                    pipeline.push({
                        $match: search
                    })
                }

                pipeline.push({
                    $project: {
                        "commissionPayments": {
                            "$filter": {
                                "input": "$commissionPayments",
                                "as": "commissionPayments",
                                "cond": {
                                    "$and": [
                                        {
                                            "$eq": ["$$commissionPayments.user", mongoose.Types.ObjectId(req.body.user)]
                                        },
                                        ...otherFilter
                                    ]
                                }
                            }
                        },
                    }
                })

                let commission = await PaymentHistoryModel.aggregate(pipeline);

                if (type === "commissionPayment") {
                    commission.forEach(cr => {
                        if (cr.commissionPayments && cr.commissionPayments.length > 0)
                            cr.commissionPayments.forEach(async (single) => {
                                await PaymentHistoryModel.updateOne({ _id: cr._id, "commissionPayments._id": single._id }, { "commissionPayments.$.paymentType": req.body.paymentType }).lean();
                            });
                    });
                }

                if (type === "supplierPayment") {
                    commission.forEach(cr => {
                        if (cr.supplierPayments && cr.supplierPayments.length > 0)
                            cr.supplierPayments.forEach(async (single) => {
                                await PaymentHistoryModel.updateOne({ _id: cr._id, "supplierPayments._id": single._id }, { "supplierPayments.$.paymentType": req.body.paymentType }).lean();
                            });
                    });
                }
            } else {
                if (type === "commissionPayment") {
                    paymentsIds.forEach(async cr => {
                        await PaymentHistoryModel.updateOne({ _id: cr.paymentHistoryId, "commissionPayments._id": cr.paymentId }, { "commissionPayments.$.paymentType": req.body.paymentType }).lean();
                    });
                }

                if (type === "supplierPayment") {
                    paymentsIds.forEach(async cr => {
                        await PaymentHistoryModel.updateOne({ _id: cr.paymentHistoryId, "supplierPayments._id": cr.paymentId }, { "supplierPayments.$.paymentType": req.body.paymentType }).lean();
                    });
                }
            }

            return res.send({ success: true, message: "Monthly payouts records updated successfully" })

        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async loadUserCommission1(req: Request, res: Response) {
        try {

            if (!req.body.user) throw { message: "User is required" }

            let pipeline = [];

            pipeline.push({
                $match: { "commissionPayments.user": mongoose.Types.ObjectId(req.body.user) }
            })

            pipeline.push({
                $lookup: {
                    from: 'quotes',
                    localField: 'quoteId',
                    foreignField: '_id',
                    as: 'quote'
                }
            })
            pipeline.push({
                $lookup: {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                }
            })
            pipeline.push({
                $lookup: {
                    from: 'suppliers',
                    localField: 'supplierId',
                    foreignField: '_id',
                    as: 'supplier'
                }
            })

            pipeline.push({
                $unwind: {
                    path: '$quote',
                    preserveNullAndEmptyArrays: false
                }
            })
            pipeline.push({
                $unwind: {
                    path: '$company',
                    preserveNullAndEmptyArrays: false
                }
            })
            pipeline.push({
                $unwind: {
                    path: '$supplier',
                    preserveNullAndEmptyArrays: false
                }
            })

            if (req.body.search && Object.keys(req.body.search).length > 0) {
                let search = {}
                let orArray = []

                Object.keys(req.body.search).forEach(key => {
                    if (req.body.search[key]) {
                        if (key == "startDate") {
                            orArray.push({ "commissionPayments.date": { $gte: new Date(req.body.search[key]) } });
                        } else if (key == "endDate") {
                            orArray.push({ "commissionPayments.date": { $lt: new Date(req.body.search[key]) } });
                        } else {
                            search[key] = { $regex: `.*${req.body.search[key]}.*`, $options: "i" }
                        }
                    }
                })
                search["$and"] = orArray

                pipeline.push({
                    $match: search
                })
            }

            if (req.body.skip) {
                pipeline.push({
                    $skip: typeof Number(req.body.skip) === 'number' ? Number(req.body.skip) : 0
                });
            } else {
                pipeline.push({
                    $skip: 0
                });
            }
            if (req.body.limit) {
                pipeline.push({
                    $limit: !isNaN(Number(req.body.limit)) == true ? Number(req.body.limit) + 1 : 100
                })
            } else {
                pipeline.push({
                    $limit: 100
                })
            }

            pipeline.push({
                $project: {
                    "commissionPayments": {
                        "$filter": {
                            "input": "$commissionPayments",
                            "as": "commissionPayments",
                            "cond": {
                                "$eq": ["$$commissionPayments.user", mongoose.Types.ObjectId(req.body.user)]
                            }
                        }
                    },
                    "supplierId": 1,
                    "supplier.supplierName": 1,
                    "quoteId": 1,
                    "contractStatus": 1,
                    "contractAcceptDate": 1,
                    "companyId": 1,
                    "quote.service.electric.meterNumber": 1,
                    "quote.service.gas.meterNumber": 1,
                    "quote.QuoteID": 1,
                    "quote.serviceType": 1,
                    "company.businessName": 1
                }
            })

            let commission = await PaymentHistoryModel.aggregate(pipeline);

            let isNext = false;
            if (req.body.limit && commission.length > Number(req.body.limit)) {
                isNext = true;
                commission.pop()
            }

            return res.send({ success: true, data: commission, isNext })
        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async loadUserCommission(req: Request, res: Response) {
        try {

            if (!req.body.user) throw { message: "User is required" }

            let pipeline = [];

            pipeline.push({
                $match: { "commissionPayments.user": mongoose.Types.ObjectId(req.body.user) }
            })

            pipeline.push({
                $lookup: {
                    from: 'quotes',
                    localField: 'quoteId',
                    foreignField: '_id',
                    as: 'quote'
                }
            })

            pipeline.push({
                $unwind: {
                    path: '$quote',
                    preserveNullAndEmptyArrays: false
                }
            })

            let otherFilter = []
            if (req.body.search && Object.keys(req.body.search).length > 0) {
                let search = {}

                Object.keys(req.body.search).forEach(key => {
                    if (req.body.search[key]) {
                        if (key == "startDate") {
                            otherFilter.push({ "$gte": [`$$commissionPayments.date`, new Date(new Date(req.body.search[key]).setHours(0, 0, 0, 0))] })
                        } else if (key == "endDate") {
                            otherFilter.push({ "$lt": [`$$commissionPayments.date`, new Date(new Date(req.body.search[key]).setHours(23, 59, 59, 59))] })
                        } else {
                            if (["commissionType", "paymentType"].includes(key)) {
                                otherFilter.push({ "$eq": [`$$commissionPayments.${key}`, req.body.search[key]] })
                            } else {
                                search[key] = req.body.search[key]
                            }
                        }
                    }
                })

                pipeline.push({
                    $match: search
                })
            }

            pipeline.push({
                $project: {
                    "commissionPayments": {
                        "$filter": {
                            "input": "$commissionPayments",
                            "as": "commissionPayments",
                            "cond": {
                                "$and": [
                                    {
                                        "$eq": ["$$commissionPayments.user", mongoose.Types.ObjectId(req.body.user)]
                                    },
                                    ...otherFilter
                                ]
                            }
                        }
                    },
                    "supplierId": 1,
                    "supplier.supplierName": 1,
                    "quoteId": 1,
                    "contractStatus": 1,
                    "contractAcceptDate": 1,
                    "companyId": 1,
                    "quote.service.electric.meterNumber": 1,
                    "quote.service.gas.meterNumber": 1,
                    "quote.QuoteID": 1,
                    "quote.serviceType": 1,
                    "company.businessName": 1
                }
            })

            let commission = await PaymentHistoryModel.aggregate(pipeline);

            let eachCommission: any = [];
            let totalCommission = 0;
            let totalClawback = 0;
            let totalPaidCommission = 0;
            let totalPendingCommission = 0;
            let totalReceivedClawback = 0;
            let totalPendingClawback = 0;

            for (let index = 0; index < commission.length; index++) {
                const obj = commission[index];

                for (let i = 0; i < obj.commissionPayments.length; i++) {
                    const inside = obj.commissionPayments[i];
                    let ec: any = {};
                    ec = { ...inside };
                    ec.paymentHistoryId = obj._id
                    ec.company = obj.company;
                    ec.supplier = obj.supplier;
                    ec.quote = obj.quote;
                    ec.supplierId = obj.supplierId;
                    ec.quoteId = obj.quoteId;
                    ec.companyId = obj.companyId;
                    ec.contractStatus = obj.contractStatus;
                    ec.contractAcceptDate = obj.contractAcceptDate;
                    eachCommission.push(ec);

                    if (inside.commissionType === "Commission") {
                        totalCommission += Number(inside.amount)
                        if (inside.paymentType === "Payout Pending") {
                            totalPendingCommission += Number(inside.amount);
                        } else {
                            totalPaidCommission += Number(inside.amount);
                        }
                    } else {
                        totalClawback += Number(inside.amount)
                        if (inside.paymentType === "Payout Pending") {
                            totalPendingClawback += Number(inside.amount);
                        } else {
                            totalReceivedClawback += Number(inside.amount);
                        }
                    }
                }

            }

            eachCommission = eachCommission.sort(function (a: any, b: any) {
                let one: any = new Date(b.date);
                let two: any = new Date(a.date);
                return one - two;
            });

            eachCommission = eachCommission.slice(req.body.skip || 0, req.body.limit ? Number(req.body.limit) + (req.body.skip || 0) + 1 : 10)

            let isNext = false;
            if (req.body.limit && eachCommission.length > Number(req.body.limit)) {
                isNext = true;
                eachCommission.pop()
            }

            return res.send({
                success: true,
                count: eachCommission.length,
                isNext,
                totalCommission: totalCommission.toFixed(2),
                totalClawback: totalClawback.toFixed(2),
                totalPaidCommission: totalPaidCommission.toFixed(2),
                totalPendingCommission: totalPendingCommission.toFixed(2),
                totalReceivedClawback: totalReceivedClawback.toFixed(2),
                totalPendingClawback: totalPendingClawback.toFixed(2),
                data: eachCommission
            })
        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async fetchUserCommissionQuotes(req: Request, res: Response) {
        try {
            if (!req.body.user) throw { message: "User is required" }

            let pipeline = [];

            pipeline.push({
                $match: { "commissionPayments.user": mongoose.Types.ObjectId(req.body.user) }
            })

            pipeline.push({
                $lookup: {
                    from: 'quotes',
                    localField: 'quoteId',
                    foreignField: '_id',
                    as: 'quote'
                }
            })
            pipeline.push({
                $unwind: {
                    path: '$quote',
                    preserveNullAndEmptyArrays: false
                }
            })

            pipeline.push({
                $project: {
                    "_id": 0,
                    "QuoteID": "$quote.QuoteID"
                }
            })

            let userQuotes = await PaymentHistoryModel.aggregate(pipeline);

            return res.send({ success: true, data: userQuotes })

        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async splitCommissionRecordsWithFilter(req: Request, res: Response) {
        try {

            if (!req.body.paymentHistoryId) throw { message: "Payment history id is required" }
            if (!req.body.user) throw { message: "User is required" }

            let pipeline = [];

            pipeline.push({
                $match: { _id: mongoose.Types.ObjectId(req.body.paymentHistoryId) }
            })

            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'commissionPayments.user',
                    foreignField: '_id',
                    as: 'commissionUser'
                }
            })

            let otherFilter = []
            if (req.body.search && Object.keys(req.body.search).length > 0) {
                let search = {}

                Object.keys(req.body.search).forEach(key => {
                    if (req.body.search[key]) {
                        if (key == "startDate") {
                            let startDate = new Date();
                            if (process.env.NODE_ENV === "development") {
                                startDate = new Date(new Date(req.body.search[key]).setHours(0, 0, 0, 0));
                            } else {
                                const firstOne = new Date(req.body.search[key]);
                                startDate = new Date(
                                    new Date(firstOne.setDate(firstOne.getDate() - 1)).setHours(18, 30, 0, 0)
                                );
                            }

                            otherFilter.push({ "$gte": [`$$commissionPayments.date`, startDate] })
                        } else if (key == "endDate") {
                            let endDate = new Date();
                            if (process.env.NODE_ENV === "development") {
                                endDate = new Date(new Date(req.body.search[key]).setHours(23, 59));
                            } else {
                                let endDate2 = new Date(req.body.search[key]);

                                endDate = new Date(endDate2.setHours(18, 29, 0, 0));
                            }

                            otherFilter.push({ "$lt": [`$$commissionPayments.date`, endDate] })
                        } else {
                            if (["commissionType", "paymentType"].includes(key)) {
                                otherFilter.push({ "$eq": [`$$commissionPayments.${key}`, req.body.search[key]] })
                            } else {
                                search[key] = req.body.search[key]
                            }
                        }
                    }
                })

                pipeline.push({
                    $match: search
                })
            }

            if (!["All", "EP"].includes(req.body.user)) {
                otherFilter.push({ "$eq": ["$$commissionPayments.user", mongoose.Types.ObjectId(req.body.user)] })
            }

            pipeline.push({
                $project: {
                    "commissionPayments": {
                        "$filter": {
                            "input": "$commissionPayments",
                            "as": "commissionPayments",
                            "cond": {
                                "$and": otherFilter
                            }
                        }
                    },
                    commissionUser: {
                        _id: 1,
                        name: 1
                    }
                }
            })

            console.log("date otherFilter:-", otherFilter, req.body)
            let commission = await PaymentHistoryModel.aggregate(pipeline);

            let eachCommission: any = [];

            for (let index = 0; index < commission.length; index++) {
                const obj = commission[index];

                for (let i = 0; i < obj.commissionPayments.length; i++) {
                    const inside = obj.commissionPayments[i];
                    let ec: any = {};

                    if (req.body.user === "All") {
                        if (inside.user === undefined) {
                            ec = { ...inside };
                        } else {
                            let userInfo = obj.commissionUser.filter(s => String(s._id) === String(inside.user) && s.name)
                            ec = { ...inside, user: userInfo[0] };
                        }
                        eachCommission.push(ec);
                    }

                    if (req.body.user === "EP" && inside.user === undefined) {
                        ec = { ...inside };
                        eachCommission.push(ec);
                    }

                    if (!["All", "EP"].includes(req.body.user) && inside.user !== undefined) {
                        let userInfo = obj.commissionUser.filter(s => String(s._id) === String(inside.user) && s.name)
                        ec = { ...inside, user: userInfo[0] };
                        eachCommission.push(ec);
                    }
                }
            }

            eachCommission = eachCommission.sort(function (a: any, b: any) {
                let one: any = new Date(b.date);
                let two: any = new Date(a.date);
                return one - two;
            });

            eachCommission = eachCommission.slice(req.body.skip || 0, req.body.limit ? Number(req.body.limit) + (req.body.skip || 0) + 1 : 10)

            let isNext = false;
            if (req.body.limit && eachCommission.length > Number(req.body.limit)) {
                isNext = true;
                eachCommission.pop()
            }

            return res.send({
                success: true,
                isNext,
                data: eachCommission
            })
        } catch (error) {
            return hanldeError(error, res)
        }
    }

    async splitSupplierRecordsWithFilter(req: Request, res: Response) {
        try {

            if (!req.body.paymentHistoryId) throw { message: "Payment history id is required" }

            let pipeline = [];

            pipeline.push({
                $match: { _id: mongoose.Types.ObjectId(req.body.paymentHistoryId) }
            })

            let otherFilter = []
            if (req.body.search && Object.keys(req.body.search).length > 0) {
                let search = {}

                Object.keys(req.body.search).forEach(key => {
                    if (req.body.search[key]) {
                        if (key == "startDate") {
                            otherFilter.push({ "$gte": [`$$supplierPayments.date`, new Date(new Date(req.body.search[key]).setHours(0, 0, 0, 0))] })
                        } else if (key == "endDate") {
                            otherFilter.push({ "$lt": [`$$supplierPayments.date`, new Date(new Date(req.body.search[key]).setHours(23, 59, 59, 59))] })
                        } else {
                            if (["commissionType", "paymentType"].includes(key)) {
                                otherFilter.push({ "$eq": [`$$supplierPayments.${key}`, req.body.search[key]] })
                            } else {
                                search[key] = req.body.search[key]
                            }
                        }
                    }
                })

                pipeline.push({
                    $match: search
                })
            }

            pipeline.push({
                $project: {
                    "supplierPayments": {
                        "$filter": {
                            "input": "$supplierPayments",
                            "as": "supplierPayments",
                            "cond": {
                                "$and": otherFilter
                            }
                        }
                    }
                }
            })

            let commission = await PaymentHistoryModel.aggregate(pipeline);

            let eachCommission: any = [];

            for (let index = 0; index < commission.length; index++) {
                const obj = commission[index];

                for (let i = 0; i < obj.supplierPayments.length; i++) {
                    const inside = obj.supplierPayments[i];
                    let ec: any = {};
                    ec = { ...inside };
                    eachCommission.push(ec);
                }
            }

            eachCommission = eachCommission.sort(function (a: any, b: any) {
                let one: any = new Date(b.date);
                let two: any = new Date(a.date);
                return one - two;
            });

            eachCommission = eachCommission.slice(req.body.skip || 0, req.body.limit ? Number(req.body.limit) + (req.body.skip || 0) + 1 : 10)

            let isNext = false;
            if (req.body.limit && eachCommission.length > Number(req.body.limit)) {
                isNext = true;
                eachCommission.pop()
            }

            return res.send({
                success: true,
                isNext,
                data: eachCommission
            })
        } catch (error) {
            return hanldeError(error, res)
        }
    }
}

export default class AllControllers {
    Reguser: RegUserController
    constructor() {
        this.Reguser = new RegUserController();
    }
}

