let async = require("async");
let moment = require("moment");
let path = require("path");
let _ = require("lodash");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

import RenewalModel from "../../models/Renewal";
import CompanyModel from "../../models/Company";
import UserModel from "../../models/user";
import SupplierModel from "../../models/Supplier";
import TaskModel from "../../models/Task";
import QuoteStatus from "../quote/Modules/quoteStatus";
import ControllerUtils from "../../utils/ControllerUtils";
import { Request, Response } from "../../templates/commandInterface";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import HistoryModule from "../../sharedModules/smallModules/historyModule";
import QuoteController from "../quote/controller"
const quoteObj = new QuoteController();

class AdminController { }
class ManagementController { }
class PartnerController { }
class SalesRepController { }
class ObservingPartnerController { }
class RegUserController {

  async softDeleteRenewalsForClosedCompanies(req:Request,res:Response){
    try {
      let count = await CompanyModel.countDocuments({isCompanyClose:true})
      console.log(count)
      let rencount = 0;
      let companies = await CompanyModel.find({isCompanyClose:true}).select('businessName').lean()
      console.log(companies);
      for(let i=0;i<companies.length;i++){
        let renewals = await RenewalModel.updateMany({Company:companies[i]._id},{isDelete:true})
        companies[i].renewals = renewals;
        rencount += renewals.length;
      }
      console.log(rencount)
      return res.send({success:true,count,companies})
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
      
    }
  }

  async listRenewalForRegUser(req: Request, res: Response) {
    let filter: any = {};
    let filterBeforeLookup: any = {};
    if (req.query.Search) { 
      filter.$or = [
        { RenewalID: { $regex: new RegExp(["(.*)", req.query.Search, "(.*)"].join(""), "gmi") } },
        { 'Company.businessName': { $regex: new RegExp(["(.*)", req.query.Search, "(.*)"].join(""), "gmi") } },
        { 'Consumer.firstName': { $regex: new RegExp(["(.*)", req.query.Search, "(.*)"].join(""), "gmi") } }
      ];
    }
    if (req.query.isActive) filter.isActive = 1;
    if (req.query.isDelete) filter.isDelete = true;
    else  filter.isDelete={$in:[false,0]};

    if (req.query.blockedBy) filter.BlockedBy = req.user._id.toString();

    if (req.query.DataOf && typeof req.query.DataOf === 'string') filterBeforeLookup[req.query.DataOf] = { $exists: true };
    if (req.query.DataOf && typeof req.query.DataOf === 'object') {
      filterBeforeLookup.$or = [];
      req.query.DataOf.filter(v => {
        let d: any = {};
        d[v] = { $exists: true };
        filterBeforeLookup.$or.push(d)
      })
    }

    if (req.query.Partner && typeof req.query.Partner === 'string') filterBeforeLookup.Assignee = { $in: [req.query.Partner] };
    if (req.query.Partner && typeof req.query.Partner === 'object') filterBeforeLookup.Assignee = { $in: req.query.Partner }; 
    if (req.query.Assignee) filter.Assignee = ObjectId(req.query.Assignee);
    if (req.query.Company && typeof req.query.Company === 'string') filterBeforeLookup.Company = { $in: [ObjectId(req.query.Company)] }
    if (req.query.Company && typeof req.query.Company === 'object') filterBeforeLookup.Company = { $in: req.query.Company };
    if (req.query.Consumer && typeof req.query.Consumer === 'string') filterBeforeLookup.Consumer = { $in: [req.query.Consumer] }
    if (req.query.Consumer && typeof req.query.Consumer === 'object') filterBeforeLookup.Consumer = { $in: req.query.Consumer };
    if (req.query.quoteService && typeof req.query.quoteService === 'string') filter.serviceType = { $in: [req.query.quoteService] };
    if (req.query.quoteService && typeof req.query.quoteService === 'object') filter.serviceType = { $in: req.query.quoteService };
    if (req.query.quoteStatus && typeof req.query.quoteStatus === 'string') filter.Status = { $in: [req.query.quoteStatus] };
    if (req.query.quoteStatus && typeof req.query.quoteStatus === 'object') filter.Status = { $in: req.query.quoteStatus };

    if (['Partner', 'Sales Rep', 'Observing Partner'].includes(req.user.role.roleName)) {
      let CompanyIDs: any = [];
      let ConsumerIDs: any = [];

      let companies = await CompanyModel.find({ Assignee: { $in: req.user._id } });
      companies=companies.map((s) => { CompanyIDs.push(ObjectId(s._id)) });

      const cr = await UserModel.find({ Assignee: { $in: req.user._id } });
      cr.map((s) => { ConsumerIDs.push(ObjectId(s._id)) });

      filterBeforeLookup.$or = [
        { Company: { $in: CompanyIDs } },
        { Consumer: { $in: ConsumerIDs } }
      ];
      filterBeforeLookup.Status = { $nin: ['1000'] }
    }
    if(["Service Partner"].includes(req.user.role.roleName)){
      filter.Assignee = ObjectId(req.user._id);
      if(req.query?.Company){
        filterBeforeLookup.Company = ObjectId(req.query.Company)
      }else if(req.query?.Consumer){
        filterBeforeLookup.Consumer = ObjectId(req.query.Consumer)
      }

    }
    commonUtils.dateFilter(req, filter, {});
    try {
      if (req.path.includes("/count")) {
        const count = await RenewalModel.aggregate([
          { $match: filterBeforeLookup },
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
          { $match: filter },
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

        const renewalQuery = RenewalModel.aggregate([
          { $match: filterBeforeLookup },
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
          { $match: filter },

          {
            $project: {
              RenewalID: 1,
              serviceType: 1,
              Status: 1,
              "Company._id": 1,
              "Company.businessName": 1,
              "Site._id": 1,
              "Site.siteName": 1,
              "Consumer._id": 1,
              "Consumer.title": 1,
              "Consumer.firstName": 1,
              "Consumer.surName": 1,
              'createdAt': 1,
              'Assignee':1,
              'renewalStartDate': {
                $switch: {
                  branches: [
                    { 'case': { $eq: ['$serviceType', "Gas"] }, 'then': '$service.gas.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Electric"] }, 'then': '$service.electric.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Water"] }, 'then': '$service.water.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "ChipAndPin"] }, 'then': '$service.chipAndPin.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Telecoms"] }, 'then': '$service.telecoms.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Broadband"] }, 'then': '$service.broadband.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Energy"] }, 'then': '$service.energy.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Funeral"] }, 'then': '$service.funeral.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Mortgage"] }, 'then': '$service.mortgage.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Waste"] }, 'then': '$service.waste.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Insurance"] }, 'then': '$service.insurance.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "BusinessRates"] }, 'then': '$service.businessrates.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "Debt"] }, 'then': '$service.debt.contract_start_date' },
                    { 'case': { $eq: ['$serviceType', "TelecomAndBroadband"] }, 'then': '$service.telecomandbroadband.contract_start_date' },
                  ]
                }
              },
              'renewalEndDate': {
                $switch: {
                  branches: [
                    { 'case': { $eq: ['$serviceType', "Gas"] }, 'then': '$service.gas.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Electric"] }, 'then': '$service.electric.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Water"] }, 'then': '$service.water.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "ChipAndPin"] }, 'then': '$service.chipAndPin.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Telecoms"] }, 'then': '$service.telecoms.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Broadband"] }, 'then': '$service.broadband.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Energy"] }, 'then': '$service.energy.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Funeral"] }, 'then': '$service.funeral.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Mortgage"] }, 'then': '$service.mortgage.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Waste"] }, 'then': '$service.waste.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Insurance"] }, 'then': '$service.insurance.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "BusinessRates"] }, 'then': '$service.businessrates.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "Debt"] }, 'then': '$service.debt.contract_end_date' },
                    { 'case': { $eq: ['$serviceType', "TelecomAndBroadband"] }, 'then': '$service.telecomandbroadband.contract_end_date' },

                  ]
                }
              }
            }
          },
          { $sort: sortObj },
          { $skip: skipNumber },
          { $limit: limitNumber },
        ]);
        const data = await renewalQuery.exec();
        res.send({ data, count: 0, success: true });
      }
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async ViewRenewal(req: Request, res: Response) {
    try {
      let id = ''
      if (req.body.quoteId) id = req.body.quoteId;
      else if (req.body.id) id = req.body.id;
      else id = req.params.renewal_id;
      let resp = await RenewalModel.findById(id)
        .populate("User Lead Supplier Assignee Consumer Notes.addedBy StatusHistory.User", "businessName siteName name email Assignee leadId supplierName title firstName surName avatar")
        .populate({
          path:"Site",
          select:"siteName siteAddress postcode town city country gas electric water chipandpin",
          populate:{
            path:"User",
            select:"name email jobTitle DOB nationalInsurance homeAddress previousAddress previousAddressYear phone mobile"
          }
        })
        .populate({
          path: "Company",
          select: "businessName Assignee firstLine secondLine postcode town country registerNumber vatNumber gatewayNumber bankSortcode creditScore bankName bankAccountNumber businessType utr trendingName",
          populate: {
            path: "Site Assignee",
            select: "siteName name email gas electric water chipandpin isActive",
            populate: {
              path: "User",
              select: "name email jobTitle DOB nationalInsurance homeAddress previousAddress previousAddressYear phone mobile"
            },
          },
        })
        .populate({
          path: "Consumer",
          select: "title firstName surName email",
          populate: {
            path: "Assignee",
            select: "name email isActive"
          },
        })
        .select('RenewalID isActive isBlock isDelete service LinkedQuote serviceType contractLength Price Status expiryDate contractAcceptDate contractLengthDate StatusHistory expiryDate notes Notes createdAt beforemonths debtpayments');
      res.send({ success: true, data: resp });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async UpdateRenewalRegUser(req: Request, res: Response) {
    try {
      const previousObject = await RenewalModel.findById(req.body.quoteId);
      await RenewalModel.findByIdAndUpdate(req.body.quoteId, req.body);

      const history = new HistoryModule();
      if (req.body.Supplier && req.body.Supplier.length > 0 && String(previousObject.Supplier) !== String(req.body.Supplier)) {
        const Supplier = await SupplierModel.findById(req.body.Supplier);
        history.RenewalHistory(req.body.quoteId, { Supplier: '' }, { Supplier: `${Supplier.supplierName}, supplier updated` }, req);
      } else if (req.body.isDelete !== undefined) {
        history.RenewalHistory(req.body.quoteId, { isDelete: true }, { isDelete: false }, req);
      } else {
        history.RenewalHistory(req.body.quoteId, previousObject.service[req.body.serviceTypeName], req.body.service[req.body.serviceTypeName], req, req.body.serviceTypeName);
      }

      const m = new RegUserController();
      m.ViewRenewal(req, res);
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async UpdateAssigneeRegUser(req: Request, res: Response) {
    try {
      if(req.body?.Assignee){
        await RenewalModel.updateMany({ _id: req.body.RenewalID }, { Assignee: req.body.Assignee });
        const Assignee = await UserModel.findById(req.body.Assignee).select('name');
        const history = new HistoryModule();
        history.RenewalHistory(req.body.RenewalID, { Assignee: '' }, { Assignee: `${Assignee.name}, assignee updated` }, req);
      }
      let renewal = await RenewalModel.findOne({_id:req.body.RenewalID});
      let newTask = new TaskModel();
      newTask.Title = `RENEWAL TASK ${renewal.RenewalID} ${renewal.serviceType}`;
      newTask.Description = `CONTRACT RENEWAL DUE`;
      newTask.Priority = 'Normal';

      if(renewal.serviceType == 'ChipAndPin' && renewal?.service['chipAndPin']?.contract_end_date && req.body?.beforemonths){
        renewal.beforemonths = req.body.beforemonths;
        await renewal.save();
        let date = new Date(renewal.service['chipAndPin'].contract_end_date);
        date.setMonth(date.getMonth()-req.body.beforemonths);
        date.setHours(12,0,0);
        newTask.DueDate = new Date(date);
        newTask.Time = new Date(date);
      }else if(renewal?.service[renewal.serviceType.toLowerCase()]?.contract_end_date && req.body?.beforemonths) {
        renewal.beforemonths = req.body.beforemonths;
        await renewal.save();
        let date = new Date(renewal.service[renewal.serviceType.toLowerCase()].contract_end_date);
        date.setMonth(date.getMonth()-req.body.beforemonths);
        date.setHours(12,0,0);
        newTask.DueDate = new Date(date);
        newTask.Time = new Date(date);
      }
      newTask.Status = '1000'
      newTask.TaskOn = "Renewal";
      newTask.Renewal= renewal._id;
      if(renewal?.Company)
        newTask.Company= renewal.Company
      if(renewal?.Consumer)
      newTask.Consumer= renewal.Consumer;
      if(req.body.Assignee){
        newTask.Assignee = req.body.Assignee   
      }else if(renewal?.Assignee){
        newTask.Assignee = renewal.Assignee   
      }
      newTask.createdBy=req.user._id;

      await newTask.save();
      

      return res.send({ success: true });
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

      await RenewalModel.updateOne({ _id: req.body.id }, { $push: { Notes: [comment] } });

      const history = new HistoryModule();
      history.RenewalHistory(req.body.id, { Comment: '' }, { Comment: 'Comment added' }, req);

      const rc = new RegUserController();
      rc.ViewRenewal(req, res);
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AddPaymentInfoForDebtService(req:Request, res: Response){
    try {
      if(!req.body?.renewalId)
          throw {message:'renewalId required'}
      if(!req.body?.payment)
          throw {message: 'payment info required'}

      let renewal = await RenewalModel.findOneAndUpdate({_id:req.body.renewalId,serviceType:'Debt'},{$push:{debtpayments:req.body.payment}},{new:true})

      if(renewal?._id){
        const rc = new RegUserController();
        req.body.quoteId = req.body.renewalId
        delete req.body.renewalId
        rc.ViewRenewal(req, res);
      }
      else 
          throw {message : "Can't find a quote with Debt service"}

    } catch (err) {
      console.log(err)
      return res.send({success:false,message:err.message})
      
    }
  }

  async DeletePaymentInfoForDebtService(req:Request, res: Response){
    try {
      if(!req.body?.renewalId)
          throw {message:'renewalId required'}
      if(!req.body?.paymentId)
          throw {message: 'paymentId required'}

      let renewal = await RenewalModel.findOneAndUpdate({_id:req.body.renewalId,serviceType:'Debt'},{$pull:{debtpayments:{_id:req.body.paymentId}}},{new:true})
      
      if(renewal?._id){
        const rc = new RegUserController();
        req.body.quoteId = req.body.renewalId
        delete req.body.renewalId
        rc.ViewRenewal(req, res);
      }
      else 
          throw {message : "Can't find a quote with Debt service"}

    } catch (err) {
      console.log(err)
      return res.send({success:false,message:err.message})
      
    }
  }
}

export default class RenewalController extends ControllerUtils {
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

  async RenewalProvided(req: Request, res: Response) {
    try {
      let renewalInfo = await RenewalModel.findOne({ _id: req.params.renewal_id });
      let negotiation = renewalInfo;
      let status = 0;
      if (req.body.negotiation.Status == 1000) {
        status = QuoteStatus.RenewalStatus.RenewalProvided;
      } else if (Number(req.body.negotiation.QuoteStatus) === 1012) {
        status = QuoteStatus.RenewalStatus.RevisedSupplierRates;
      } else {
        status = QuoteStatus.RenewalStatus.RevisedRenewalProvided;
      }
      negotiation.Status = status;
      negotiation.Price = req.body.negotiation.Amount;
      negotiation.notes = req.body.negotiation.Notes;
      negotiation.contractLength = req.body.negotiation.ContractLength;
      negotiation.expiryDate = req.body.negotiation.ExpiryDate;

      if (req.body.negotiation.serviceType === 'ChipAndPin') {
        negotiation.service.chipAndPin.contract_length = req.body.negotiation.ContractLength;
      } else {
        negotiation.service[req.body.negotiation.serviceType.toLowerCase()].contract_length = req.body.negotiation.ContractLength;
      }

      await RenewalModel.updateOne({ _id: req.params.renewal_id }, negotiation);

      const history = new HistoryModule();
      history.RenewalActionHistory(req.params.renewal_id, status, req.body.negotiation, req);
      res.send({ success: true, data: renewalInfo });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DeleteRenewal(req: Request, res: Response) {
    try {
      await RenewalModel.deleteOne({ _id: req.params.renewal_id });
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async RejectRenewal(req: Request, res: Response) {
    try {
      await RenewalModel.updateOne({ _id: req.params.renewal_id }, { isBlock: 0, isDelete: 0 });
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async RenewalInvoiced(req: Request, res: Response) {
    try {
      let update: { [k: string]: any } = {};
      let tempRenwalUpdation = await RenewalModel.findOne({ _id: req.body.RenewalID });
      if (req.body.serviceType == 'ChipAndPin' && !tempRenwalUpdation.service['chipAndPin'].contract_start_date && !tempRenwalUpdation.service['chipAndPin'].contract_end_date) {
        res.send({ success: false, message: 'Please provide contract start date and contract end date' })
      }
      else if (req.body.serviceType !== 'ChipAndPin' && !tempRenwalUpdation.service[req.body.serviceType.toLowerCase()].contract_start_date && !tempRenwalUpdation.service[req.body.serviceType.toLowerCase()].contract_end_date) {
        res.send({ success: false, message: 'Please provide contract start date and contract end date' })
      }

      if (req.body.serviceType && req.body.serviceType != "") {
        if (['BusinessRates', 'ChipAndPin'].includes(tempRenwalUpdation.serviceType)) {
          if (tempRenwalUpdation.serviceType == 'BusinessRates') {
            tempRenwalUpdation.service["businessrates"].contract_start_date = Number(req.body.contractLengthDate);
            tempRenwalUpdation.service["businessrates"].contract_end_date = new Date(new Date(new Date(tempRenwalUpdation.service["businessrates"].contract_start_date).setMonth(new Date(Number(req.body.contractLengthDate)).getMonth() + commonUtils.getMonthFromLength(tempRenwalUpdation.service["businessrates"].contract_length))).getTime() - (24 * 60 * 60 * 1000)).getTime();
            tempRenwalUpdation.contractLengthDate = new Date(new Date(new Date(tempRenwalUpdation.service["businessrates"].contract_start_date).setMonth(new Date(Number(req.body.contractLengthDate)).getMonth() + commonUtils.getMonthFromLength(tempRenwalUpdation.service["businessrates"].contract_length))).getTime() - (24 * 60 * 60 * 1000)).getTime();
          }
          if (tempRenwalUpdation.serviceType == 'ChipAndPin') {
            tempRenwalUpdation.service["chipAndPin"].contract_start_date = Number(req.body.contractLengthDate);
            tempRenwalUpdation.service["chipAndPin"].contract_end_date = new Date(new Date(new Date(tempRenwalUpdation.service["chipAndPin"].contract_start_date).setMonth(new Date(Number(req.body.contractLengthDate)).getMonth() + commonUtils.getMonthFromLength(tempRenwalUpdation.service["chipAndPin"].contract_length))).getTime() - (24 * 60 * 60 * 1000)).getTime();
            tempRenwalUpdation.contractLengthDate = new Date(new Date(new Date(tempRenwalUpdation.service["chipAndPin"].contract_start_date).setMonth(new Date(Number(req.body.contractLengthDate)).getMonth() + commonUtils.getMonthFromLength(tempRenwalUpdation.service["chipAndPin"].contract_length))).getTime() - (24 * 60 * 60 * 1000)).getTime();
          }
        } else {
          tempRenwalUpdation.service[req.body.serviceType.toLowerCase()].contract_start_date = Number(req.body.contractLengthDate);
          tempRenwalUpdation.service[req.body.serviceType.toLowerCase()].contract_end_date = new Date(new Date(new Date(tempRenwalUpdation.service[req.body.serviceType.toLowerCase()].contract_start_date).setMonth(new Date(Number(req.body.contractLengthDate)).getMonth() + commonUtils.getMonthFromLength(tempRenwalUpdation.service[req.body.serviceType.toLowerCase()].contract_length))).getTime() - (24 * 60 * 60 * 1000)).getTime();
          tempRenwalUpdation.contractLengthDate = new Date(new Date(new Date(tempRenwalUpdation.service[req.body.serviceType.toLowerCase()].contract_start_date).setMonth(new Date(Number(req.body.contractLengthDate)).getMonth() + commonUtils.getMonthFromLength(tempRenwalUpdation.service[req.body.serviceType.toLowerCase()].contract_length))).getTime() - (24 * 60 * 60 * 1000)).getTime();
        }
        await tempRenwalUpdation.save();
      }

      if (req.files.Invoice) update.Invoiced = req.files.Invoice[0].location
      update.Status = QuoteStatus.RenewalStatus.RenewalInvoiced;

      await RenewalModel.updateOne({ _id: req.body.RenewalID }, update);
      let RenewalInfo = await RenewalModel.findOne({ _id: req.body.RenewalID }).lean();
      const renewResult = await RenewalModel.findOne().sort({ createdAt: -1 }).exec();

      let a = [0, 999]
      if (renewResult) a = renewResult.RenewalID.split("-");
      let nextRenewalID = Number(a[1]) + 1;
      let data: any = {};
      data.RenewalID = `REN-${nextRenewalID}`;

      if (Boolean(RenewalInfo.Company)) data.Company = RenewalInfo.Company;
      if (Boolean(RenewalInfo.Consumer)) data.Consumer = RenewalInfo.Consumer;
      data.Site = RenewalInfo.Site;
      data.Supplier = RenewalInfo.Supplier;
      data.serviceType = RenewalInfo.serviceType;
      data.LinkedQuote = RenewalInfo.LinkedQuote;
      data.service = {};
      if (data.serviceType == 'ChipAndPin') {
        data.service.chipAndPin = RenewalInfo.service.chipAndPin;
      } else {
        data.service[data.serviceType.toLowerCase()] = RenewalInfo.service[data.serviceType.toLowerCase()];
      }
      data.contractLength = RenewalInfo.contractLength;
      data.contractLengthDate = null;
      data.Price = RenewalInfo.Price;
      data.createdBy = req.user._id;
      data.Status = QuoteStatus.RenewalStatus.LivePending;
      if (RenewalInfo.Assignee) {
        data.Assignee = RenewalInfo.Assignee;
      }
      let newRenewal = new RenewalModel(data);
      await newRenewal.save();
      const history = new HistoryModule();
      history.RenewalHistory(newRenewal._id, { Create: '' }, { Create: 'Renewal created' }, req);
      history.RenewalActionHistory(req.body.RenewalID, QuoteStatus.RenewalStatus.RenewalInvoiced, {}, req);

      res.send({ success: true, data: true, message: 'Invoice uploaded Successfully' });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DeleteRequest(req: Request, res: Response) {
    try {
      await RenewalModel.updateOne(
        {
          _id: req.body.id,
        },
        {
          isBlock: 0,
          isDelete: true,
        }
      );

      const history = new HistoryModule();
      history.RenewalHistory(req.body.id, { isDelete: false }, { isDelete: true }, req);

      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async RenewalAction(req: Request, res: Response) {
    try {
      let UpdateObj: any = {};
      UpdateObj.Status = req.body.Status;

      if (Number(req.body.quoteStatus) === 1002) {
        UpdateObj.contractAcceptDate = req.body.contractAcceptDate;
      }
      await RenewalModel.updateOne({ _id: req.body.RenewalID }, UpdateObj);

      const history = new HistoryModule();
      history.RenewalActionHistory(req.body.RenewalID, req.body.Status, req.body, req);
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async RevisedSupplier(req: Request, res: Response) {
    try {
      let UpdateObject = {
        Status: 1012
      }
      await RenewalModel.updateOne({ _id: req.body.RenewalID }, UpdateObject);
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async InvoiceDownload(req: Request, res: Response) {
    try {
      let resp = await RenewalModel.findById(req.params.renewal_id);
      if (resp.Invoiced !== undefined && resp.Invoiced) {
        res.download(
          path.join(__dirname, "../uploads/", resp.Invoiced),
          resp.Invoiced
        );
      } else {
        res.send({ msg: "Invoice not found", success: false });
      }
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DeleteMultiRenewal(req: Request, res: Response) {
    try {
      await req.body.deleteIds.forEach(async (element) => {
        await RenewalModel.remove({ _id: element });
      });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async RejectMultiRenewal(req: Request, res: Response) {
    try {
      await RenewalModel.updateMany({ _id: { $in: req.body.deleteIds } }, { isDelete: false });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }
}
