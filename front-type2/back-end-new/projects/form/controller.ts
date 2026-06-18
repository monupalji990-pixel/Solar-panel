import FormModel from "../../models/Form";
import UserModel from "../../models/user";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
const { ObjectId } = require('mongoose').Types.ObjectId;


class FormController {
    async add(req, res, next) {
        try {
            let result = await new FormController().checkCustomerAndUser(req, null, null)
            if (!result) {
                throw { message: "Email is not valid" }
            }
            let forms = await FormModel.create(req.body)
            return res.send({ success: true, message: "Form submitted" })
        } catch (err) {
            res.send({ success: false, message: err.message })


        }
    }

    async checkCustomerAndUser(req, res, next) {
        try {

            let user = await UserModel.findOne({
                role: { $ne: '5d5b92031c9d440000c99915' },
                isDelete: false,
                $or: [{ email: req.body.assignee }, { mobile: req.body.assignee }]
            });
            if (!user) {
                throw { message: "User Not Found" }
            }

            req.body.assignee = user._id

            let consumer = await UserModel.findOne({
                role: '5d5b92031c9d440000c99915',
                // email:req.body.consumer,
                $or: [{ email: req.body.consumer }, { mobile: req.body.consumer }],
                isDelete: false,
            })

            if (!consumer) {
                throw { message: 'Consumer Not Found' }
            }
            req.body.consumer = consumer._id

            if (res) {
                return res.send({ success: true })
            } else {
                return true
            }


        } catch (err) {
            if (res) {
                res.send({ success: false, message: err.message })
            } else {
                return false
            }

        }
    }

    async edit(req, res, next) {
        try {
            let form = await FormModel.findOneAndUpdate({
                _id: req.params.id,

            }, req.body.update, { new: true, runValidators: true })

            return res.send({ success: true, data: form })
        } catch (err) {
            res.send({ success: false, message: err.message })

        }
    }

    async list(req, res, next) {
        try {

            let skip = req.query.skip ? Number(req.query.skip) : 0
            let limit = req.query.limit ? Number(req.query.limit) + 1 : 11
            let isNext = false

            let pipeline = []

            if (req.query.assignee) {
                pipeline.push({
                    $match: {
                        assignee: ObjectId(req.query.assignee)
                    }
                })
            }

            if (req.query.consumer) {
                pipeline.push({
                    $match: {
                        consumer: ObjectId(req.query.consumer)
                    }
                })
            }

            pipeline.push({
                $skip: skip
            })
            pipeline.push({
                $limit: limit
            })

            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'assignee',
                    foreignField: '_id',
                    as: 'assignee'
                }
            })

            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'consumer',
                    foreignField: '_id',
                    as: 'consumer'
                }
            })

            pipeline.push({
                $project: {
                    assignee: { $arrayElemAt: ['$assignee', 0] },
                    consumer: { $arrayElemAt: ['$consumer', 0] },
                    data: 1

                }
            })

            let data = await FormModel.aggregate(pipeline);

            if (data.length === limit) {
                isNext = true
                data.pop()
            }
            return res.send({ success: true, data })


        } catch (error) {
            res.send({ success: false, message: error.message })

        }
    }
}

exports.FormController = new FormController()