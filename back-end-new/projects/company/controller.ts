const async = require("async");
const path = require("path");
const fs = require("fs");
const _ = require("lodash");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

import aws from "../../sharedModules/smallModules/aws";
import { Request, Response } from "../../templates/commandInterface";
import UserModel from "../../models/user";
import ControllerUtils from "../../utils/ControllerUtils";
import CompanyModel from "../../models/Company";
import LeadModel from "../../models/Lead";
import QuoteModel from "../../models/Quotes";
import SiteModel from "../../models/Site";
import RenewalModel from "../../models/Renewal";
import TaskModel from "../../models/Task";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import HistoryModule from "../../sharedModules/smallModules/historyModule";
import DocusignController from "../docusign/controller";
import quoteStatus from "../quote/Modules/quoteStatus";

class AdminController { }
class ManagementController { }
class PartnerController { }
class SalesRepController { }
class ObservingPartnerController { }

class RegUserController {
  async createCompanyRegUser(req: Request, res: Response) {
    let nci: string;
    try {
      const previousCompany = await CompanyModel.findOne({ companyID: { $exists: true } }).sort({ createdAt: -1 })
      if (previousCompany) {
        nci = String(Number(previousCompany.companyID) + 1);
      } else {
        nci = "1000";
      }

      const aa = [];
      if (req.body.partnerName) aa.push(req.body.partnerName);
      if (["Partner", "Management", "Sales Rep"].includes(req.user.role.roleName)) {
        aa.push(req.user._id);
      }

      const AllManagement = await UserModel.find({ role: "5d5b92031c9d440000c99914" }).select('name');
      AllManagement.map(v => { aa.push(v._id) })

      const UniqueAssignee = aa.filter((value, index, self) => {
        return self.indexOf(value) === index;
      })

      let co = req.body;
      co.town = req.body.company_town;
      co.country = req.body.company_country;
      co.postcode = req.body.company_postcode;
      co.isActive = 1;
      co.companyID = nci;
      co.Assignee = UniqueAssignee;

      const cc = new CompanyModel(co);
      const company = await cc.save();

      //create default lead for all company services
      // const defaultLead = new LeadModel();
      // defaultLead.leadId = `L1-${company.companyID}`
      // defaultLead.Company = company._id
      // defaultLead.serviceType = ["Gas", "Electric", "Water", "ChipAndPin", "Telecoms", "Broadband", "Waste", "Insurance", "BusinessRates"]
      // defaultLead.status = "Existing Client Lead"
      // await defaultLead.save()

      // company.Lead = [defaultLead._id]
      await company.save()

      const history = new HistoryModule();
      history.CompanyHistory(company._id, { Create: '' }, { Create: "Company created" }, req);
      res.send({ success: true, company: company });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async updateCompanyPartnerRegUser(req: Request, res: Response) {
    try {
      await CompanyModel.findByIdAndUpdate(req.body.Company, {
        Partner: req.body.Partner,
      });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async activeCompanyreguser(req: Request, res: Response) {
    try {
      await CompanyModel.findByIdAndUpdate(req.body.companyId, {
        isActive: 1,
        Site:
          req.body.sites !== undefined && req.body.sites ? req.body.sites : [],
        Contact:
          req.body.contacts !== undefined && req.body.contacts
            ? req.body.contacts
            : [],
      });
      return res.send({ success: true, site: req.body.sites });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async showCompanyRegUser(req: Request, res: Response) {
    try {
      let id = ''
      if (req.body.id) id = req.body.id
      else id = req.params.id

      const docusignControllerObj = new DocusignController();
      await docusignControllerObj.admin.downloadAllCompletedDocumentsForCompany(req, id);
      const result = await CompanyModel.findById(id)
        .populate({
          path: "Contact Assignee Lead Site",
          select: "name email",
          options: {
            sort: {
              createdAt: "desc",
            },
          },
          populate: {
            path: "role Contact Site User",
            select: "roleName name email siteName"
          }
        })
        .populate({
          path: "Lead",
          options: {
            sort: {
              createdAt: "desc",
            },
          },
          populate: {
            path: "Contact Site",
            select: 'name email siteName',
          },
        })
        .populate({
          path: "Site",
          options: {
            sort: {
              createdAt: "desc",
            },
          },
          populate: {
            path: "User",
            select: "name email jobTitle DOB nationalInsurance homeAddress previousAddress previousAddressYear phone mobile"
          },
        })
        .populate({ path: "Notes.addedBy", select: 'name avatar' })
        .populate("meterReading.addedBy documents.addedBy")
        .populate({ path: 'installerDocuments.addedBy', select: 'name avatar' })

      res.send({ success: true, company: result });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async deleteRequestRegUser(req: Request, res: Response) {
    try {
      await CompanyModel.findByIdAndUpdate(req.body.id, { isDelete: 1 });
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async deleteRejectCompanyRegUser(req: Request, res: Response) {
    try {
      await CompanyModel.updateMany(
        {
          _id: {
            $in: req.body.deleteIds,
          },
        },
        {
          isDelete: 0,
        }
      );
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async deleteMultiCompanyRegUser(req: Request, res: Response) {
    try {
      await req.body.deleteIds.forEach(async (element) => {
        await UserModel.remove({ companyId: element });
        await SiteModel.remove({ companyId: element });
        await LeadModel.remove({ Company: element });
        await QuoteModel.remove({ Company: element });
        await RenewalModel.remove({ Company: element });
        await TaskModel.remove({ Company: element });
        await CompanyModel.deleteOne({ _id: element });
      });
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async blockUnblockreguser(req: Request, res: Response) {
    try {
      const companyDetails = await CompanyModel.findOne({
        _id: req.body.id,
      });
      await UserModel.update(
        {
          companyId: companyDetails._id,
        },
        {
          isActive: req.body.isActive,
          BlockedBy: req.user._id,
        }
      );
      await CompanyModel.updateOne(
        {
          _id: companyDetails._id,
        },
        {
          isActive: req.body.isActive,
          BlockedBy: req.user._id,
        }
      );
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async listCompanyRegUser(req: Request, res: Response) {
    let filter: any = {};
    let filterBeforeLookup: any = {};

    if (req.query.companyStatus === 'close') {
      filterBeforeLookup.isCompanyClose = true;
    } else {
      filterBeforeLookup.$or = [{ isCompanyClose: { $exists: true, $eq: false } }, { isCompanyClose: { $exists: false } }];
    }
    if (req.query.Assignee) filter.Assignee = { $in: [req.user._id] };
    if (req.query.isActive) filter.isActive = 1;
    if (req.query.isDelete) { 
      filter.isDelete = true 
      delete filterBeforeLookup.$or;
      delete filterBeforeLookup.isCompanyClose;
    }
    else {
      filter.isDelete = { $in: [0, false] }
    }
    if (req.query.blockedBy) filter.BlockedBy = req.user._id.toString();
    if (req.query.Partner && typeof req.query.Partner === 'string') filterBeforeLookup.Assignee = ObjectId(req.query.Partner);
    if (req.query.Partner && typeof req.query.Partner === 'object') {
      let ca = [];
      req.query.Partner.filter(c => { ca.push(ObjectId(c)) })
      filterBeforeLookup.Assignee = { $in: ca };
    };

    if (['Partner', 'Sales Rep', 'Observing Partner', 'Service Partner', 'Surveyor', 'Installer'].includes(req.user.role.roleName)) {
      filter.Assignee = { $in: [req.user._id] };
    }

    if (req.query.Search) {
      req.query.Search = decodeURIComponent(req.query.Search);

      ['[', ']', '{', '}', '(', ')'].forEach(sym => {
        if (req?.query?.Search.includes(sym)) {
          req.query.Search = req.query.Search.replace(sym, `\\${sym}`)
        }
      })

      filter.$or = [
        { businessName: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Contact.phone": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Contact.mobile": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Contact.name": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.gas.MPRN": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.electric.topLine": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.electric.meterNumber": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.chipandpin.midNumber": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.siteName": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.postcode": { $regex: `.*${req.query.Search}.*`, $options: "i" } },

      ];
    }

    commonUtils.dateFilter(req, filter, {});

    let sortObj: any = { updatedAt: 1 };
    if (req.query.sort) sortObj = { [req.query.sort]: req.query.sortType === 'asc' ? 1 : -1 };
    let skipNumber = 0;
    let limitNumber = 99;
    if (req.query.skip) skipNumber = Number(req.query.skip);
    if (req.query.limit) limitNumber = Number(req.query.limit);
    if (req.query.isLive) filter['quotes.quoteStatus'] = { $in: ['1002', '1004', 1002, 1004] };

    const companyQuery = CompanyModel.aggregate([
      { $sort: sortObj },
      { $match: filterBeforeLookup },
      {
        $lookup: {
          from: 'quotes',
          localField: '_id',
          foreignField: 'Company',
          as: 'quotes'
        }
      },
      {
        $lookup: {
          from: 'leads',
          localField: '_id',
          foreignField: 'Company',
          as: 'leads'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'companyId',
          as: 'Contact'
        }
      },
      {
        $lookup: {
          from: 'sites',
          localField: '_id',
          foreignField: 'company',
          as: 'Site'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'companyId',
          as: 'Assignee'
        }
      },
      { $match: filter },
      { $skip: skipNumber },
      {
        $project: {
          companyID: 1,
          firstLine: 1,
          postcode: 1,
          isCompanyClose: 1,
          "leads.serviceType": 1,
          "leads.status": 1,
          "quotes.serviceType": 1,
          "quotes.quoteStatus": 1,
          "quotes.service": 1,
          businessName: 1,
          "Site.gas.MPRN": 1,
          "Site.electric.topLine": 1,
          "Site.electric.meterNumber": 1,
          "Site.chipandpin.midNumber": 1,
          "Site.siteName": 1,
          'Site.postcode': 1,
          isActive: 1,
          createdAt: 1,
          "Contact.name": 1,
          "Contact.mobile": 1,
          "Contact.phone": 1,
          "Contact.email": 1
        }
      },
      { $limit: limitNumber }
    ]);

    try {
      const data = await companyQuery.exec();

      data.map((sq, index) => {
        quoteStatus
        let ls = [];
        let as = [];
        let mprn = [];
        let mpan = [];
        let midNumber = [];
        sq.quotes.map((ss) => {
          if (['1004', 1004].includes(ss.quoteStatus)) {
            ls.push(String(ss.serviceType));
          }
          if (ss.service !== undefined && ss.service.gas !== undefined) {
            mprn.push(String(ss.service.gas.meterNumber));
          }
          if (ss.service !== undefined && ss.service.electric !== undefined) {
            mpan.push(String(ss.service.electric.meterNumber));
          }
          if (ss.service !== undefined && ss.service.chipAndPin !== undefined) {
            midNumber.push(String(ss.service.chipAndPin.midNumber));
          }
          as.push(String(ss.serviceType));
        });

        sq.leads.map(lead => {
          if (!["DND", "Not Interested", "Dead Lead", "Lead Closed"].includes(lead.status)) {
            lead.serviceType.forEach(service => {
              as.push(String(service))
            })
          }
        });

        const lsd = ls.filter((value, ind, self) => self.indexOf(value) === ind);
        const asd = as.filter((value, ind, self) => self.indexOf(value) === ind);
        data[index].liveServices = lsd;
        data[index].allServices = asd;
        data[index].mprn = mprn;
        data[index].mpan = mpan;
        data[index].midNumber = midNumber;
      });

      // NOTE: counting adds an extra aggregation which can significantly slow down paging.
      // If the UI doesn't need accurate count immediately, keep it disabled for performance.
      res.send({ data, count: 0, success: true });


    } catch (err) {
      console.log(err);
      res.send({ success: false, message: err.errMsg });
    }
  };

  async CompanyCount(req: Request, res: Response) {
    let filter: any = {};
    if (req.query.Assignee) filter.Assignee = { $in: [req.user._id] };
    if (req.query.isActive) filter.isActive = 1;
    if (req.query.isDelete) filter.isDelete = 1;
    if (req.query.blockedBy) filter.BlockedBy = req.user._id.toString();
    if (req.query.Partner && typeof req.query.Partner === 'string') filter.Assignee = { $in: [req.query.Partner] };
    if (req.query.Partner && typeof req.query.Partner === 'object') filter.Assignee = { $in: req.query.Partner };
    if (['Partner', 'Sales Rep', 'Observing Partner'].includes(req.user.role.roleName)) {
      filter.Assignee = { $in: [req.user._id] };
    }

    if (req.query.Search) {
      ['[', ']', '{', '}', '(', ')'].forEach(sym => {
        if (req?.query?.Search.includes(sym)) {
          req.query.Search = req.query.Search.replace(sym, `\\${sym}`)
        }
      })

      filter.$or = [
        { businessName: { $regex: `.*${req.query.Search}.*`, $options: "gi" } },
        { "Contact.phone": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Contact.mobile": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Contact.name": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.gas.MPRN": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.electric.topLine": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.electric.meterNumber": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.chipandpin.midNumber": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.siteName": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { "Site.postcode": { $regex: `.*${req.query.Search}.*`, $options: "i" } },

      ];
    }

    if (req.query.dateTo && req.query.dateFrom) {
      filter.createdAt = {
        $lte: new Date(req.query.dateTo),
        $gte: new Date(req.query.dateFrom)
      };
    }
    if (req.query.dateTo) {
      filter.createdAt = {
        $lte: new Date(req.query.dateTo)
      };
    }
    if (req.query.dateFrom) {
      filter.createdAt = {
        $gte: new Date(req.query.dateFrom)
      };
    }

    if (req.query.isLive) filter['quotes.quoteStatus'] = { $in: ['1002', '1004', 1002, 1004] };

    try {
      const count = await CompanyModel.aggregate([
        {
          $lookup: {
            from: 'quotes',
            localField: '_id',
            foreignField: 'Company',
            as: 'quotes'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'companyId',
            as: 'Contact'
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
    } catch (err) {
      res.send({ success: false, message: err.errMsg });
    }
  }
}
export default class companyControllers extends ControllerUtils {
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

  async listCompaniesForQuote(req: Request, res: Response) {
    const filter: any = {};
    try {
      if (req.query.isActive) filter.isActive = 1;
      if (req.query.Assignee) {
        filter.Assignee = {
          $in: req.user._id,
        };
      }
      if (req.query.Partner) {
        filter.Partner = {
          $in: req.query.Partner,
        };
      }
      if (req.query.isDelete) filter.isDelete = 1;
      if (req.query.blockedBy) {
        filter.BlockedBy = req.user._id;
        filter.isActive = 0;
      }

      const query = CompanyModel.find(filter);
      commonUtils.commonFindQuery(query, req.query);
      query.populate("Contact Partner Assignee");
      query.populate({
        path: "Site",
        populate: {
          path: "User",
        },
      });
      const companiesForQuote = await query.exec();
      const count = await CompanyModel.countDocuments(filter);
      res.send({ data: companiesForQuote, count: count, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AddAssigneeRegUser(req: Request, res: Response) {
    let cma: Array<string>;
    try {
      const result = await CompanyModel.findOne({ _id: req.body.CompanyID });
      cma = result.Assignee;
      req.body.Assignee.forEach((element) => {
        cma.unshift(element);
      });

      const uni = cma.filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
      await CompanyModel.update({ _id: req.body.CompanyID }, { Assignee: uni });

      const ad = await UserModel.find({ _id: { $in: req.body.Assignee } }).select('name');

      if (ad) {
        const history = new HistoryModule();
        let as = ''
        ad.forEach((i, idx, ad) => {
          if (ad.length === 1) {
            as += `${i.name} `
          }
          else if (idx === ad.length - 1) {
            as += `and ${i.name} `
          } else {
            as += `${i.name}, `
          }
        });
        history.CompanyHistory(req.body.CompanyID, { Assignee: '' }, { Assignee: `${as} assignee added` }, req);
      }

      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async updateCompany(req: Request, res: Response) {
    try {
      const previousObject = await CompanyModel.findById(req.body.editId);
      await CompanyModel.findByIdAndUpdate(req.body.editId, { $set: req.body.updateDetail });
      if (req.body?.updateDetail?.isCompanyClose === true) {
        await RenewalModel.updateMany({ Company: req.body.editId }, { isDelete: true });
      }
      if (req.body?.updateDetail?.isCompanyClose === false) {
        await RenewalModel.updateMany({ Company: req.body.editId }, { isDelete: false });
      }
      const history = new HistoryModule();
      history.CompanyHistory(req.body.editId, previousObject, req.body.updateDetail, req, 'Company');
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async updateCompanyIntroducer(req: Request, res: Response) {
    try {
      await CompanyModel.findByIdAndUpdate(req.body.editId, { $set: req.body.updateDetail });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async FetchNewDocuments(req: Request, res: Response) {
    try {
      const CompanyData = await CompanyModel.findById(
        req.params.company_id
      ).populate("documents.addedBy");

      let newONe = [];
      if (req.query.Search && req.query.Search.length > 0) {
        await CompanyData.documents.filter((el) => {
          if (
            String(el.title)
              .toLowerCase()
              .includes(String(req.query.Search).toLowerCase())
          ) {
            newONe.push(el);
            return true;
          }
          return false;
        });
      } else {
        newONe = CompanyData.documents;
      }

      CompanyData.documents = newONe;

      res.send({ success: true, data: CompanyData });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async deleteRequestRejectAdmin(req: Request, res: Response) {
    try {
      await CompanyModel.findByIdAndUpdate(req.body.id, { isDelete: 0 });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async deleteRequestAcceptAdmin(req: Request, res: Response) {
    try {
      await UserModel.remove({ companyId: req.body.id });
      await SiteModel.remove({ companyId: req.body.id });
      await LeadModel.remove({ Company: req.body.id });
      await QuoteModel.remove({ Company: req.body.id });
      await RenewalModel.remove({ Company: req.body.id });
      await TaskModel.remove({ Company: req.body.id });
      await CompanyModel.remove({ _id: req.body.id });
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async CompanyDropdownList(req: Request, res: Response) {
    try {
      let filter: any = {};
      const { query } = req;

      if (query.isActive) filter.isActive = 1;
      if (query.Search) filter.businessName = { $regex: `.*${req.query.Search}.*`, $options: "i" };
      filter.$or = [{ isCompanyClose: { $exists: true, $eq: false } }, { isCompanyClose: { $exists: false } }];
      filter.isDelete = { $in: [false, 0] }
      if (["Partner", "Sales Rep", "Observing Partner"].includes(req.user.role.roleName)) {
        filter.Assignee = {
          $in: [req.user._id]
        };
      }

      const data = await CompanyModel.find(filter)
        .sort({ createdAt: -1 })
        .populate({
          path: 'Site',
          select: 'siteName postcode siteAddress',
          populate: {
            path: 'User',
            select: 'name email mobile phone jobTitle'
          }
        })
        .populate("Contact", "name ")
        .populate("Assignee", "name")
        .limit(isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit))
        .select("businessName firstLine businessType");

      res.send({ data: data, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async SingleCompanyViewWithSite(req: Request, res: Response) {
    try {
      const data = await CompanyModel.find({ _id: req.params.id })
        .sort({ createdAt: -1 })
        .populate({
          path: 'Site',
          select: 'siteName postcode',
          populate: {
            path: 'User',
            select: 'name'
          }
        })
        .populate("Contact", "name")
        .select("businessName");

      res.send({ success: true, data });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async SingleCompanyView(req: Request, res: Response) {
    try {
      let filter: any = {};
      let id = ''
      if (req.body.id) id = req.body.id
      else id = req.params.id
      filter._id = ObjectId(id);
      const companyQuery = CompanyModel.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: 'quotes',
            localField: '_id',
            foreignField: 'Company',
            as: 'Quote'
          }
        },
        {
          $lookup: {
            from: 'leads',
            localField: 'Lead',
            foreignField: '_id',
            as: 'Lead'
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
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: 'companyId',
            as: 'Contact'
          }
        },
        {
          $lookup: {
            from: 'sites',
            localField: '_id',
            foreignField: 'company',
            as: 'Site'
          }
        },
        {
          $match: {
            "Quote.isDelete": {
              "$in": [
                false,
                0
              ]
            }
          }
        },
        {
          $project: {
            companyID: 1,
            businessName: 1,
            "Quote._id": 1,
            "Quote.QuoteID": 1,
            "Lead._id": 1,
            "Lead.leadId": 1,
            "Assignee._id": 1,
            "Assignee.name": 1,
            "Assignee.isActive": 1,
            "Contact._id": 1,
            "Contact.name": 1,
            "Site._id": 1,
            "Site.siteName": 1
          }
        },
      ]);

      const data = await companyQuery.exec();
      res.send({ success: true, data });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async CompanyDropdownListTemp(req: Request, res: Response) {
    try {
      let filter: any = {};
      const { query } = req;
      if (query.isActive) filter.isActive = 1;
      if (query.Search) filter.businessName = { $regex: `.*${req.query.Search}.*`, $options: "i" };
      if (["Partner", "Sales Rep", "Observing Partner"].includes(req.user.role.roleName)) {
        filter.Assignee = {
          $in: [req.user._id]
        };
      }

      let sortObj: any = { updatedAt: -1 };
      let limitNumber = 99;
      if (req.query.limit) limitNumber = Number(req.query.limit);

      const companyQuery = CompanyModel.aggregate([
        { $sort: sortObj },
        { $match: filter },
        {
          $project: {
            businessName: 1,
          }
        },
        { $limit: limitNumber }
      ]);

      const data = await companyQuery.exec();
      res.send({ data: data, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DropdownCompanies(req: Request, res: Response) {
    let allSearchCmpResult: any;
    try {
      allSearchCmpResult = await CompanyModel.find({
        Assignee: { $in: req.user._id },
      }).populate("Assignee");
      if (req.query.sort) {
        allSearchCmpResult = _.sortBy(
          allSearchCmpResult,
          (v) => v[req.query.sort]
        );
        if (req.query.sortType === "desc") {
          allSearchCmpResult = allSearchCmpResult.reverse();
        }
      }
      res.send({ data: allSearchCmpResult, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DropdownCompaniesAndSitesForLead(req: Request, res: Response) {
    try {
      let limit =
        isNaN(Number(req.body.limit)) == true ? 10 : Number(req.body.limit);
      let skip =
        isNaN(Number(req.body.skip)) == true ? 0 : Number(req.body.skip);
      let filter: any = {};
      let closeCompanyFilter: any = {};
      let aggregatePipeline = [];
      let data: any = [];
      let isNext = false;
      if (req.body.search) {
        filter.$or = [
          { businessName: { $regex: `.*${req.body.search}.*`, $options: "i" } },
        ];
      }
      filter.isDelete = { $in: [false, 0] }
      closeCompanyFilter.$or = [{ isCompanyClose: { $exists: true, $eq: false } }, { isCompanyClose: { $exists: false } }];

      aggregatePipeline.push({ $match: closeCompanyFilter });
      aggregatePipeline.push({ $match: filter });
      aggregatePipeline.push({ $skip: skip });
      aggregatePipeline.push({ $limit: limit });
      aggregatePipeline.push({
        $lookup: {
          from: 'sites',
          localField: 'Site',
          foreignField: '_id',
          as: 'Site'
        }
      })
      aggregatePipeline.push({
        $project: {
          businessName: 1,
          'Site._id': 1,
          'Site.siteName': 1
        }
      })
      data = await CompanyModel.aggregate(aggregatePipeline);

      if (data.length === limit) isNext = true;
      else isNext = false;
      res.send({ success: true, isNext: isNext, data: data });

    } catch (error) {
      console.log(error);
      res.send({ success: false, message: error.message });
    }
  }

  async DropdownSitesForLead(req: Request, res: Response) {
    try {
      if (!req.body.companyId) {
        throw { message: 'companyId required' }
      }
      let siteData = await SiteModel.find({ company: req.body.companyId }).select('siteName');
      res.send({ success: true, data: siteData });
    } catch (error) {
      console.log(error);
      res.send({ success: false, message: error.message });
    }
  }

  async AddDocument(req: Request, res: Response) {
    try {
      const document = {
        attachment: '',
        timestamps: new Date().getTime(),
        addedBy: req.user._id,
        title: req.body.title,
      };

      if (req.files.Attachments) {
        document.attachment = req.files.Attachments
          .map(f => ({
            name: f.originalname,
            value: f.location,
            type: f.mimetype
          }));
      }

      if (req.body.CompanyID !== undefined && req.body.CompanyID) {
        await CompanyModel.updateOne({ _id: req.body.CompanyID }, { $push: { [req.user.role.roleName === 'Installer' ? 'installerDocuments' : 'documents']: [document] } });

        const history = new HistoryModule();
        history.CompanyHistory(req.body.CompanyID, { 'Document': '' }, { 'Document': req.body.title }, req);

      }
      if (req.body.Consumer !== undefined && req.body.Consumer) {
        await UserModel.updateOne({ _id: req.body.Consumer }, { $push: { [req.user.role.roleName === 'Installer' ? 'installerDocuments' : 'documents']: [document] } });

        const history = new HistoryModule();
        history.ConsumerHistory(req.body.Consumer, { 'Document': '' }, { 'Document': req.body.title }, req);
      }
      res.send({ success: true, data: true });
    } catch (error) {
      res.send({ data: error, success: false });
    }
  }

  async UploadAttachment(req: Request, res: Response) {
    res.send({ success: true });
  }

  async DownloadAttachment(req: Request, res: Response) {
    res.download(path.join(__dirname, `../../uploads/${req.params.fileName}`), req.params.downloadName);
  }

  async DeleteAttachments(req: Request, res: Response) {
    try {
      const ar = {
        'meterReading': 'Meter reading',
        'documents': 'Document'
      }
      let Documents: any = {};
      if (req.params.company_id !== undefined && req.params.company_id) {
        Documents = await CompanyModel.findById(req.params.company_id);
      }
      if (req.params.consumer_id !== undefined && req.params.consumer_id) {
        Documents = await UserModel.findById(req.params.consumer_id);
      }
      Documents[req.params.type].filter((el) => {
        if (String(el._id) === String(req.params.document_id)) {
          el.attachment && el.attachment.filter((at) => aws.deleteFileFromS3(at));
          return true;
        }
        return false;
      });
      if (req.params.company_id !== undefined && req.params.company_id) {
        await CompanyModel.update({ _id: req.params.company_id }, { $pull: { [req.params.type]: { _id: req.params.document_id } } });

        const history = new HistoryModule();
        history.CompanyHistory(req.params.company_id, { [ar[req.params.type]]: '' }, { [ar[req.params.type]]: `${[ar[req.params.type]]} deleted` }, req);
      }
      if (req.params.consumer_id !== undefined && req.params.consumer_id) {
        await UserModel.update({ _id: req.params.consumer_id }, { $pull: { [req.params.type]: { _id: req.params.document_id } } });

        const history = new HistoryModule();
        history.ConsumerHistory(req.params.consumer_id, { [ar[req.params.type]]: '' }, { [ar[req.params.type]]: `${[ar[req.params.type]]} deleted` }, req);
      }
      res.send({ success: true });
    } catch (error) {
      res.send({ success: false, data: error });
    }
  }

  async listCompanySiteList(req: Request, res: Response) {
    let filter = {};
    filter = { company: req.query.companyId, };
    let query = SiteModel.find(filter).populate("User");
    query = commonUtils.commonFindQuery(query, req.query);
    const countquery = SiteModel.countDocuments(filter);
    const data = await query.exec();
    const count = await countquery.exec();
    res.send({ data: data, count: count, success: true });
  }

  async CompanyAssigneeList(req: Request, res: Response) {
    let data = await CompanyModel.findById(req.query.Company)
      .populate({
        path: "Assignee",
        select: "name email",
        match: { isActive: { $eq: 1 } },
        populate: {
          path: "role",
          select: 'roleName'
        },
      })
      .select("Assignee");
    let assigneeData = data.Assignee;
    let assigneeDataCount = data.Assignee;
    if (req.query.sort) {
      assigneeData = _.sortBy(
        assigneeData,
        (v) => v[req.query.sort]
      );
      if (req.query.sortType === "desc") {
        assigneeData = assigneeData.reverse();
      }
    }

    if (req.query.skip || req.query.limit) {
      assigneeData = assigneeData.slice(
        Number(req.query.skip),
        Number(req.query.skip) + Number(req.query.limit)
      );
    }
    res.send({ allAssignee: data.Assignee, data: assigneeData, count: assigneeDataCount.length, success: true });
  }

  async AddNotes(req: Request, res: Response) {
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

      await CompanyModel.updateOne({ _id: req.body.id }, { $push: { Notes: [comment] } });

      const history = new HistoryModule();
      history.CompanyHistory(req.body.id, { Comment: '' }, { Comment: 'Comment added' }, req);

      const rc = new RegUserController();
      rc.showCompanyRegUser(req, res);
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async GetNotes(req: Request, res: Response) {
    try {
      const CompanyData = await CompanyModel.findById(req.params.company_id).populate('Notes.addedBy').select("Notes");
      res.send({ success: true, data: CompanyData });
    } catch (error) {
      res.send({ success: false, data: error });
    }
  };
}