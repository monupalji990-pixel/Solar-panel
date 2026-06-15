const _ = require("lodash");
const path = require("path");
const moment = require('moment');
const fs = require("fs");


const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types


import TaskModel from "../../models/Task";
import ControllerUtils from "../../utils/ControllerUtils";
import { Request, Response } from "../../templates/commandInterface";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import HistoryModule from "../../sharedModules/smallModules/historyModule";

class AdminController { }
class ManagementController { }
class PartnerController { }
class SalesRepController { }
class ObservingPartnerController { }
class RegUserController { }

export default class TaskController extends ControllerUtils {
  admin: AdminController;
  management: ManagementController;
  partner: PartnerController;
  salesRep: SalesRepController;
  observingPartner: ObservingPartnerController;
  regUser: RegUserController;
  constructor() {
    super();
    this.admin = new AdminController();
    this.management = new ManagementController();
    this.partner = new PartnerController();
    this.salesRep = new SalesRepController();
    this.observingPartner = new ObservingPartnerController();
    this.regUser = new RegUserController();
  }

  async CreateTask(req: Request, res: Response) {
    try {
      let task: any = {};
      task = req.body;
      task.Reminder = [];
      task.createdBy = req.user._id;
      if (req.files && req.files.Attachments) {
        task.Attachments = req.files.Attachments
          .map(f => ({
            name: f.originalname,
            value: f.location,
            type: f.mimetype
          }));
      }

      if (req.user && req.user.role.roleName !== "Admin") {
        const s = req.body.Observer;
        if (!req.body.Observer.includes(String(req.user._id))) {
          s.push(String(req.user._id)); // adding creator as an observer
        }
        task.Observer = s;
      }

      const previousTask = await TaskModel.findOne({ customTaskId: { $exists: true } }).sort({ createdAt: -1 })
      if (previousTask) {
        const previousTaskIdNumber = parseInt(previousTask.customTaskId.split("-")[1], 10);
        const newTaskIdNumber = previousTaskIdNumber + 1;

        task.customTaskId = `TC-${newTaskIdNumber.toString().padStart(5, '0')}`;
      } else {
        task.customTaskId = "TC-00001";
      }

      const newTask = new TaskModel(task);
      const newTaskCreate = await newTask.save();

      const history = new HistoryModule();
      history.TaskHistory(newTaskCreate._id, { Create: '' }, { Create: "Task created" }, req);

      res.send({ success: true, task: newTaskCreate });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async TasksList(req: Request, res: Response) {
    try {
      let filter: any = {};
      let filterBeforeLookup: any = {};
      if (req.query.Search) {
        filter.$or = [
          { Title: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          { "Company.businessName": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          { "Consumer.firstName": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          { customTaskId: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        ];
      }
      if (['Management', 'Partner', 'Sales Rep', 'Observing Partner'].includes(req.user.role.roleName)) {
        filterBeforeLookup.$or = [{ Assignee: { $in: [req.user._id] } }, { Observer: { $in: [req.user._id] } }];
      }
      if (req.query.taskType) filter.TaskOn = req.query.taskType;
      if (req.query.taskSepType) filter.TaskSepType = req.query.taskSepType;
      if (req.query.Lead) filterBeforeLookup.Lead = ObjectId(req.query.Lead);
      if (req.query.Quote) filterBeforeLookup.Quote = ObjectId(req.query.Quote);
      if (req.query.isComplete < 1) filter.Status = { $ne: "1010" };
      if (req.query.isDelete) {
        filter.isDelete = true;
        delete filter.Status
      }
      if (req.query.Company && typeof req.query.Company === 'string') filterBeforeLookup.Company = ObjectId(req.query.Company);
      if (req.query.Company && typeof req.query.Company === 'object') {
        let ca = [];
        req.query.Company.filter(c => { ca.push(ObjectId(c)) })
        filterBeforeLookup.Company = { $in: ca };
      };
      if (req.query.Consumer && typeof req.query.Consumer === 'string') filterBeforeLookup.Consumer = ObjectId(req.query.Consumer);
      if (req.query.Consumer && typeof req.query.Consumer === 'object') {
        let ca = [];
        req.query.Consumer.filter(c => { ca.push(ObjectId(c)) })
        filterBeforeLookup.Consumer = { $in: ca };
      };

      if (req.query.DataOf && typeof req.query.DataOf === 'string') filterBeforeLookup[req.query.DataOf] = { $exists: true };
      if (req.query.DataOf && typeof req.query.DataOf === 'object') {
        filterBeforeLookup.$or = [];
        req.query.DataOf.filter(v => {
          let d: any = {};
          d[v] = { $exists: true };
          filterBeforeLookup.$or.push(d)
        })
      }

      if (req.query.quoteStatus && typeof req.query.quoteStatus === 'string') filter.Status = { $in: [req.query.quoteStatus] };
      if (req.query.quoteStatus && typeof req.query.quoteStatus === 'object') filter.Status = { $in: req.query.quoteStatus };
      if (req.query.Assignee && typeof req.query.Assignee === 'string') filterBeforeLookup.Assignee = ObjectId(req.query.Assignee);
      if (req.query.Assignee && typeof req.query.Assignee === 'object') {
        let ca = [];
        req.query.Assignee.filter(c => { ca.push(ObjectId(c)) })
        filterBeforeLookup.Assignee = { $in: ca };
      };
      if (req.query.dueTask) {
        filterBeforeLookup.Assignee = ObjectId(req.user._id);
        filterBeforeLookup.DueDate = {
          $lte: new Date(),
          $gt: new Date(new Date().setDate(new Date().getDate() - 1)),
        }
      }

      if (req.path.includes("/count")) {
        const count = await TaskModel.aggregate([
          { $match: filterBeforeLookup },
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
              localField: 'Observer',
              foreignField: '_id',
              as: 'Observer'
            }
          },
          {
            $lookup: {
              from: 'companies',
              localField: 'Company',
              foreignField: '_id',
              as: 'Company'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'Consumer',
              foreignField: '_id',
              as: 'Consumer'
            }
          },
          {
            $unwind: {
              "path": "$Company",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            $unwind: {
              "path": "$Consumer",
              "preserveNullAndEmptyArrays": true
            }
          },
          { $match: filter },
          {
            $match: {
              $or: [
                {
                  Renewal: {
                    $exists: false
                  },
                  Title: /^((?!dometic renewal).)*$/gi
                },
                {
                  Renewal: {
                    $exists: true
                  },
                  DueDate: {
                    $lte: new Date(new Date(new Date().setDate(new Date().getDate() + 365)).setHours(23, 59))
                  }
                },
                {
                  Title: /DOMETIC RENEWAL/i,
                  DueDate: {
                    $lte: new Date(new Date(new Date().setDate(new Date().getDate() + 365)).setHours(23, 59))
                  }
                }
              ]
            }
          },
          { $count: "count" }
        ]);
        let countData = 0;
        if (count.length > 0) {
          countData = count[0].count;
        }
        res.send({ count: countData, success: true });
      } else {
        let sortObj: any = { updatedAt: 1 };
        if (req.query.sort) sortObj = { [req.query.sort]: req.query.sortType === 'asc' ? 1 : -1 };
        let skipNumber = 0;
        let limitNumber = 99;
        if (req.query.skip) skipNumber = Number(req.query.skip);
        if (req.query.limit) limitNumber = Number(req.query.limit);

        const taskQuery = TaskModel.aggregate([
          { $match: filterBeforeLookup },
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
              localField: 'Observer',
              foreignField: '_id',
              as: 'Observer'
            }
          },
          {
            $lookup: {
              from: 'companies',
              localField: 'Company',
              foreignField: '_id',
              as: 'Company'
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: 'Consumer',
              foreignField: '_id',
              as: 'Consumer'
            }
          },
          {
            $unwind: {
              "path": "$Company",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            $unwind: {
              "path": "$Consumer",
              "preserveNullAndEmptyArrays": true
            }
          },
          {
            $unwind: {
              "path": "$Assignee",
              "preserveNullAndEmptyArrays": true
            }
          },
          { $match: filter },
          {
            $match: {
              $or: [
                {
                  Renewal: {
                    $exists: false
                  },
                  Title: /^((?!dometic renewal).)*$/gi
                },
                {
                  Renewal: {
                    $exists: true
                  },
                  DueDate: {
                    $lte: new Date(new Date(new Date().setDate(new Date().getDate() + 365)).setHours(23, 59))
                  }
                },
                {
                  Title: /DOMETIC RENEWAL/i,
                  DueDate: {
                    $lte: new Date(new Date(new Date().setDate(new Date().getDate() + 365)).setHours(23, 59))
                  }
                }
              ]
            }
          },
          { $sort: sortObj },
          { $skip: skipNumber },
          {
            $project: {
              TaskID: 1,
              customTaskId: 1,
              Title: 1,
              Priority: 1,
              DueDate: 1,
              Status: 1,
              createdAt: 1,
              Description: 1,
              "Observer.name": 1,
              "Observer._id": 1,
              "Assignee.name": 1,
              "Assignee._id": 1,
              "Company._id": 1,
              "Company.businessName": 1,
              "Consumer._id": 1,
              "Consumer.title": 1,
              "Consumer.firstName": 1,
              "Consumer.surName": 1
            }
          },
          { $limit: limitNumber }
        ]);

        const tasks = await taskQuery.exec();
        res.send({ data: tasks, count: 0, success: true });
      }

    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async TasksComments(req: Request, res: Response) {
    try {
      let filter: any = {}
      let skip: Number = Number(req.query.skip) ? Number(req.query.skip) : 0;
      let limit: Number = Number(req.query.limit) ? Number(req.query.limit) + 1 : 10
      let isNext: Boolean = false;

      if (req.query.Company) {
        filter.Company = ObjectId(req.query.Company)
      } else if (req.query.Consumer) {
        filter.Consumer = ObjectId(req.query.Consumer)
      }
      filter['Comments.0'] = { $exists: true }

      const data = await TaskModel.aggregate([
        {
          $match: filter,
        }, {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
          }
        }, {
          $lookup: {
            from: 'users',
            localField: 'Assignee',
            foreignField: '_id',
            as: 'Assignee',
          }
        },
        // {
        //   $lookup:{
        //     from:'users',
        //     localField:'Comments.CommentedBy',
        //     foreignField:'_id',
        //     as:'CommentedBy',
        //   }
        // },
        {
          $project: {
            TaskID: 1,
            Comments: 1,
            Title: 1,
            updatedAt: 1,
            createdBy: 1,
            DueDate: 1,
            Time: 1,
            Assignee: 1
          }
        }, {
          $sort: {
            updatedAt: -1
          }
        }, {
          $unwind:
          {
            path: '$Comments',

            preserveNullAndEmptyArrays: true
          }
        }, {

          $lookup: {
            from: 'users',
            localField: 'Comments.CommentedBy',
            foreignField: '_id',
            as: 'Comments.CommentedBy',
          }

        }, {
          $skip: skip
        }, {
          $limit: limit
        },

      ])

      if (data.length === limit) {
        data.pop();
        isNext = true
      }
      return res.send({ success: true, data: data, isNext })
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);

    }
  }

  async TaskStats(req: Request, res: Response) {
    try {
      let filter = null;
      let pipeline = []

      if (req.query.Assignee) {
        pipeline.push({
          $match: { Assignee: ObjectId(req.query.Assignee) }
        })
      }


      pipeline.push({
        $match: {
          Status: { $nin: ["1018", "1019", "1023", "1025", "1010", "1008"] },
          $or: [
            {
              Renewal: {
                $exists: false
              },
              Title: /^((?!dometic renewal).)*$/gi
            },
            {
              Renewal: {
                $exists: true
              },
              DueDate: {
                $lte: new Date(new Date(new Date().setDate(new Date().getDate() + 365)).setHours(23, 59))
              }
            },
            {
              Title: /DOMETIC RENEWAL/i,
              DueDate: {
                $lte: new Date(new Date(new Date().setDate(new Date().getDate() + 365)).setHours(23, 59))
              }
            }
          ]
        }
      })
      pipeline.push({
        $group: {
          _id: {
            'Assignee': '$Assignee'
          },
          'tasks': {
            $push: {
              'Title': '$Title',
              'createdAt': '$createdAt',
              'day': {
                $cond: [
                  { $gt: [{ $divide: [{ $subtract: [new Date(/*new Date().setHours(0,0,0)*/), "$createdAt"] }, 86400000] }, 1] },
                  { $ceil: { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 86400000] } },
                  { $floor: { $subtract: [{ $dayOfMonth: new Date() }, { $dayOfMonth: "$createdAt" }] } }
                ]
              }
            }
          },
          'total': { $sum: 1 }
        }
      })
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: '_id.Assignee',
          foreignField: '_id',
          as: 'Assignee'
        }
      })
      pipeline.push({
        $project: {
          "total": 1,
          "Assignee": { $arrayElemAt: ["$Assignee.name", 0] },
          "stats": 1,
          "tasks": 1
        }
      })
      if (req.query.Search) {
        filter = { Assignee: { $regex: `.*${req.query.Search}.*`, $options: "i" } }
        pipeline.push({ $match: filter })
      }

      let TasksByUsers = await TaskModel.aggregate(pipeline)
      TasksByUsers.forEach((userTasks, idx) => {
        let today = 0
        let one_to_seven = 0
        let eight_to_fourteen = 0
        let fifteen_to_thirty = 0
        let thirtyOne_to_sixty = 0
        let sixtyOne_to_120 = 0
        let one_twenty_one_to_240 = 0
        let more_than_240 = 0

        userTasks.tasks.forEach(task => {
          if (task.day == 0)
            today++;
          else if (task.day >= 1 && task.day < 8)
            one_to_seven++
          else if (task.day > 7 && task.day <= 14)
            eight_to_fourteen++
          else if (task.day > 14 && task.day <= 30)
            fifteen_to_thirty++
          else if (task.day > 30 && task.day <= 60)
            thirtyOne_to_sixty++
          else if (task.day > 60 && task.day <= 120)
            sixtyOne_to_120++
          else if (task.day > 120 && task.day <= 240)
            one_twenty_one_to_240++
          else
            more_than_240++
        });
        TasksByUsers[idx].stats = { today, one_to_seven, eight_to_fourteen, fifteen_to_thirty, thirtyOne_to_sixty, sixtyOne_to_120, one_twenty_one_to_240, more_than_240 }
        delete TasksByUsers[idx].tasks
      });
      return res.send({ success: true, data: TasksByUsers, length: TasksByUsers.length })

    } catch (error) {
      console.log(error)
      return res.send({ success: false, message: error.message })
    }
  }

  async TaskListForCalender(req: Request, res: Response) {
    try {
      if (!req.body.timeFilter)
        throw { message: 'Filter type is required' }

      let timeFilter: any = {}
      let otherFilter: any = {}
      if (req.body.Lead) {
        otherFilter.Lead = ObjectId(req.body.Lead)
      }
      if (req.body.timeFilter) {
        if (req.body.timeFilter.type == 'year') {
          let date = new Date();
          date.setMonth(0)
          date.setFullYear(req.body.timeFilter.year)
          let firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
          let lastDay = new Date(date.getFullYear(), date.getMonth() + 12, 0, 23, 59, 59, 59);
          timeFilter.DueDate = {
            $gte: firstDay,
            $lte: lastDay
          }

        }
        else if (req.body.timeFilter.type == 'month') {
          if (!req.body.timeFilter.year)
            throw { message: 'year required' }
          if (!req.body.timeFilter.month)
            throw { message: 'month required' }

          let date = new Date();
          date.setMonth(req.body.timeFilter.month)
          date.setFullYear(req.body.timeFilter.year)
          let firstDay = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
          let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 59);
          timeFilter.DueDate = {
            $gte: firstDay,
            $lte: lastDay
          }
        } else if (req.body.timeFilter.type == 'date') {
          if (!req.body.timeFilter.year)
            throw { message: 'year required' }
          if (!req.body.timeFilter.month)
            throw { message: 'month required' }
          if (!req.body.timeFilter.date)
            throw { message: 'date required' }

          let date = new Date();
          date.setMonth(req.body.timeFilter.month)
          date.setFullYear(req.body.timeFilter.year)
          date.setDate(req.body.timeFilter.date)
          timeFilter.DueDate = {
            $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
            $lte: new Date(new Date(date).setHours(23, 59, 59, 59))
          }
        }
      }

      let pipeline = []

      let fObj: any = {}
      if (req.body.user) {

        fObj.Assignee = ObjectId(req.body.user)
      }


      pipeline.push({
        $match: {
          ...fObj,
          ...timeFilter,
          ...otherFilter
        }
      })

      pipeline.push({
        $lookup: {
          from: 'leads',
          localField: 'Lead',
          foreignField: '_id',
          as: 'Lead'
        }
      })

      pipeline.push({
        $unwind: {
          path: '$Lead',
          preserveNullAndEmptyArrays: true
        }
      })

      pipeline.push({
        $project: {
          Title: 1,
          Description: 1,
          DueDate: 1,
          Time: 1,
          Status: 1,
          'Lead.leadId': 1,
          'Lead._id': 1
        }
      })

      let taskList = await TaskModel.aggregate(pipeline)

      res.send({ status: true, data: taskList })
    } catch (error) {
      console.log(error)
      return res.send({ success: false, message: error.message })
    }
  }

  async TaskListForTrello(req: Request, res: Response) {
    try {
      if (!req.body.status || req.body.status.length < 1)
        throw { message: 'status array required' }
      let filter: any = {}
      if (['Management', 'Partner', 'Sales Rep', 'Observing Partner'].includes(req.user.role.roleName)) {
        filter.$or = [{ Assignee: { $in: [req.user._id] } }, { Observer: { $in: [req.user._id] } }];
      }

      if (req.body.Lead) filter.Lead = ObjectId(req.body.Lead);
      if (req.body.Quote) filter.Quote = ObjectId(req.body.Quote);
      if (req.body.isComplete < 1) filter.Status = { $ne: "1010" };
      if (req.body.isDelete) filter.isDelete = true;
      if (req.body.Assignee) filter.Assignee = ObjectId(req.body.Assignee);


      if (req.body.Search) {
        let $or = [
          { Title: { $regex: `.*${req.body.Search}.*`, $options: "i" } },
          { "Company.businessName": { $regex: `.*${req.body.Search}.*`, $options: "i" } },
          { "Consumer.firstName": { $regex: `.*${req.body.Search}.*`, $options: "i" } },
        ]
        if (filter.$or) {

          let temp = filter.$or;
          delete filter.$or;
          filter.$and = [
            { $or: temp },
            { $or: $or }
          ]
        }
      }
      if (req.body.Company) {
        filter.Company = ObjectId(req.body.Company)
      }


      if (req.body.Consumer) {
        filter.Consumer = ObjectId(req.body.Consumer)
      }

      let obj = {};
      let hasNext = false;

      for (let s of req.body.status) {
        filter.Status = s;
        console.log(filter)
        obj[s] = await TaskModel.find({ ...filter })
          .sort({ createdAt: 1 })
          .skip(req.body.skip)
          .limit(11)
          // .select('Title createdAt')
          .populate({ path: 'Assignee', select: 'name' })
          .populate({ path: 'Observer', select: 'name' })
          .populate({ path: 'Company', select: 'businessName' })
          .populate({ path: 'Consumer', select: 'title firstName surName' })

        if (obj[s].length === 11) {
          hasNext = true;
          obj[s].pop();
        } else {
          hasNext = false
        }
      }

      return res.send({ success: true, data: obj, hasNext })
    } catch (error) {
      console.log(error)
      return res.send({ success: false, message: error.message })
    }
  }
  async BasicTaskDetailsView(req: Request, res: Response) {
    try {
      if (!req.query.Assignee)
        throw { message: 'Assignee required' }
      let pipeline = []

      pipeline.push({
        $match: {
          Assignee: ObjectId(req.query.Assignee),
          Status: { $nin: ["1018", "1019", "1023", "1025", "1010", "1008"] },
          $or: [
            {
              Renewal: {
                $exists: false
              },
              Title: /^((?!dometic renewal).)*$/gi
            },
            {
              Renewal: {
                $exists: true
              },
              DueDate: {
                $lte: new Date(new Date(new Date().setDate(new Date().getDate() + 365)).setHours(23, 59))
              }
            },
            {
              Title: /DOMETIC RENEWAL/i,
              DueDate: {
                $lte: new Date(new Date(new Date().setDate(new Date().getDate() + 365)).setHours(23, 59))
              }
            }
          ]
        }
      })
      pipeline.push({
        $lookup: {
          from: 'companies',
          localField: 'Company',
          foreignField: '_id',
          as: 'Company'
        }
      })
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'Consumer',
          foreignField: '_id',
          as: 'Consumer'
        }
      })

      pipeline.push({
        $project: {
          Title: 1,
          DueDate: 1,
          Status: 1,
          createdAt: 1,
          Company: {
            $arrayElemAt: ['$Company.businessName', 0]
          },
          Consumer: {
            $arrayElemAt: ['$Consumer.firstName', 0]
          },
          createdBefore: {
            $cond: [
              { $gt: [{ $divide: [{ $subtract: [new Date(), "$createdAt"] }, 86400000] }, 1] },
              { $ceil: { $divide: [{ $subtract: [new Date(), "$createdAt"] }, 86400000] } },
              { $floor: { $subtract: [{ $dayOfMonth: new Date() }, { $dayOfMonth: "$createdAt" }] } }
            ]
          }
        }
      })

      let tasks = await TaskModel.aggregate(pipeline)
      return res.send({ success: false, data: tasks })

    } catch (error) {
      console.log(error)
      res.send({ success: false, message: error.message })
    }
  }

  async ViewTask(req: Request, res: Response) {
    try {
      const id = req.body.TaskID ? req.body.TaskID : req.params.task_id;
      const data = await TaskModel.findById(id)
        .populate("Assignee Observer Comments.CommentedBy Quote Lead createdBy", "isActive name avatar QuoteID leadId")
        .populate({
          path: "Company Consumer",
          select: "businessName firstName surName title",
          populate: {
            path: "Assignee",
            select: "name isActive"
          },
        });
      res.send({ success: true, data });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async getEventsOfTask(req: Request, res: Response) {
    try {
      if (!req.body.TaskId)
        throw { message: 'TaskId is required' }

      let events = await TaskModel.findOne({ _id: req.body.TaskId }).select("Events");

      return res.send({ success: true, data: events })
    } catch (error) {
      console.log(error)
      return res.send({ success: false, message: error.message })
    }
  }

  async addEventToTask(req: Request, res: Response) {
    try {
      if (!req.body.TaskId)
        throw { message: "TaskId required" }

      let task = await TaskModel.findOne({ _id: req.body.TaskId });
      if (req.body.Event) {
        task?.Events.push(req.body.Event)
        await task.save();
        return res.send({ success: true, message: "Event added successfully" })
      } else {
        return res.send({ success: false, message: 'Event required' })
      }

    } catch (error) {
      console.log(error)
      return res.send({ success: false, message: error.message })
    }
  }

  async removeEventFromTask(req: Request, res: Response) {
    try {
      if (!req.body.TaskId)
        throw { message: "TaskId required" }
      if (!req.body.EventId)
        throw { message: "EventId required" }

      let task = await TaskModel.findOne({ _id: req.body.TaskId });
      task.Events.pull({ _id: req.body.EventId })
      await task.save()
      return res.send({ success: true, message: "Event deleted successfully" })

    } catch (error) {
      console.log(error)
      return res.send({ success: false, message: error.message })
    }
  }

  async DeleteTask(req: Request, res: Response) {
    try {
      await TaskModel.deleteMany({ _id: { $in: req.body } })
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async TaskDeleteActions(req: Request, res: Response) {
    try {
      await TaskModel.updateOne({ _id: req.body.TaskID }, { isBlock: 0, isDelete: req.body.isDelete });
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async UploadAttachments(req: Request, res: Response) {
    res.send({ success: true });
  }

  async AddComment(req: Request, res: Response) {
    try {
      let co: any = {};
      co.CommentedBy = req.user._id;
      co.Description = req.body.description;
      co.timestamps = new Date().getTime();
      co.created = new Date();
      if (req.files.Attachments) {
        co.Attachments = req.files.Attachments
          .map(f => ({
            name: f.originalname,
            value: f.location,
            type: f.mimetype
          }));
      }
      if (req.body.History) co.History = req.body.History;
      const mainUpdate: any = {};
      if (req.body.Status) mainUpdate.Status = req.body.Status
      mainUpdate.$push = { Comments: [co] };
      const resp = await TaskModel.updateOne({ _id: req.body.TaskID }, mainUpdate);

      const history = new HistoryModule();
      history.TaskHistory(req.body.TaskID, { Comment: '' }, { Comment: "Comment added" }, req);

      res.send({ success: true, data: resp });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async UpdateTask(req: Request, res: Response) {
    try {
      let update = req.body
      if (req.files && req.files.Attachments) {
        let na = req.files.Attachments
          .map(f => ({
            name: f.originalname,
            value: f.location,
            type: f.mimetype
          }));
        update.$push = { Attachments: na }
        update.AttachmentHistory = 'Attachment added'
      }
      const previousObject = await TaskModel.findById(req.body.TaskID);
      await TaskModel.updateOne({ _id: req.body.TaskID }, update);

      const history = new HistoryModule();
      history.TaskHistory(req.body.TaskID, previousObject, update, req);

      const to = new TaskController();
      to.ViewTask(req, res);
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DownloadAttachment(req: Request, res: Response) {
    res.download(path.join(__dirname, `../uploads/${req.params.filename}`));
  }

  async DeleteTaskAttachment(req: Request, res: Response) {
    fs.unlink(
      path.join(__dirname, `../uploads/${req.body.filename}`),
      () => { }
    );
    this.UpdateTask(req, res);
  }

  async CheckDueTask(req: Request, res: Response) {
    try {
      const filter: any = {};
      filter.Assignee = req.user._id;
      filter.Status = { $ne: 1010 };
      filter.DueDate = {
        $gt: new Date((moment().add(-1, 'days').format('YYYY-MM-DD')) + "T23:59:59.100Z"),
        $lt: new Date((moment().add(1, 'days').format('YYYY-MM-DD')) + "T00:00:00.000Z")
      };

      const t = await TaskModel.find(filter).limit(10).select('Title DueDate Time');
      res.send({ success: true, data: t });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DeleteMultiTask(req: Request, res: Response) {
    try {
      await req.body.deleteIds.forEach(async (element) => {
        await TaskModel.remove({ _id: element });
      });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async RejectMultiTask(req: Request, res: Response) {
    try {
      await TaskModel.updateMany({ _id: { $in: req.body.deleteIds } }, { isDelete: false });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AddDocument(req: Request, res: Response) {
    try {
      const document = {
        attachment: req.body.attachment,
        timestamps: new Date().getTime(),
        addedBy: req.user._id,
        title: req.body.title,
      };
      let notes = await TaskModel.findOneAndUpdate({ _id: req.body.taskId }, { $push: { documents: document } }, { new: true }).select('documents')

      return res.send({ success: true, data: notes })
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async RemoveDocument(req: Request, res: Response) {
    try {

      let notes = await TaskModel.findOneAndUpdate({ _id: req.body.taskId }, { $pull: { documents: { _id: ObjectId(req.body.documentId) } } }, { new: true }).select('documents')

      return res.send({ success: true, data: notes })
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }
}
