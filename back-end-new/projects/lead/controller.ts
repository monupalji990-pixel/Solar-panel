const moment = require("moment");
const async = require("async");
const path = require("path");
const _ = require("lodash");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

import LeadModel from "../../models/Lead";
import UserModel from "../../models/user";
import RoleModel from "../../models/role";
import QuoteModel from "../../models/Quotes";
import TaskModel from "../../models/Task";
import CompanyModel from "../../models/Company";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import ControllerUtils from "../../utils/ControllerUtils";
import { Request, Response } from "../../templates/commandInterface";
import QuoteStatus from "../quote/Modules/quoteStatus";
import HistoryModule from "../../sharedModules/smallModules/historyModule";
import RenewalModel from "../../models/Renewal";
import SoloarController from "../quote/solar"

var pdf = require('pdf-creator-node');
var fs = require('fs');
var html = fs.readFileSync(path.join(__dirname, `./../../installationInstruction.html`), 'utf8');

class CommonModule {
  async generatePdf(data: any) {

    let newData = {
      ...data,
      customerName: data?.customerName || 'N/A',
      customerAddress: data?.customerAddress || 'N/A',
      mobile: data?.mobile || 'N/A',
      postcode: data?.postcode || 'N/A',
      construct: data?.construct || 'N/A',
      floor: data?.floor || 'N/A',
      previous: data?.previous || 'N/A',
      property: data?.property || 'N/A',
      measures: data?.measures || 'N/A',
      trickleVents: data?.trickleVents || 'N/A',
      extFan1: data?.extFan1 || 'N/A',
      extFan2: data?.extFan2 || 'N/A',
      extFan3: data?.extFan3 || 'N/A',
      extFan4: data?.extFan4 || 'N/A',
      extFan5: data?.extFan5 || 'N/A',
      preEPC: data?.preEPC || 'N/A',
      postEPC: data?.postEPC || 'N/A',
      preEPCRating: data?.preEPCRating || 'N/A',
      postEPCRating: data?.postEPCRating || 'N/A',
      preNotes: data?.preNotes || 'N/A',
      postNotes: data?.postNotes || 'N/A',
      measuresArray: data?.measuresArray || 'N/A',
      CB_batchNumber: data?.CB_batchNumber || 'N/A',
      CB_glueQuantity: data?.CB_glueQuantity || 'N/A',
    }

    var document = {
      html: html,
      data: newData,
      path: "./installationInstruction.pdf"
    }
    var options = {
      format: "A4",
      orientation: "portrait",
      border: "10mm",
      "footer": {
        "height": "28mm",
        "contents": {
          default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>',
        }
      }
    }

    return await pdf.create(document, options)
  }
}

class AdminController {
  async getPdf(req: Request, res: Response) {
    const c = new CommonModule();
    try {
      const filePath = await c.generatePdf(req.body)
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

  async upload(req: Request, res: Response) {
    try {
      return res.send({ success: true, data: req.files })
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);

    }
  }
  async deleteLeadAdmin(req: Request, res: Response) {
    try {
      await UserModel.update({}, { $pull: { Lead: { $in: req.body.deleteIds } } }, { multi: true });
      await CompanyModel.update({}, { $pull: { Lead: { $in: req.body.deleteIds } } }, { multi: true });
      await LeadModel.deleteMany({ _id: { $in: req.body.deleteIds } });
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  };

  async deleteLeadRequestRejectAdmin(req: Request, res: Response) {
    try {
      await LeadModel.updateMany({ _id: { $in: req.body.deleteIds } }, { isDelete: 0 });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  };

  async deleteMultiLeadRegUser(req: Request, res: Response) {
    try {
      await req.body.deleteIds.forEach(async (element) => {
        await LeadModel.remove({ _id: element });
        await QuoteModel.remove({ Lead: element });
        await TaskModel.remove({ Lead: element });
      });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  };

  async rejectMultiLeadRegUser(req: Request, res: Response) {
    try {
      await LeadModel.updateMany({ _id: { $in: req.body.deleteIds } }, { isDelete: 0 });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }
}
// Redis caching removed for now (remove env/credential requirements).
// import { cachedTTL } from '../../middlewares/cacheResponse';
// import { logQueryTime } from '../../middlewares/logQueryTime';
// import { clearCacheByPrefix } from '../../utils/redisCache';

class RegUserController {
  async addLeadRegUser(req: Request, res: Response) {
    try {
      if (req.body.Consumer !== undefined && req.body.Consumer) {
        const LeadObject = req.body;
        const ci = await UserModel.findById(req.body.Consumer);
        LeadObject.leadId = `L${(ci.Lead !== undefined && ci.Lead ? ci.Lead.length : 0) + 1}-${ci.consumerId}`;
        if (req.user && ['Sales Rep'].includes(req.user.role.roleName)) {
          LeadObject.Assignee = req.user._id;
        }
        if (req.body.serviceType.includes('Eco')) {
          if (req.body.subServiceType) {
            LeadObject.serviceData = { eco: {} }
            req.body.subServiceType.forEach(e => {
              LeadObject.serviceData.eco[e] = null;
            });
          }
        }
        const newLead = new LeadModel(LeadObject);
        const lead = await newLead.save();
        await UserModel.updateOne({ _id: req.body.Consumer },
          {
            $push: {
              Lead: [lead._id],
            }
          }
        );

        const history = new HistoryModule();
        history.LeadHistory(lead._id, { Create: '' }, { Create: (req.body.notes || "Lead created") }, req);
        if (req.body.isFromAppoinment) {
          return { leadId: lead._id }
        }

      } else {
        const LeadObject = req.body;
        const CompanyInformation = await CompanyModel.findById(req.body.Company);
        if (req.body.Site !== undefined && req.body.Site) LeadObject.Site = req.body.Site;
        LeadObject.leadId = `L${CompanyInformation.Lead.length + 1}-${CompanyInformation.companyID}`;
        if (req.user && ['Sales Rep'].includes(req.user.role.roleName)) {
          LeadObject.Assignee = req.user._id;
        }
        const newLead = new LeadModel(LeadObject);
        const lead = await newLead.save();
        await CompanyModel.updateOne({ _id: req.body.Company },
          {
            $push: {
              Lead: [lead._id],
            }
          }
        );

        const history = new HistoryModule();
        history.LeadHistory(lead._id, { create: '' }, { create: (req.body.notes || "Lead created") }, req);
        if (req.body.isFromAppoinment) {
          return { leadId: lead._id }
        }
      }

      return res.send({ success: true });


    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async listLeadRegUser(req: Request, res: Response) {
    try {
      let filter: any = {};
      let filterBeforeLookup: any = {};
      let prepipeline = [];
      if (req.query.isActive) filter.isActive = true;
      if (req.query.isDelete) filter.isDelete = true;
      if (req.query.source) filter.source = req.query.source;
      if (req.query.blockedBy) filter.BlockedBy = req.user._id.toString();
      if (['Partner'].includes(req.user.role.roleName)) {

        const UserCompanyIDs = [];
        const company = await CompanyModel.find({ Assignee: { $in: req.user._id } });
        company.map((s) => { UserCompanyIDs.push(ObjectId(s._id)) });

        const ConsumerIds = [];
        const consumer = await UserModel.find({ Assignee: { $in: req.user._id } });
        consumer.map((s) => { ConsumerIds.push(ObjectId(s._id)) });

        filterBeforeLookup.$or = [
          { Company: { $in: UserCompanyIDs } },
          { Consumer: { $in: ConsumerIds } }
        ];
      }
      if (['Sales Rep', 'Observing Partner', 'Service Partner'].includes(req.user.role.roleName)) {
        // filterBeforeLookup.Assignee = { $in: [ObjectId(req.user._id)] };
        if (filterBeforeLookup.$or) {
          filterBeforeLookup.$or.concat([
            { Assignee: { $in: [ObjectId(req.user._id)] }, },
            { LeadGenerator: { $in: [ObjectId(req.user._id)] }, },
            { Installer: { $in: [ObjectId(req.user._id)] }, },
            { Surveyor: { $in: [ObjectId(req.user._id)] }, },
            { SystemDesigner: { $in: [ObjectId(req.user._id)] }, },
            { salesRep: { $in: [ObjectId(req.user._id)] }, },
            { dialer: { $in: [ObjectId(req.user._id)] }, },
          ]);

        } else {
          filterBeforeLookup.$or = [
            { Assignee: { $in: [ObjectId(req.user._id)] }, },
            { LeadGenerator: { $in: [ObjectId(req.user._id)] }, },
            { Installer: { $in: [ObjectId(req.user._id)] }, },
            { Surveyor: { $in: [ObjectId(req.user._id)] }, },
            { SystemDesigner: { $in: [ObjectId(req.user._id)] }, },
            { dialer: { $in: [ObjectId(req.user._id)] }, },
          ]

        }
      } else if (req.query.Assignee) {

        filterBeforeLookup.Assignee = ObjectId(req.query.Assignee);
      }
      else if (req.query?.isFromCompanyOrConsumerDrawer != 'true') {
        filterBeforeLookup.Assignee = { $exists: false }
      }
      if (req.query.isDelete) {
        filterBeforeLookup = {}
      }
      if (req.query.status && typeof req.query.status === 'string') filter.status = { $in: [req.query.status] };
      if (req.query.status && typeof req.query.status === 'object') filter.status = { $in: req.query.status };
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
      if (req.query.appoinmentBooker) {
        filterBeforeLookup.appoinmentBooker = ObjectId(req.query.apxpoinmentBooker)
      }
      if (req.query.leadType) {
        filterBeforeLookup.leadType = req.query.leadType
      }
      if (req.query.jobType) {
        filterBeforeLookup.jobType = req.query.jobType
      }
      if (req.query.LeadGenerator) {
        filterBeforeLookup.LeadGenerator = ObjectId(req.query.LeadGenerator)
      }
      if (req.query.leadAdministrator) {
        filterBeforeLookup.leadAdministrator = ObjectId(req.query.leadAdministrator)
      }
      if (req.query.Installer) {
        filterBeforeLookup.Installer = ObjectId(req.query.Installer)
      }
      if (req.query.Surveyor) {
        filterBeforeLookup.Surveyor = ObjectId(req.query.Surveyor)
      }
      if (req.query.SystemDesigner) {
        filterBeforeLookup.SystemDesigner = ObjectId(req.query.SystemDesigner)
      }
      if (req.query.dialer) {
        filterBeforeLookup.dialer = ObjectId(req.query.dialer)
      }
      if (req.query.InstallationCompleteStartDate && req.query.InstallationCompleteEndDate) {
        filterBeforeLookup.InstallationCompleteDate = {
          $gte: new Date(req.query.InstallationCompleteStartDate),
          $lte: new Date(req.query.InstallationCompleteEndDate)
        }
        // prepipeline.push({

        //     $addFields: {
        //       InstallationCompleteYear: { $year: '$InstallationCompleteDate' },
        //       InstallationCompleteMonth: { $month: '$InstallationCompleteDate' }
        //     }

        // })

        // prepipeline.push({
        //   $match: {
        //     $expr: {
        //       $and: [
        //         { $eq: ['$year', 2024] },  // Replace with the desired year
        //         { $eq: ['$month', 2] }      // Replace with the desired month
        //       ]
        //     }
        //   }
        // });
      }

      if (req.query.SubmissionCompletedStartDate && req.query.SubmissionCompletedEndDate) {
        filterBeforeLookup.SubmissionCompletedDate = {
          $gte: new Date(req.query.SubmissionCompletedStartDate),
          $lte: new Date(req.query.SubmissionCompletedEndDate)
        }
        // prepipeline.push({
        //     $addFields: {
        //       SubmissionCompletedYear: { $year: '$SubmissionCompletedDate' },
        //       SubmissionCompletedMonth: { $month: '$SubmissionCompletedDate' }
        //     }
        // })
      }


      if (req.query.DataOf && typeof req.query.DataOf === 'string') filterBeforeLookup[req.query.DataOf] = { $exists: true };
      if (req.query.DataOf && typeof req.query.DataOf === 'object') {
        filterBeforeLookup.$or = [];
        req.query.DataOf.filter(v => {
          let d: any = {};
          d[v] = { $exists: true };
          filterBeforeLookup.$or.push(d)
        })
      }
      if (req.query.blockedBy) filter.BlockedBy = req.user._id.toString();
      if (req.query.isDelete) {

      } else {

        filterBeforeLookup.isDelete = { $in: [false, 0] };
      }
      if (req.query.serviceData) {
        if (typeof req.query.serviceData == 'string') {
          filterBeforeLookup[`serviceData.${req.query.serviceData}`] = { $exists: true, $ne: null }
          filterBeforeLookup['serviceType'] = { $in: [new RegExp(`${req.query.serviceData}`, 'i')] }
        }
        else if (typeof req.query.serviceData == 'object') {
          let serviceArr = [];
          req.query.serviceData.forEach(service => {
            filterBeforeLookup[`serviceData.${service}`] = { $exists: true, $ne: null }
            serviceArr.push(new RegExp(`${service}`, 'i'))
          });
          filterBeforeLookup['serviceType'] = { $in: serviceArr }

        }
      }
      if (req.query.subservice) {
        if (typeof req.query.subservice == 'string') {
          filterBeforeLookup[`serviceData.${req.query.serviceData}.subservice.${req.query.subservice}`] = { $exists: true, $ne: null }
          // filterBeforeLookup['serviceType'] = { $in: [new RegExp(`${req.query.serviceData}`, 'i')] }
        }
        else if (typeof req.query.subservice == 'object') {
          let serviceArr = [];
          req.query.subservice.forEach(service => {
            filterBeforeLookup[`serviceData.${req.query.serviceData}.${service}`] = { $exists: true, $ne: null }
            serviceArr.push(new RegExp(`${service}`, 'i'))
          });
          // filterBeforeLookup['serviceType'] = { $in: serviceArr }

        }
      }
      if (req.query.Search) {
        filter.$or = [
          { leadId: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          { "Company.businessName": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          { "Company.postcode": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          { "Company.businessSector": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          { "Consumer.firstName": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        ];
      }


      if (req.query.installerType) {
        if (Array.isArray(req.query.installerType)) {
          filter.installerType = { $in: req.query.installerType }
        } else {
          filter.installerType = { $in: [req.query.installerType] }

        }
      }

      if (req.query.isPaid) {
        if (req.query.isPaid === 'true') {
          filter["digitalDashboard.isPaidLeadGeneratorCost"] = true
        } else if (req.query.isPaid === 'false') {
          filter["digitalDashboard.isPaidLeadGeneratorCost"] = false
        }
      }

      commonUtils.dateFilter(req, filter, {});

      let sortObj: any = { updatedAt: 1 };
      if (req.query.sort) {
        sortObj = { [req.query.sort]: req.query.sortType === 'asc' ? 1 : -1 };
      }
      let skipNumber = 0;
      let limitNumber = 99;
      if (req.query.skip) skipNumber = Number(req.query.skip);
      if (req.query.limit) limitNumber = Math.min(Number(req.query.limit), 100); // cap page size
      // Ensure filtering runs before sorting to allow index use
      const leads = LeadModel.aggregate([
        { $match: filterBeforeLookup },
        { $match: filter },
        { $sort: sortObj },
        // apply pagination before lookups to reduce documents processed by joins
        { $skip: skipNumber },
        { $limit: limitNumber },
        // perform lookups only for the paginated subset
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
          $lookup: {
            from: 'sites',
            localField: 'Site',
            foreignField: '_id',
            as: 'Site'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'Contact',
            foreignField: '_id',
            as: 'Contact'
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
            "path": "$Site",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          $unwind: {
            "path": "$Contact",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          $unwind: {
            "path": "$Assignee",
            "preserveNullAndEmptyArrays": true
          }
        },
        {
          $project: {
            source: 1,
            leadId: 1,
            serviceType: 1,
            subServiceType: 1,
            status: 1,
            createdAt: 1,
            "Assignee.name": 1,
            "Scaffolders": 1,
            "Roofers": 1,
            "Electricians": 1,
            "GasEngineers": 1,
            "CavityWallInstaller": 1,
            "UnderFloorInstaller": 1,
            "LoftInstaller": 1,
            "VentilationInstaller": 1,
            "InternalWallInsulation": 1,
            "ExternalWallInsulation": 1,
            "RoomInRoofInstaller": 1,
            "ASHInstaller": 1,
            "Company._id": 1,
            "Company.businessName": 1,
            "Company.firstLine": 1,
            "Company.secondLine": 1,
            "Consumer.addressOne": 1,
            "Consumer.addressTwo": 1,
            "Consumer._id": 1,
            "Consumer.firstName": 1,
            "Consumer.surName": 1,
            "Consumer.city": 1,
            "Company.postcode": 1,
            "Company.businessSector": 1,
            "Contact._id": 1,
            "Contact.name": 1,
            "Site._id": 1,
            "Site.siteName": 1,
            "digitalDashboard.isPaidLeadGeneratorCost": 1,
            "digitalDashboard.leadGeneratorCost": 1
          }
        },
      ]);
      const data = await leads.exec();
      res.send({ data, count: 0, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async digitalDashboardStats(req: Request, res: Response) {
    try {
      let filter: any = {}
      if (req.query.LeadGenerator) {
        filter.LeadGenerator = ObjectId(req.query.LeadGenerator)
      }
      let pipeline = []

      pipeline.push({
        $match: {
          ...filter,
          'digitalDashboard.isPaidLeadGeneratorCost': { $exists: true },
          "digitalDashboard.leadGeneratorCost": { $exists: true }
        }
      })

      pipeline.push({
        $group: {
          _id: '$digitalDashboard.isPaidLeadGeneratorCost',
          cost: {
            $sum: '$digitalDashboard.leadGeneratorCost'
          },
          count: { $sum: 1 }
        }
      })



      let data = await LeadModel.aggregate(pipeline)

      res.send({ success: true, data: data })
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);

    }
  }

  async leadCount(req: Request, res: Response) {
    try {
      let filter: any = {};
      let filterBeforeLookup: any = {};

      // Index suggestions (add to MongoDB):
      // - Lead: { status: 1 }
      // - Lead: { createdAt: 1 }
      // - Lead: { Assignee: 1 }
      // - Lead: { LeadGenerator: 1 }
      // - Lead: { Installer: 1 }
      // - Lead: { Surveyor: 1 }
      // - Lead: { SystemDesigner: 1 }
      // - Lead: { dialer: 1 }
      // - Lead: { isActive: 1, isDelete: 1 }
      // - Lead: { InstallationCompleteDate: 1 }
      // - Lead: { SubmissionCompletedDate: 1 }
      // - Lead: { 'digitalDashboard.isPaidLeadGeneratorCost': 1 }

      if (req.query.isActive) filter.isActive = 1;
      if (req.query.isDelete) filter.isDelete = 1;
      if (req.query.source) filter.source = req.query.source;
      if (req.query.blockedBy) filter.BlockedBy = req.user._id.toString();

      if (['Partner'].includes(req.user.role.roleName)) {
        const UserCompanyIDs: any[] = [];
        const company = await CompanyModel.find({ Assignee: { $in: req.user._id } });
        company.map((s) => { UserCompanyIDs.push(ObjectId(s._id)); });

        const ConsumerIds: any[] = [];
        const consumer = await UserModel.find({ Assignee: { $in: req.user._id } });
        consumer.map((s) => { ConsumerIds.push(ObjectId(s._id)); });

        filterBeforeLookup.$or = [
          { Company: { $in: UserCompanyIDs } },
          { Consumer: { $in: ConsumerIds } }
        ];
      }

      if (['Sales Rep', 'Observing Partner', 'Service Partner'].includes(req.user.role.roleName)) {
        filterBeforeLookup.Assignee = { $in: [ObjectId(req.user._id)] };
      } else if (req.query.Assignee) {
        filterBeforeLookup.Assignee = ObjectId(req.query.Assignee);
      } else if (req.query?.isFromCompanyOrConsumerDrawer && req.query?.isFromCompanyOrConsumerDrawer != 'true') {
        filterBeforeLookup.Assignee = { $exists: false };
      }

      if (req.query.status && typeof req.query.status === 'string') filter.status = { $in: [req.query.status] };
      if (req.query.status && typeof req.query.status === 'object') filter.status = { $in: req.query.status };

      if (req.query.Company && typeof req.query.Company === 'string') filterBeforeLookup.Company = ObjectId(req.query.Company);
      if (req.query.Company && typeof req.query.Company === 'object') {
        let ca: any[] = [];
        req.query.Company.filter((c: any) => { ca.push(ObjectId(c)); });
        filterBeforeLookup.Company = { $in: ca };
      }

      if (req.query.Consumer && typeof req.query.Consumer === 'string') filterBeforeLookup.Consumer = ObjectId(req.query.Consumer);
      if (req.query.Consumer && typeof req.query.Consumer === 'object') {
        let ca: any[] = [];
        req.query.Consumer.filter((c: any) => { ca.push(ObjectId(c)); });
        filterBeforeLookup.Consumer = { $in: ca };
      }

      if (req.query.Search) {
        // NOTE: This search is across Company/Consumer fields, which originally required $lookup.
        // For performance, keep count-only local filters. If you rely on Company.businessName/Search,
        // you must either keep lookups or denormalize those fields onto Lead.
        // We still support leadId regex (cheap + indexable with regex prefix strategies).
        filter.$or = [
          { leadId: { $regex: `.*${req.query.Search}.*`, $options: 'i' } },
        ];
      }

      if (!req.query.isDelete) {
        filterBeforeLookup.isDelete = { $in: [false, 0] };
      }

      if (req.query.InstallationCompleteStartDate && req.query.InstallationCompleteEndDate) {
        filterBeforeLookup.InstallationCompleteDate = {
          $gte: new Date(req.query.InstallationCompleteStartDate),
          $lte: new Date(req.query.InstallationCompleteEndDate)
        }
      }

      if (req.query.SubmissionCompletedStartDate && req.query.SubmissionCompletedEndDate) {
        filterBeforeLookup.SubmissionCompletedDate = {
          $gte: new Date(req.query.SubmissionCompletedStartDate),
          $lte: new Date(req.query.SubmissionCompletedEndDate)
        }
      }

      if (req.query.serviceData) {
        if (typeof req.query.serviceData == 'string') {
          filterBeforeLookup[`serviceData.${req.query.serviceData}`] = { $exists: true, $ne: null }
          filterBeforeLookup['serviceType'] = { $in: [new RegExp(`${req.query.serviceData}`, 'i')] }
        } else if (typeof req.query.serviceData == 'object') {
          let serviceArr: RegExp[] = [];
          req.query.serviceData.forEach((service: string) => {
            filterBeforeLookup[`serviceData.${service}`] = { $exists: true, $ne: null }
            serviceArr.push(new RegExp(`${service}`, 'i'))
          });
          filterBeforeLookup['serviceType'] = { $in: serviceArr }
        }
      }

      if (req.query.subservice) {
        if (typeof req.query.subservice == 'string') {
          filterBeforeLookup[`serviceData.${req.query.serviceData}.${req.query.subservice}`] = { $exists: true, $ne: null }
        } else if (typeof req.query.subservice == 'object') {
          req.query.subservice.forEach((service: string) => {
            filterBeforeLookup[`serviceData.${req.query.serviceData}.${service}`] = { $exists: true, $ne: null }
          });
        }
      }

      if (req.query.dateTo && req.query.dateFrom) {
        filter.createdAt = {
          $lte: new Date(req.query.dateTo),
          $gte: new Date(req.query.dateFrom)
        };
      }
      if (req.query.dateTo) {
        filter.createdAt = { $lte: new Date(req.query.dateTo) };
      }
      if (req.query.dateFrom) {
        filter.createdAt = { $gte: new Date(req.query.dateFrom) };
      }

      if (req.query.isPaid) {
        if (req.query.isPaid === 'true') {
          filter["digitalDashboard.isPaidLeadGeneratorCost"] = true
        } else if (req.query.isPaid === 'false') {
          filter["digitalDashboard.isPaidLeadGeneratorCost"] = false
        }
      }

      // Optimized COUNT: $match FIRST, no $lookup.
      // This massively reduces CPU/IO cost for /leadCount.
      const count = await LeadModel.aggregate([
        { $match: filterBeforeLookup },
        { $match: filter },
        { $count: "count" }
      ]);

      let countData = 0;
      if (count.length > 0) countData = count[0].count;

      res.send({ count: countData, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async LeadDropdownList(req: Request, res: Response) {
    try {

      try {
        let filter: any = {};
        let filterBeforeLookup: any = {};
        if (req.query.isActive) filter.isActive = 1;
        if (['Partner'].includes(req.user.role.roleName)) {
          const UserCompanyIDs = [];
          const company = await CompanyModel.find({ Assignee: { $in: req.user._id } });
          company.map((s) => { UserCompanyIDs.push(ObjectId(s._id)) });

          const ConsumerIds = [];
          const consumer = await UserModel.find({ Assignee: { $in: req.user._id } });
          consumer.map((s) => { ConsumerIds.push(ObjectId(s._id)) });

          filterBeforeLookup.$or = [
            { Company: { $in: UserCompanyIDs } },
            { Consumer: { $in: ConsumerIds } }
          ];
        }
        if (['Sales Rep', 'Observing Partner'].includes(req.user.role.roleName)) {
          filterBeforeLookup.Assignee = { $in: [ObjectId(req.user._id)] };
        }
        if (req.query.Company && typeof req.query.Company === 'string') filterBeforeLookup.Company = ObjectId(req.query.Company);
        if (req.query.Company && typeof req.query.Company === 'object') {
          let ca = [];
          req.query.Company.filter(c => { ca.push(ObjectId(c)) })
          filterBeforeLookup.Company = { $in: ca };
        };
        filterBeforeLookup.isDelete = { $in: [false, 0] };


        if (req.query.Consumer && typeof req.query.Consumer === 'string') filterBeforeLookup.Consumer = ObjectId(req.query.Consumer);
        if (req.query.Consumer && typeof req.query.Consumer === 'object') {
          let ca = [];
          req.query.Consumer.filter(c => { ca.push(ObjectId(c)) })
          filterBeforeLookup.Consumer = { $in: ca };
        };

        if (req.query.Search) {
          filter.$or = [
            { leadId: { $regex: `.*${req.query.Search}.*`, $options: "i" } }
          ];
        }

        let sortObj: any = { updatedAt: 1 };
        if (req.query.sort) {
          sortObj = { [req.query.sort]: req.query.sortType === 'asc' ? 1 : -1 };
        }

        let skip = isNaN(Number(req.query.skip)) ? 0 : Number(req.query.skip);
        let limit = Math.min(Number(req.query.limit) || 50, 100);

        // Filter first, then sort, paginate, and lookup only for the page
        const leads = await LeadModel.aggregate([
          { $match: filterBeforeLookup },
          { $match: filter },
          { $sort: sortObj },
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: 'sites',
              localField: 'Site',
              foreignField: '_id',
              as: 'Site'
            }
          },
          {
            $project: {
              leadId: 1,
              status: 1,
              "Company": 1,
              "Consumer": 1,
              "Contact": 1,
              "Site._id": 1,
              "Site.siteName": 1,
              "Site.postcode": 1
            }
          },
        ]);

        res.send({ data: leads, success: true });
      } catch (err) {
        commonUtils.sendErrorResponse(req, res, err);
      }
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async singleViewLead(req: Request, res: Response) {
    try {
      const result = await LeadModel.findById(req.params.id)
        .populate("Site", "siteName postcode")
        .select("leadId Company Contact Consumer")
      res.send({ success: true, data: result });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async updateLeadRegUser(req: Request, res: Response) {
    try {
      let update: any = {};
      if (req.body.serviceType) update.serviceType = req.body.serviceType;
      if (req.body.subServiceType) update.subServiceType = req.body.subServiceType;

      if (req.body.status) update.status = req.body.status;
      if (req.body.isDelete !== undefined) update.isDelete = req.body.isDelete;
      if (req.body.Assignee) update.Assignee = req.body.Assignee;
      if (req.body.Company) {
        update.Company = req.body.Company;
        update.Site = null;
      }
      if (req.body.jobType) {
        update.jobType = req.body.jobType
      }
      if (req.body.source) {
        update.source = req.body.source
      }
      if (req.body.appoinmentBooker) {
        update.appoinmentBooker = req.body.appoinmentBooker
      }
      if (req.body.LeadGenerator) {
        update.LeadGenerator = req.body.LeadGenerator
      }
      if (req.body.leadAdministrator) {
        update.leadAdministrator = req.body.leadAdministrator
      }
      if (req.body.Installer) {
        update.Installer = req.body.Installer
      }
      if (req.body.Surveyor) {
        update.Surveyor = req.body.Surveyor
      }
      if (req.body.SystemDesigner) {
        update.SystemDesigner = req.body.SystemDesigner
      }
      if (req.body.Site) {
        update.Site = req.body.Site;
      }
      if (req.body.gallery) {
        update.gallery = req.body.gallery
      }
      if (req.body.Scaffolders) {
        update.Scaffolders = req.body.Scaffolders
      }
      if (req.body.Roofers) {
        update.Roofers = req.body.Roofers
      }

      if (req.body.Electricians) {
        update.Electricians = req.body.Electricians
      }
      if (req.body.GasEngineers) {
        update.GasEngineers = req.body.GasEngineers
      }
      if (req.body.CavityWallInstaller) {
        update.CavityWallInstaller = req.body.CavityWallInstaller

      }
      if (req.body.UnderFloorInstaller) {
        update.UnderFloorInstaller = req.body.UnderFloorInstaller

      }
      if (req.body.LoftInstaller) {
        update.LoftInstaller = req.body.LoftInstaller

      }
      if (req.body.VentilationInstaller) {
        update.VentilationInstaller = req.body.VentilationInstaller

      }
      if (req.body.InternalWallInsulation) {
        update.InternalWallInsulation = req.body.InternalWallInsulation

      }
      if (req.body.ExternalWallInsulation) {
        update.ExternalWallInsulation = req.body.ExternalWallInsulation

      }
      if (req.body.RoomInRoofInstaller) {
        update.RoomInRoofInstaller = req.body.RoomInRoofInstaller

      }
      if (req.body.ASHPInstaller) {
        update.ASHPInstaller = req.body.ASHPInstaller
      }
      if (req.body.salesRep) {
        update.salesRep = req.body.salesRep
      }
      if (req.body.digitalDashboard) {
        update.digitalDashboard = req.body.digitalDashboard
      }
      if (req.body.dialer) {
        update.dialer = req.body.dialer
      }
      if (req.body.status === "DND") {
        update.isDelete = true
      } else if (req.body.status !== "DND") {
        update.isDelete = false
      }
      const previousObject = await LeadModel.findById(req.body.leadId);
      if (req.body.status === "Installation Complete") {
        update.InstallationCompleteDate = new Date();
      }
      if (req.body.status === "Submission Completed") {
        update.SubmissionCompletedDate = new Date();
      }
      await LeadModel.updateOne({ _id: req.body.leadId }, update);
      let isLeadDeleted = false;
      if (previousObject.Company) {  //if lead for company
        if (update?.status === 'Dead Lead' || update?.status === 'Not Interested') {
          //lead is deleted
          if (req.user.role.roleName === 'Admin') {
            isLeadDeleted = true;
            await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          } else {
            await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          }
        }
        else if (update?.status === 'DND') {
          // lead and company is delete
          let quoteCount = await QuoteModel.countDocuments({ Company: previousObject.Company });
          let renewalCount = await RenewalModel.countDocuments({ Company: previousObject.Company });
          let leadCount = await LeadModel.countDocuments({ Company: previousObject.Company });
          let total = quoteCount + renewalCount + leadCount;
          // if (req.user.role.roleName === 'Admin') {
          isLeadDeleted = true;
          if (quoteCount + renewalCount === 0) {  //no renewals and quotes then delete all data
            await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
            await CompanyModel.updateOne({ _id: previousObject.Company }, { isDelete: true });
            await TaskModel.updateOne({ Company: previousObject.Company }, { isDelete: true });

          } else {
            await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          }
          // }
          //  else {
          //   // delete lead
          //   if (quoteCount + renewalCount === 0) {
          //     await CompanyModel.findByIdAndUpdate(previousObject.Company, { isDelete: true });
          //     await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          //   }
          //   else
          //     await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          // }
        }
      }

      if (previousObject.Consumer) {  //if lead for consumer
        if (update?.status === 'Dead Lead' || update?.status === 'Not Interested') {
          //lead is deleted
          if (req.user.role.roleName === 'Admin') {
            isLeadDeleted = true;
            await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          } else {
            await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          }
        }
        else if (update?.status === 'DND') {
          // lead and company is delete
          let quoteCount = await QuoteModel.countDocuments({ Consumer: previousObject.Consumer });
          let renewalCount = await RenewalModel.countDocuments({ Consumer: previousObject.Consumer });
          let leadCount = await LeadModel.countDocuments({ Consumer: previousObject.Consumer });
          let taskCount = await TaskModel.countDocuments({ Consumer: previousObject.Consumer });

          let total = quoteCount + renewalCount + leadCount;
          // if (req.user.role.roleName === 'Admin') {
          isLeadDeleted = true;
          if (quoteCount + renewalCount === 0) {  //no renewals and quotes then delete all data
            await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
            await UserModel.updateOne({ _id: previousObject.Consumer }, { isDelete: true });
            await TaskModel.updateOne({ Consumer: previousObject.Consumer }, { isDelete: true });
          } else {
            await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          }
          // } 
          // else {
          //   // delete lead
          //   if (quoteCount + renewalCount === 0) {
          //     await UserModel.findByIdAndUpdate(previousObject.Consumer, { isDelete: true });
          //     await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          //   }
          //   else
          //     await LeadModel.updateOne({ _id: req.body.leadId }, { isDelete: true });
          // }
        }
      }
      const history = new HistoryModule();
      history.LeadHistory(req.body.leadId, previousObject, update, req);
      if (!isLeadDeleted) {
        const rc = new RegUserController();
        rc.showLeadRegUser(req, res);
      } else {
        res.send({ success: true, message: 'Lead Deleted successfully.' })
      }
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async assigneeSalesRep(req: Request, res: Response) {
    try {
      const update: any = {};
      if (req.body.status) {
        update.status = req.body.status
      } else {
        update.status = "New Lead";
      }
      if (req.body.assignee) update.Assignee = req.body.assignee;

      // Bulk update leads
      const leadIds = Array.isArray(req.body.leadIds) ? req.body.leadIds : [];
      await LeadModel.updateMany({ _id: { $in: leadIds } }, update);

      // Bulk-fatch related Company and Consumer ids to avoid N+1
      const leads = await LeadModel.find({ _id: { $in: leadIds } }).select('Company Consumer').lean();
      const companyIds = [...new Set(leads.filter(l => l.Company).map(l => String(l.Company)))];
      const consumerIds = [...new Set(leads.filter(l => l.Consumer).map(l => String(l.Consumer)))];

      // Update companies' Assignee lists in parallel
      if (companyIds.length > 0) {
        const companies = await CompanyModel.find({ _id: { $in: companyIds } }).select('Assignee').lean();
        await Promise.all(companies.map(c => {
          const existing = Array.isArray(c.Assignee) ? c.Assignee.map(String) : [];
          const union = [...new Set([...existing, String(req.body.assignee)])];
          return CompanyModel.updateOne({ _id: c._id }, { Assignee: union });
        }));
      }

      // Update consumers' Assignee lists in parallel
      if (consumerIds.length > 0) {
        const consumers = await UserModel.find({ _id: { $in: consumerIds } }).select('Assignee').lean();
        await Promise.all(consumers.map(u => {
          const existing = Array.isArray(u.Assignee) ? u.Assignee.map(String) : [];
          const union = [...new Set([...existing, String(req.body.assignee)])];
          return UserModel.updateOne({ _id: u._id }, { Assignee: union });
        }));
      }
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async showLeadRegUser(req: Request, res: Response) {
    try {
      let id = ''
      if (req.body.leadId) id = req.body.leadId
      else if (req.body.id) id = req.body.id
      else id = req.params.id

      const result = await LeadModel.findById(id)
        .populate("Site Contact Assignee history.editedBy notesComment.addedBy", "businessName siteName siteAddress postcode mobile DOB homeAddress jobTitle email name avatar gas electric water chipandpin")
        .populate({
          path: "Company",
          select: "businessName postcode firstLine secondLine businessType address lat lon",
          populate: {
            path: "Assignee",
            select: "name"
          }
        })
        .populate({
          path: "Consumer",
          select: "consumerId title firstName surName postcode DOB telephoneNumber mobile email addressOne addressTwo city address lat lon",
          populate: {
            path: "Assignee",
            select: "name"
          }
        })
        .populate({
          path: "appoinmentBooker",
          select: "firstName name"
        })
        .populate({
          path: "LeadGenerator",
          select: "firstName name"
        }).populate({
          path: "leadAdministrator",
          select: "firstName name"
        }).populate({
          path: "Installer",
          select: "firstName name"
        }).populate({
          path: "Surveyor",
          select: "firstName name"
        }).populate({
          path: "SystemDesigner",
          select: "firstName name"
        }).populate({
          path: "Scaffolders",
          select: "firstName name"
        }).populate({
          path: "Roofers",
          select: "firstName name"
        }).populate({
          path: "Electricians",
          select: "firstName name"
        }).populate({
          path: "GasEngineers",
          select: "firstName name"
        }).populate({
          path: "CavityWallInstaller",
          select: "firstName name"
        }).populate({
          path: "UnderFloorInstaller",
          select: "firstName name"
        }).populate({
          path: "LoftInstaller",
          select: "firstName name"
        }).populate({
          path: "VentilationInstaller",
          select: "firstName name"
        }).populate({
          path: "InternalWallInsulation",
          select: "firstName name"
        }).populate({
          path: "ExternalWallInsulation",
          select: "firstName name"
        }).populate({
          path: "RoomInRoofInstaller",
          select: "firstName name"
        }).populate({
          path: "ASHPInstaller",
          select: "firstName name"
        }).populate({
          path: "salesRep",
          select: "firstName name"
        }).populate({
          path: "dialer",
          select: "firstName name"
        })
        .lean();
      if (result.Company && result.Company._id)
        result.companyContacts = await UserModel.find({ companyId: result.Company._id }).select('email phone mobile name').limit(2).lean();
      res.send({ success: true, lead: result });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async sourceStats(req: Request, res: Response) {
    try {
      // OPTIMIZED: Use aggregation instead of distinct + multiple countDocuments queries
      let statsResult = await LeadModel.aggregate([
        { $match: { source: { $ne: null } } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      let response = {};
      statsResult.forEach(item => {
        if (item._id !== null)
          response[item._id] = item.count;
      })

      return res.send({ success: true, data: response })

    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);

    }
  }

  async deleteRequestLeadRegUser(req: Request, res: Response) {
    try {
      const leadData = await LeadModel.findByIdAndUpdate(req.body.id, { isDelete: 1 });
      if (leadData.Company)
        await CompanyModel.findByIdAndUpdate(leadData.Company, { isDelete: 1 });
      if (leadData.Consumer)
        await UserModel.findByIdAndUpdate(leadData.Consumer, { isDelete: 1 });

      const previousObject = await LeadModel.findById(req.body.id);
      const history = new HistoryModule();
      history.LeadHistory(req.body.id, previousObject, { isDelete: 1 }, req);
      const rc = new RegUserController();
      rc.showLeadRegUser(req, res);
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

      await LeadModel.updateOne({ _id: req.body.id }, { $push: { notesComment: [comment] } });

      const history = new HistoryModule();
      history.LeadHistory(req.body.id, { Comment: '' }, { Comment: 'Comment added' }, req);

      const rc = new RegUserController();
      rc.showLeadRegUser(req, res);
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async soldService(req: Request, res: Response) {
    try {
      const { body } = req;
      const lead = await LeadModel.findById(body.id);
      let quoteData: any = {
        service: {}
      };
      quoteData.createdBy = req.user._id;
      quoteData.serviceType = body.serviceType;
      // if(body.subServiceType)
      // quoteData.subServiceType = body.subServiceType  
      quoteData.isActive = 1;
      quoteData.quoteStatus = QuoteStatus.quoteStatus.newQuote;
      quoteData.Lead = body.id;
      const defaultServiceData = {};
      if (body.serviceType === 'ChipAndPin') {
        quoteData.service.chipAndPin = req.body.serviceData.chipAndPin;

      } else {
        quoteData.service[body.serviceType.toLowerCase()] = req.body.serviceData[body.serviceType.toLowerCase()];

      }
      if (body.soldSubServiceTypeArray) {
        quoteData.subServiceType = body.soldSubServiceTypeArray;
      }

      if (lead.Consumer !== undefined && lead.Consumer) {
        const ConsumerInfo = await UserModel.findOne({ _id: lead.Consumer });
        let count = await QuoteModel.countDocuments({ Consumer: lead.Consumer });
        quoteData.QuoteID = `Q${(Number(count) + 1)}-${ConsumerInfo.consumerId}`;
        quoteData.Consumer = ConsumerInfo._id;
      } else {
        const CompanyInfo = await CompanyModel.findOne({ _id: lead.Company });
        let count = await QuoteModel.countDocuments({ Company: lead.Company });
        quoteData.QuoteID = `Q${(Number(count) + 1)}-${CompanyInfo.companyID}`;
        quoteData.Company = CompanyInfo._id;
        quoteData.Site = lead.Site;
      }

      if (["Management", "Partner", "Sales Rep"].includes(req.user.role.roleName)) {
        quoteData.Assignee = req.user._id;
      }
      if (['Service Partner'].includes(req.user.role.roleName)) {
        quoteData.isCreatedByServicePartner = true;
      }
      quoteData.Invoiced = "";
      if (body?.Supplier) {

        quoteData.Supplier = body.Supplier;
      }
      quoteData.User = body.User;
      quoteData.uplift = body.serviceData && body.serviceType && body.serviceData[body.serviceType === "ChipAndPin" ? "chipAndPin" : body.serviceType.toLowerCase()].uplift || 0.5;

      if (lead.digitalDashboard) {
        quoteData.digitalDashboard = lead.digitalDashboard
      }
      const newQuote = new QuoteModel(quoteData);
      await newQuote.save();

      // create open solar project
      if (["PaidSolar"].includes(quoteData.serviceType) || (quoteData.serviceType === 'Eco' && quoteData.subServiceType.includes('Solar'))) {
        // calling open solar create project
        let coOrdinates: any = {}
        if (req.body.lat) {
          coOrdinates.lat = req.body.lat
        }
        if (req.body.lon) {
          coOrdinates.lon = req.body.lon

        }
        console.log("coOrdinates ====", coOrdinates);

        SoloarController.createProject(newQuote, lead, coOrdinates)
      }

      let obj: any = {};
      if (body.serviceTypeArray) {
        obj.serviceType = body.serviceTypeArray;
      }
      if (body.subServiceTypeArray) {
        obj.subServiceType = body.subServiceTypeArray;
      }
      await LeadModel.updateOne({ _id: req.body.id }, { ...obj, status: 'Existing Client Lead' });

      const history = new HistoryModule();
      history.LeadHistory(req.body.id, { soldService: '' }, { soldService: body.serviceType }, req);
      history.QuoteHistory(newQuote._id, { Create: '' }, { Create: `Quote created` }, req);

      const rc = new RegUserController();
      rc.showLeadRegUser(req, res);
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async saveLeadServiceData(req: Request, res: Response) {
    try {
      let key = `serviceData.${req.body.service}`;
      const lead = await LeadModel.findOne({ _id: req.body.id });
      lead.serviceData[req.body.service] = req.body.serviceData[req.body.service];
      await lead.save();
      res.send({ success: true, message: "Service data saved successfully" });
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: error.message });
    }
  }
}
export default class LeadController extends ControllerUtils {
  admin: AdminController;
  regUser: RegUserController;
  constructor() {
    super();
    this.admin = new AdminController();
    this.regUser = new RegUserController();
  }
}