import { Request, Response } from "../../templates/commandInterface";
import AppoinmentModel from "../../models/Appoinment";
import UserModel from "../../models/user";
import mail from "../../sharedModules/smallModules/mail";
import Lead from "../../models/Lead";
import Company from "../../models/Company";
import LeadController from "../lead/controller";
import axios from "axios";
import general from "../../sharedModules/smallModules/general";
import commonUtils from "../../sharedModules/smallModules/commanUtils";

const cron = require('node-cron')
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

function handleError(req: Request, res: Response, error: any) {
    if (error?.errors) {
        error.message = error?.errors[Object.keys(error.errors)[0]].message
    }
    return res.send({ success: false, message: error.message })

}
function generatePipeline(collectionName: any, fields: any, currentUserIdObj: any, newUserIdObj: any) {
    const matchConditions = [];
    const addFieldsUpdates = {};

    // Build match conditions and addFields updates based on the provided fields
    for (const [field, type] of Object.entries(fields)) {
        if (type === "ObjectId") {
            // Match and update for single ObjectId fields
            matchConditions.push({ [field]: currentUserIdObj });
            addFieldsUpdates[field] = {
                $cond: [{ $eq: [`$${field}`, currentUserIdObj] }, newUserIdObj, `$${field}`]
            };
        } else if (type === "Array<ObjectId>") {
            // Match and update for array of ObjectIds or nested ObjectIds in arrays
            const fieldParts = field.split('.');
            if (fieldParts.length > 1) {
                // Nested array fields
                const [arrayField, nestedField] = fieldParts;
                matchConditions.push({ [`${arrayField}.${nestedField}`]: currentUserIdObj });
                addFieldsUpdates[arrayField] = {
                    $map: {
                        input: `$${arrayField}`,
                        as: "item",
                        in: {
                            $mergeObjects: [
                                "$$item",
                                {
                                    [nestedField]: {
                                        $cond: [
                                            { $eq: [`$$item.${nestedField}`, currentUserIdObj] },
                                            newUserIdObj,
                                            `$$item.${nestedField}`
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                };
            } else {
                // Regular array fields
                matchConditions.push({ [field]: currentUserIdObj });
                addFieldsUpdates[field] = {
                    $map: {
                        input: `$${field}`,
                        as: "id",
                        in: { $cond: [{ $eq: ["$$id", currentUserIdObj] }, newUserIdObj, "$$id"] }
                    }
                };
            }
        }
    }
    // Start building the aggregation pipeline
    const pipeline = [
        { $match: { $or: matchConditions } },
        { $addFields: addFieldsUpdates },
        // { $limit: 10 }
        {
            $merge: {
                into: collectionName,
                whenMatched: "replace",
                whenNotMatched: "fail"
            }
        }
    ];
    return pipeline;
}

class AppointmentController {
    async add(req: Request, res: Response, next: any) {
        try {

            let assigneeFilter: any = {}
            if (req.body.Assignee) {
                assigneeFilter.Assignee = req.body.Assignee
            }
            if (req.body.Assignee2) {
                assigneeFilter.Assignee = { $in: [req.body.Assignee, req.body.Assignee2] }
                assigneeFilter.Assignee2 = { $in: [req.body.Assignee, req.body.Assignee2] }
            }
            let oldAppoinments = await AppoinmentModel.countDocuments({
                startTime: { $lte: new Date(req.body.endTime) },
                endTime: { $gte: new Date(req.body.startTime) },
                status: { $ne: '2' },
                ...assigneeFilter
            }).select('Assignee Assignee2').lean();

            // if (oldAppoinments > 0) {
            //     throw { message: 'Assignee already has appoinment at selected time' }
            // }
            if (!req.body.Booker)
                req.body.Booker = req.user._id;
            let ap = await AppoinmentModel.create(req.body)


            //    let _ap = await AppoinmentModel.find({_id:ap._id})
            await AppoinmentModel
                .populate(ap, {
                    path: 'Assignee',
                    select: 'name email role'
                })

            await AppoinmentModel.populate(ap, {
                path: 'Booker',
                select: 'name email'
            })
            await AppoinmentModel
                .populate(ap, {
                    path: 'Assignee2',
                    select: 'name email role'
                })
            // await AppoinmentModel.populate(ap,{
            //     path:'leadId',
            //     select:'Consumer Company'
            // })
            if (ap.Consumer) {
                if (ap.Assignee.role.toString() === "62b02a8fda27b400c8b8cf1e" || ap.Assignee.role.toString() === "5d5b92031c9d440000c99912") { // if assignee is installer & salesrep
                    await UserModel.updateOne({ _id: req.body.Consumer }, { $addToSet: { "Assignee": ap.Assignee._id } })

                }
                await AppoinmentModel.populate(ap, {
                    path: 'Consumer',
                    select: 'addressOne addressTwo firstName email lastName postcode'
                })
                mail.sendmail(ap.Assignee.email, 136, { ...ap._doc, cc: ap.Consumer.email })

            } else if (ap.Company) {
                if (ap.Assignee.role.toString() === "62b02a8fda27b400c8b8cf1e" || ap.Assignee.role.toString() === "5d5b92031c9d440000c99912") { // if assignee is installer & salesrep
                    await Company.updateOne({ _id: req.body.Company }, { $addToSet: { "Assignee": ap.Assignee._id } })
                }
                await AppoinmentModel.populate(ap, {
                    path: 'Company',
                    select: 'businessName firstLine secondLine postcode'
                })
                let users = await UserModel.find({ companyId: ap.Company._id, email: { $exists: true } }).select('email')
                console.log(users)
                if (ap?.Assignee?.email && users.length > 0) {
                    mail.sendmail(ap.Assignee.email, 136, { ...ap._doc, cc: users.map(u => u.email) })

                }
            }





            // console.log(ap)     
            // console.log(ap.leadId.Company)
            // if(ap.leadId.Company){
            //     let users = await UserModel.find({companyId:ap.leadId.Company._id,email:{$exists:true}}).select('email')
            //     console.log(users)
            //     if(ap?.Assignee?.email && users.length > 0){
            //    await mail.sendmail( ap.Assignee.email,136,{...ap._doc,cc:users.map(u => u.email)})

            //     }

            // }else if(ap?.Assignee?.email && ap?.leadId?.Consumer?.email){
            //     console.log('in if mail for appoinment')
            //    await mail.sendmail( ap.Assignee.email,136,{...ap._doc,cc:ap.leadId.Consumer.email})
            // }
            if (req.body.status !== "-123") {
                req.body.isFromAppoinment = true;
                if (req.body.service === 'Solar') {
                    req.body.serviceType = 'Eco';
                    req.body.subServiceType = [req.body.service]
                } else if (req.body.service === 'Business Rates') {
                    req.body.serviceType = 'BusinessRates';
                } else {
                    req.body.serviceType = [req.body.service];

                }

                req.body.Appoinment = ap._id;
                req.body.status = "New Lead"
                req.body.appoinmentBooker = req.user._id;
                req.body.LeadGenerator = req.user._id
                // let dt = await new LeadController().regUser.addLeadRegUser(req, res)
                // console.log('------Lead')
                // console.log(dt)
                // await AppoinmentModel.updateOne({ _id: ap._id }, { leadId: dt.leadId })
            }

            return res.send({ success: true, message: 'Appoinment added', _id: ap._id })
        } catch (error) {
            return handleError(req, res, error)
        }
    }

    async edit(req: Request, res: Response, next: any) {
        try {
            if (!req.params.id) {
                throw { message: 'id required' }
            }
            let old = await AppoinmentModel.findOne({ _id: req.params.id }).select('Company Consumer Assignee').populate({
                path: 'Assignee',
                select: 'role'
            }).lean();
            console.log(old)

            if (req.body.Assignee && old.Assignee.toString() !== req.body.Assignee && old.Assignee.role.toString() === "62b02a8fda27b400c8b8cf1e") {
                if (old.Consumer) {
                    let apcount = await AppoinmentModel.countDocuments({ Consumer: old.Consumer });
                    if (apcount === 1) {
                        await UserModel.updateOne({ _id: old.Consumer }, { $pull: { 'Assignee': old.Assignee._id } })
                    }
                } else if (old.Company) {
                    let apcount = await AppoinmentModel.countDocuments({ Company: old.Company });
                    if (apcount === 1) {
                        await Company.updateOne({ _id: old.Company }, { $pull: { 'Assignee': old.Assignee._id } })
                    }
                }
            }

            let appoinment = await AppoinmentModel.updateOne({ _id: req.params.id }, req.body, { new: true })

            if (req.body.startTime || req.body.endTime) {
                appoinment = await AppoinmentModel.findOne({ _id: req.params.id })
                    .populate({
                        path: 'Assignee',
                        select: 'name email role'
                    })
                    .populate({
                        path: 'Assignee2',
                        select: 'name email role'
                    })
                    .populate({
                        path: 'Booker',
                        select: 'name email'
                    })
                    .populate({
                        path: 'Consumer',
                        select: 'addressOne addressTwo firstName email lastName postcode'
                    })
                    .populate({
                        path: 'Company',
                        select: 'businessName firstLine secondLine postcode'
                    })
                if (appoinment.Consumer) {
                    if (appoinment.Assignee.role.toString() === "62b02a8fda27b400c8b8cf1e" || appoinment.Assignee.role.toString() === "5d5b92031c9d440000c99912") {
                        await UserModel.updateOne({ _id: appoinment.Consumer._id }, { $addToSet: { 'Assignee': appoinment.Assignee._id } })
                    }
                    await mail.sendmail(appoinment.Assignee.email, 136, { ...appoinment._doc, update: true, cc: appoinment.Consumer.email })

                } else if (appoinment.Company) {
                    if (appoinment.Assignee.role.toString() === "62b02a8fda27b400c8b8cf1e" || appoinment.Assignee.role.toString() === "5d5b92031c9d440000c99912") {
                        await Company.updateOne({ _id: appoinment.Company._id }, { $addToSet: { 'Assignee': appoinment.Assignee._id } })
                    }
                    let users = await UserModel.find({ companyId: appoinment.Company._id, email: { $exists: true } }).select('email')

                    if (appoinment?.Assignee?.email && users.length > 0) {
                        await mail.sendmail(appoinment.Assignee.email, 136, { ...appoinment._doc, update: true, cc: users.map(u => u.email) })

                    }
                    if (appoinment?.Assignee2?.email && users.length > 0) {
                        await mail.sendmail(appoinment.Assignee2.email, 136, { ...appoinment._doc, update: true, cc: users.map(u => u.email) })

                    }
                }

            }
            return res.send({ success: true, message: 'Appoinment updated' })
        } catch (error) {
            return handleError(req, res, error)
        }
    }

    async get(req: Request, res: Response) {
        try {
            console.log(req.params)
            if (!req.params.id)
                throw { message: 'id required' }

            let appoinment = await AppoinmentModel.findById(req.params.id)
                .populate({ path: 'Assignee', select: 'name' })
                .populate({ path: 'Assignee2', select: 'name' })
                .populate({ path: 'Booker', select: 'name email' })
                .populate({ path: 'leadAdministrator', select: 'name' })
                .populate(
                    [{
                        path: 'Company',
                        select: 'businessName firstLine secondLine postcode'
                    }, {
                        path: 'Consumer',
                        select: 'name firstName lastName surName addressOne addressTwo mobile postcode'
                    }
                    ]
                )
                //    .populate({
                //        path:'leadId',
                //        select:'leadId Company Consumer serviceType subServiceType',
                //        populate:[{
                //            path:'Company',
                //            select:'businessName firstLine secondLine'
                //        },{
                //            path:'Consumer',
                //            select:'name firstName lastName addressOne addressTwo'
                //        }
                //     ]
                //     })
                .lean();
            if (appoinment?.Company?._id) {
                // companyId: req.query.companyId,

                appoinment.Company.contact = await UserModel.findOne({ companyId: appoinment.Company._id });

            }

            return res.send({ success: true, data: appoinment })

        } catch (error) {
            return handleError(req, res, error)
        }
    }


    async list(req: Request, res: Response, next: any) {
        try {
            let isNext = false;
            const filter: any = {}
            const pipeline = []
            let skip = 0;
            let limit = 11

            if (req.query.skip)
                skip = Number(req.query.skip);
            if (req.query.limit)
                limit = Number(req.query.limit) + 1

            if (req.query.Assignee)
                filter.Assignee = ObjectId(req.query.Assignee)

            if (req.query.leadAdministrator) {
                if (typeof req.query.leadAdministrator === 'object')
                    filter.leadAdministrator = { $in: req.query.leadAdministrator.map((e) => ObjectId(e)) }
                else
                    filter.leadAdministrator = { $eq: ObjectId(req.query.leadAdministrator) }
            }

            if (req.query.appointmentType)
                filter.appointmentType = { $in: [req.query.appointmentType] }

            if (req.query.Booker)
                filter.Booker = ObjectId(req.query.Booker)

            if (req.user.role.toString() === '5d5b92031c9d440000c99912' || req.user.role.toString() === '62a8266b193c318de458db58' || req.user.role.toString() === '62b02a8fda27b400c8b8cf1e') {
                // console.log('in sales rep')
                filter.Assignee = ObjectId(req.user._id)
            }

            if (req.query.startTime) {
                filter.startTime = { $gte: new Date(req.query.startTime) }
            }
            if (req.query.endTime) {
                filter.endTime = { $lte: new Date(req.query.endTime) }
            }


            pipeline.push({
                $match: filter,
            })

            pipeline.push({
                $skip: skip
            })

            pipeline.push({
                $limit: limit
            })

            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'Assignee',
                    foreignField: '_id',
                    as: 'Assignee',
                }
            })

            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'leadAdministrator',
                    foreignField: '_id',
                    as: 'leadAdministrator'
                }
            })

            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'Assignee2',
                    foreignField: '_id',
                    as: 'Assignee2',
                }
            })

            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'Booker',
                    foreignField: '_id',
                    as: 'Booker',
                }
            })

            pipeline.push({
                $lookup: {
                    from: 'companies',
                    localField: 'Company',
                    foreignField: '_id',
                    as: 'Company',
                    // pipeline:[
                    //     {
                    //         $project:{
                    //             postcode:1
                    //         }
                    //     }
                    // ]
                }
            })

            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'Consumer',
                    foreignField: '_id',
                    as: 'Consumer',
                    // pipeline:[
                    //     {
                    //         $project:{
                    //             postcode:1
                    //         }
                    //     }
                    // ]
                }
            })

            // pipeline.push({
            //     $lookup:{
            //         from:'leads',
            //         localField:'leadId',
            //         foreignField:'_id',
            //         as:'leadId'
            //     }
            // })

            pipeline.push({
                $project: {
                    Assignee: { $arrayElemAt: ['$Assignee', 0] },
                    Assignee2: { $arrayElemAt: ['$Assignee2', 0] },

                    Booker: { $arrayElemAt: ['$Booker', 0] },
                    startTime: 1,
                    endTime: 1,
                    // leadId:{$arrayElemAt:['$leadId',0]},
                    status: 1,
                    surveyFor: 1,
                    postcode: {
                        $cond: [{ $lt: [{ $size: '$Company.postcode' }, 1] }, '$Consumer.postcode', '$Company.postcode'],

                    },
                    Company: { $arrayElemAt: ['$Company', 0] },
                    Consumer: { $arrayElemAt: ['$Consumer', 0] },
                    leadAdministrator: { $arrayElemAt: ['$leadAdministrator', 0] }
                }
            })

            pipeline.push({
                $project: {
                    'Assignee.name': '$Assignee.name',
                    'Assignee._id': '$Assignee._id',
                    "Assignee.color": "$Assignee.color",
                    'Assignee2.name': '$Assignee2.name',
                    'Assignee2._id': '$Assignee2._id',
                    "Assignee2.color": "$Assignee2.color",
                    'Booker.name': '$Booker.name',
                    'Booker._id': '$Booker._id',
                    startTime: 1,
                    endTime: 1,
                    // 'leadId.leadId':'$leadId.leadId',
                    // 'leadId._id':'$leadId._id',
                    status: 1,
                    dayOfMonth: { $dayOfMonth: '$startTime' },
                    surveyFor: 1,
                    appointmentType: 1,
                    installerFor: 1,
                    "Company.firstLine": '$Company.firstLine',
                    "Company.secondLine": '$Company.secondLine',
                    "Consumer.addressOne": "$Consumer.addressOne",
                    "Consumer.addressTwo": "$Consumer.addressTwo",
                    "Company.businessName": '$Company.businessName',
                    "Consumer.name": { $concat: ['$Consumer.firstName', ' ', '$Consumer.surName'] },
                    postcode: { $arrayElemAt: ['$postcode', 0] },
                    'leadAdministrator.name': '$leadAdministrator.name',
                    'leadAdministrator._id': '$leadAdministrator._id',
                }
            })

            if (req.query.sort && req.query.sortType) {
                pipeline.push({
                    $sort: {
                        [req.query.sort]: req.query.sortType === 'asc' ? 1 : -1
                    }
                })
            }

            // pipeline.push({
            //     $group:{
            //         _id:'$dayOfMonth',
            //         list:{$push:'$$ROOT'}
            //     }
            // })

            let data = await AppoinmentModel.aggregate(pipeline);

            if (data.length === limit) {
                data.pop();
                isNext = true;
            }

            return res.send({ success: true, data, isNext })

        } catch (error) {
            return handleError(req, res, error)
        }
    }

    async listByUser(req: Request, res: Response, next: any) {
        try {
            let isNext = false;
            const filter: any = {}

            let skip = 0;
            let limit = 11

            if (req.query.skip)
                skip = Number(req.query.skip);
            if (req.query.limit)
                limit = Number(req.query.limit) + 1

            if (req.query.assigneeId) {
                filter._id = req.query.assigneeId
            }

            let salesRep = await UserModel.find({ role: ObjectId('5d5b92031c9d440000c99912'), isActive: 1, ...filter }).select('name avatar').skip(skip).limit(limit)
            if (salesRep.length === limit) {
                isNext = true
                salesRep.pop()
            }
            let salesRepIds = salesRep.map(s => s._id?.toString());
            let salesRepMap = {}

            let data = await AppoinmentModel.aggregate([
                {
                    $match: {
                        startTime: {
                            $gte: new Date(req.query.startTime),
                            $lte: new Date(req.query.endTime)
                        },
                        $or: [
                            { Assignee: { $in: salesRep.map(s => s._id) } },
                            { Assignee2: { $in: salesRep.map(s => s._id) } },

                        ]

                    }
                }, {
                    $sort: {
                        startTime: 1
                    }
                }, {
                    $group: {
                        _id: '$Assignee',
                        list: { $push: '$$ROOT' }
                    }
                }, {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: '_id'
                    }
                }, {
                    $project: {
                        name: { $arrayElemAt: ['$_id.name', 0] },
                        avatar: { $arrayElemAt: ['$_id.avatar', 0] },
                        _id: { $arrayElemAt: ['$_id._id', 0] },
                        list: 1
                    }
                }

            ])

            let assignee2Data = await AppoinmentModel.aggregate([
                {
                    $match: {
                        startTime: {
                            $gte: new Date(req.query.startTime),
                            $lte: new Date(req.query.endTime)
                        },
                        $or: [
                            { Assignee: { $in: salesRep.map(s => s._id) } },
                            { Assignee2: { $in: salesRep.map(s => s._id) } },

                        ]

                    }
                }, {
                    $sort: {
                        startTime: 1
                    }
                }, {
                    $group: {
                        _id: '$Assignee2',
                        list: { $push: '$$ROOT' }
                    }
                }, {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: '_id'
                    }
                }, {
                    $project: {
                        name: { $arrayElemAt: ['$_id.name', 0] },
                        avatar: { $arrayElemAt: ['$_id.avatar', 0] },
                        _id: { $arrayElemAt: ['$_id._id', 0] },
                        list: 1
                    }
                }

            ])

            data = [...data, ...assignee2Data]
            data.forEach(e => {
                if (salesRepIds.includes(e._id?.toString())) {
                    let index = salesRepIds.indexOf(e._id?.toString());
                    if (index > -1) {
                        salesRepIds.splice(index, 1)
                    }
                }
            });

            salesRep.forEach(e => {
                if (salesRepIds.includes(e._id?.toString())) {
                    data.push({ _id: e._id?.toString(), name: e.name, avatar: e.avatar, list: [] })
                }
            });
            return res.send({ success: true, data: data, isNext: isNext })
        } catch (error) {
            return handleError(req, res, error)
        }
    }
    async getUserList(req: Request, res: Response, next: any) {
        try {

            let appoinments = await AppoinmentModel.find({
                //     $or:[
                //     {startTime:{$gte:new Date(req.body.startTime)} , endTime:{$gte:new Date(req.body.endTime)}} , //st1<=start ed1<=end
                //     {$and:[{startTime:{$lte:new Date(req.body.startTime)} , endTime:{$lte:new Date(req.body.endTime)}}, {startTime:{$lte:new Date(req.body.endTime)}}]} , //st1>=start ed1=>end, //st1>=start ed1=>end
                //     {startTime:{$lte:new Date(req.body.startTime)} , endTime:{$gte:new Date(req.body.endTime)}} , //st1>=start ed1<=end
                //     {startTime:{$gte:new Date(req.body.startTime)} , endTime:{$lte:new Date(req.body.endTime)}} , //st1=>start ed1<=end

                // ],
                startTime: { $lte: new Date(req.body.endTime) },
                endTime: { $gte: new Date(req.body.startTime) },
                status: { $ne: '2' }
            }).select('Assignee Assignee2').lean();

            let appointedUsers = []
            for (const ap of appoinments) {

                appointedUsers.push(ap.Assignee);
                if (ap.Assignee2) {
                    appointedUsers.push(ap.Assignee2);

                }
            }
            // console.log(appointedUsers)

            let users = await UserModel.find({
                role: {
                    $in: [
                        '5d5b92031c9d440000c99914',
                        '5d5b92031c9d440000c99911',
                        '5d5b92031c9d440000c99912',
                        '5d5b91db1c9d440000c9991d',
                        '62a8266b193c318de458db58',
                        '62b02a8fda27b400c8b8cf1e'
                    ],
                },
                // _id: { $nin: appointedUsers },
                isActive: 1
            }).select('name color').lean();




            return res.send({ success: true, data: users })
        } catch (error) {
            return handleError(req, res, error)
        }
    }

    async delete(req: Request, res: Response) {
        try {
            if (!req.params.id) {
                throw { message: 'id required' }
            }

            await AppoinmentModel.deleteOne({ _id: req.params.id })
            return res.send({ success: true, message: 'Appoinment deleted' })
        } catch (error) {
            handleError(req, res, error)
        }
    }
    async cronFunction(req, res, next) {
        // try {
        //     console.log('Appoinment cron')
        //     console.log(new Date())
        //     let tomorrowStart = new Date()
        //     tomorrowStart.setDate(tomorrowStart.getDate() - 3)
        //     tomorrowStart.setHours(0, 0, 0)

        //     let tomorrowEnd = new Date()
        //     tomorrowEnd.setDate(tomorrowEnd.getDate())
        //     tomorrowEnd.setHours(23, 59, 59)

        //     console.log(tomorrowStart, tomorrowEnd)

        //     let list = await AppoinmentModel.find({ startTime: { $gte: tomorrowStart, $lte: tomorrowEnd } }).populate({
        //         path: 'Assignee',
        //         select: 'name email mobile'
        //     }).populate({
        //         path: 'Booker',
        //         select: 'name email mobile'
        //     }).populate({
        //         path: 'Assignee2',
        //         select: 'name email mobile'
        //     })

        //     // await  AppoinmentModel.populate(list,{
        //     //     path:'leadId.Consumer',
        //     //     select:'addressOne addressTwo firstName email lastName'
        //     // })
        //     // await list.populate({
        //     //     path:'leadId.Consumer',
        //     //     select:'addressOne addressTwo'
        //     // })

        //     await AppoinmentModel.populate(list, {
        //         path: 'Consumer',
        //         select: 'addressOne addressTwo firstName email lastName postcode'
        //     })
        //     // await mail.sendmail( list.Assignee.email,136,{...list._doc,cc:list.Consumer.email})


        //     await AppoinmentModel.populate(list, {
        //         path: 'Company',
        //         select: 'businessName firstLine secondLine postcode'
        //     })

        //     // console.log(list)
        //     // let users = await UserModel.find({companyId:list.Company._id,email:{$exists:true}}).select('email')
        //     // console.log(users)
        //     // if(ap?.Assignee?.email && users.length > 0){
        //     //    await mail.sendmail( ap.Assignee.email,136,{...ap._doc,cc:users.map(u => u.email)})

        //     // }


        //     for (let ap of list) {
        //         if (ap.Consumer) {
        //             // console.log(ap.Assignee.email,ap._doc,ap.Consumer.email)
        //             let mailData = await mail.sendmail(ap.Assignee.email, 136, { ...ap._doc, cc: ap.Consumer.email })
        //             if (ap.Assignee.mobile) {
        //                 console.log('Mail data -------------------', mailData)
        //                 let data: any = await axios.post("http://localhost:8333/price//whatsapp-msg", {
        //                     senderNumber: ap.Assignee.mobile,
        //                     // senderNumber:"+14372862908",
        //                     message: mailData.whatsappText
        //                 })

        //             }
        //             if (ap.Assignee2.email) {
        //                 let mailData2 = await mail.sendmail(ap.Assignee2.email, 136, { ...ap._doc, cc: ap.Consumer.email })
        //                 if (ap.Assignee2.mobile) {
        //                     console.log('Mail data -------------------', mailData2)
        //                     let data: any = await axios.post("http://localhost:8333/price//whatsapp-msg", {
        //                         senderNumber: ap.Assignee2.mobile,
        //                         // senderNumber:"+14372862908",
        //                         message: mailData2.whatsappText
        //                     })
        //                 }
        //             }

        //         } else if (ap.Company) {
        //             let users = await UserModel.find({ companyId: ap.Company._id, email: { $exists: true } }).select('email')
        //             // console.log(users)
        //             // console.log(ap.Assignee.email,ap._doc)
        //             // console.log('---------')
        //             ap.Company.contact = users[0]
        //             if (ap?.Assignee?.email && users.length > 0) {
        //                 let mailData = await mail.sendmail(ap.Assignee.email, 136, { ...ap._doc, cc: users.map(u => u.email) })
        //                 if (ap.Assignee.mobile) {
        //                     let data: any = await axios.post("http://localhost:8333/price//whatsapp-msg", {
        //                         senderNumber: ap.Assignee.mobile,
        //                         message: mailData.whatsappText
        //                     })
        //                 }

        //                 if (ap?.Assignee2?.email) {
        //                     let mailData2 = await mail.sendmail(ap.Assignee2.email, 136, { ...ap._doc, cc: users.map(u => u.email) })
        //                     if (ap.Assignee2.mobile) {
        //                         let data: any = await axios.post("http://localhost:8333/price//whatsapp-msg", {
        //                             senderNumber: ap.Assignee2.mobile,
        //                             message: mailData2.whatsappText
        //                         })
        //                     }
        //                 }
        //             }
        //         }

        //         if (res?.send)
        //             res.send({ success: true })
        //     }
        // } catch (error) {
        //     console.log(error)
        //     if (res?.send)
        //         res.send({ success: false, message: error.message })
        // }
    }
    async replaceUser(req: Request, res: Response, next: any) {
        try {
            general.checkIdValidation(req.body, ['currentUserId', 'newUserId']);
            const currentUserIdObj = ObjectId(req.body.currentUserId);
            const newUserIdObj = ObjectId(req.body.newUserId);
            let collections = [
                {
                    collectionName: 'suppliers',
                    fields: {
                        "createdBy": "ObjectId",
                        "documents.addedBy": "Array<ObjectId>",
                        "supplierFlatFiles.addedBy": "Array<ObjectId>",
                    }
                },
                {
                    collectionName: 'appoinments',
                    fields: {
                        Assignee: "ObjectId",
                        Assignee2: "ObjectId",
                        Booker: "ObjectId",
                        Consumer: "ObjectId",
                        leadAdministrator: "ObjectId"
                    }
                },
                {
                    collectionName: 'companies',
                    fields: {
                        Contact: "Array<ObjectId>",
                        Partner: "ObjectId",
                        BlockedBy: "ObjectId",
                        Assignee: "Array<ObjectId>",
                        "meterReading.addedBy": "Array<ObjectId>",
                        "documents.addedBy": "Array<ObjectId>",
                        "installerDocuments.addedBy": "Array<ObjectId>",
                        "Notes.addedBy": "Array<ObjectId>",
                    }
                },
                {
                    collectionName: 'documenttimelines',
                    fields: {
                        sentBy: "ObjectId",
                        consumerId: "ObjectId",
                    }
                },
                {
                    collectionName: 'drives',
                    fields: {
                        Consumer: "ObjectId",
                    }
                },
                {
                    collectionName: 'forms',
                    fields: {
                        assignee: "ObjectId",
                        consumer: "ObjectId",
                    }
                },
                {
                    collectionName: 'histories',
                    fields: {
                        "addedBy": "ObjectId",
                        "User": "ObjectId",
                        "Consumer": "ObjectId",
                        "Company": "ObjectId"
                    }
                },
                {
                    collectionName: 'leads',
                    fields: {
                        "appoinmentBooker": "ObjectId",
                        "Consumer": "ObjectId",
                        "Assignee": "ObjectId",
                        "Contact": "ObjectId",
                        "Partner": "ObjectId",
                        "LeadGenerator": "ObjectId",
                        "leadAdministrator": "ObjectId",
                        "Installer": "ObjectId",
                        "Surveyor": "ObjectId",
                        "SystemDesigner": "ObjectId",
                        "Scaffolders": "ObjectId",
                        "Roofers": "ObjectId",
                        "Electricians": "ObjectId",
                        "GasEngineers": "ObjectId",
                        "CavityWallInstaller": "ObjectId",
                        "UnderFloorInstaller": "ObjectId",
                        "LoftInstaller": "ObjectId",
                        "VentilationInstaller": "ObjectId",
                        "InternalWallInsulation": "ObjectId",
                        "ExternalWallInsulation": "ObjectId",
                        "RoomInRoofInstaller": "ObjectId",
                        "ASHPInstaller": "ObjectId",
                        "salesRep": "ObjectId",
                        "history.editedBy": "Array<ObjectId>",
                        "history.addedBy": "Array<ObjectId>",
                        "notesComment.addedBy": "Array<ObjectId>",

                    }
                },
                {
                    collectionName: 'paymentshistories',
                    fields: {
                        user: "ObjectId",
                    }
                },
                {
                    collectionName: 'quotes',
                    fields: {
                        Consumer: "ObjectId",
                        User: "Array<ObjectId>",
                        Assignee: "ObjectId",
                        createdBy: "ObjectId",
                        BlockedBy: "ObjectId",
                        Scaffolders: "ObjectId",
                        Roofers: "ObjectId",
                        Electricians: "ObjectId",
                        "Gas Engineers": "ObjectId",
                        "Cavity Wall Installer": "ObjectId",
                        "Under Floor Installer": "ObjectId",
                        "Loft Installer": "ObjectId",
                        "Ventilation Installer": "ObjectId",
                        "Internal Wall Insulation": "ObjectId",
                        "External Wall Insulation": "ObjectId",
                        "Room In Roof Installer": "ObjectId",
                        "ASHP Installer": "ObjectId",
                        "StatusHistory.User": "Array<ObjectId>",
                        "Notes.addedBy": "Array<ObjectId>",

                    }
                },
                {
                    collectionName: 'renewals',
                    fields: {
                        Consumer: "ObjectId",
                        User: "Array<ObjectId>",
                        Assignee: "ObjectId",
                        createdBy: "ObjectId",
                        BlockedBy: "ObjectId",
                        "StatusHistory.User": "Array<ObjectId>",
                        "Notes.addedBy": "Array<ObjectId>",

                    }
                },
                {
                    collectionName: 'sites',
                    fields: {
                        User: "Array<ObjectId>",
                    }
                },
                {
                    collectionName: 'tasks',
                    fields: {
                        Consumer: "ObjectId",
                        Observer: "Array<ObjectId>",
                        Assignee: "ObjectId",
                        BlockedBy: "ObjectId",
                        createdBy: "ObjectId",
                        "Comments.CommentedBy": "Array<ObjectId>",
                        "documents.addedBy": "Array<ObjectId>",

                    }
                },
                {
                    collectionName: 'templates',
                    fields: {
                        createdBy: "ObjectId",
                        editedBy: "ObjectId",
                    }
                },
                {
                    collectionName: 'users',
                    fields: {
                        BlockedBy: "ObjectId",
                        Assignee: "Array<ObjectId>",
                        "meterReading.addedBy": "Array<ObjectId>",
                        "documents.addedBy": "Array<ObjectId>",
                        "installerDocuments.addedBy": "Array<ObjectId>",
                        "Notes.addedBy": "Array<ObjectId>",
                        "history.addedBy": "Array<ObjectId>",
                    }
                },
                {
                    collectionName: 'invoices',
                    fields: {
                        consumer: "ObjectId",
                    }
                },]
            let sampleResult = {}
            for (let index = 0; index < collections.length; index++) {
                console.log('running index ', index);
                const { collectionName, fields } = collections[index];
                const pipeline = generatePipeline(collectionName, fields, currentUserIdObj, newUserIdObj);
                // Execute the pipeline
                console.log('pipeline===>>>', JSON.stringify(pipeline));
                const result = await mongoose.connection.collection(collectionName).aggregate(pipeline).toArray();
                console.log('result==>', result[0]);
                sampleResult[collectionName] = [result[0]]
            }
            res.send({ success: true, message: 'Updated successfully', sampleResult });
        } catch (error) {
            console.log(error);
            commonUtils.sendErrorResponse(req, res, error);
        }
    }
}



if (process.env.NODE_APP_INSTANCE === '0') {
    console.log('cron will run')
    cron.schedule('0 2 * * *', async () => {
        await new AppointmentController().cronFunction(null, null, null)
    })
}




export default new AppointmentController();