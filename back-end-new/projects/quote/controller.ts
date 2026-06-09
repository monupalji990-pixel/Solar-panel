const _ = require("lodash");
const path = require("path");
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

import CompanyModel from "../../models/Company";
import QuoteModel, { QuoteInterface } from "../../models/Quotes";
import RenewalModel from "../../models/Renewal";
import QuoteStatus from "./Modules/quoteStatus";
import { Request, Response } from "../../templates/commandInterface";
import UserModel, { UserInterface } from "../../models/user";
import TaskModel from "../../models/Task";
import SupplierModel from "../../models/Supplier";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import HistoryModule from "../../sharedModules/smallModules/historyModule";
import PaymentHistoryController from "../../projects/paymentHistory/controller";

var pdf = require('pdf-creator-node');
var fs = require('fs');
var html = fs.readFileSync(path.join(__dirname, `./../../supplierQuote.html`), 'utf8');
const moment = require('moment');

class CommonModule {
  async generatePdf(data: any) {

    let users = {
      ...data,
      prevSpend: data.isPrevSpend,
      localData: data.localData,
      supplierName: data.localData?.currentSupplier?.value,
      contractStartDate: moment(data.localData.contract_start_end).format('DD-MM-YYYY'),
      totalCCL: (data.localData.ccl * data.localData.aq / 100).toFixed(5),
      serviceTypeGas: data.localData.serviceType === "gas" ? true : false,
      serviceTypeElectric: data.localData.serviceType === "electric" ? true : false
    }

    const monthlyCost = (e) => {
      try {
        const total = ((e.standingCharge * 365 / 100)
          + ((e.unitRate !== undefined && e.unitRate !== null ? e.unitRate : 0) * data.localData?.aq / 100)
          + ((e.nightRate !== null && e.nightRate !== undefined ? e.nightRate : 0) * (data.localData?.nightkwh !== undefined ? data.localData?.nightkwh : 0) / 100)
          + ((e.ewRate !== null && e.ewRate !== undefined ? e.ewRate : 0) * (data.localData?.ewkwh !== undefined ? data.localData?.ewkwh : 0) / 100))

        const totalCCL = (data.localData?.ccl *
          (data.localData?.aq
            + (data.localData?.nightkwh !== undefined ? data.localData?.nightkwh : 0)
            + (data.localData?.ewkwh !== undefined ? data.localData?.ewkwh : 0)
          ))
          / 100;

        const totalVAT = ((
          (e.standingCharge * 365 / 100)
          + ((e.unitRate !== undefined && e.unitRate !== null ? e.unitRate : 0) * data.localData?.aq / 100)
          + ((e.nightRate !== null && e.nightRate !== undefined ? e.nightRate : 0) * (data.localData?.nightkwh !== undefined ? data.localData?.nightkwh : 0) / 100)
          + ((e.ewRate !== null && e.ewRate !== undefined ? e.ewRate : 0) * (data.localData?.ewkwh !== undefined ? data.localData?.ewkwh : 0) / 100)
          + ((data.localData?.ccl * (data.localData?.aq
            + (data.localData?.nightkwh !== undefined ? data.localData?.nightkwh : 0)
            + (data.localData?.ewkwh !== undefined ? data.localData?.ewkwh : 0)
          ))
            / 100)
        ) * (data.localData?.vat) / 100);

        const mc = (total + totalCCL + totalVAT) / 12;
        return mc.toFixed(5);
      } catch (error) {
        console.log("error in monthly cost", error);
      }
    }



    let prices = {
      rowData: data.rowData.map((e) => ({
        logo: e.logo !== undefined && e.logo !== null && e.logo,
        supplier: e.supplier,
        duration: e.duration,
        standingCharge: e.standingCharge.toFixed(5),
        totalSC: (e.standingCharge * 365 / 100).toFixed(5),
        unitrate: (e.unitRate !== undefined && e.unitRate !== null && e.unitRate.toFixed(5)),
        nightRate: (e.nightRate !== "" && e.nightRate !== null && e.nightRate !== undefined && e.nightRate.toFixed(5)),
        ewRate: (e.ewRate !== "" && e.ewRate !== null && e.ewRate !== undefined && e.ewRate.toFixed(5)),
        nightkwh: data.localData?.nightkwh ? data.localData?.nightkwh : 0,
        ewkwh: data.localData?.ewkwh ? data.localData?.ewkwh : 0,
        totalUC: ((e.unitRate !== undefined && e.unitRate !== null ? e.unitRate : 0) * data?.localData?.aq / 100).toFixed(5),
        totalNR: ((e.nightRate !== "" && e.nightRate !== null && e.nightRate !== undefined ? e.nightRate : 0) * data?.localData?.nightkwh / 100).toFixed(5),
        totalEW: ((e.ewRate !== "" && e.ewRate !== null && e.ewRate !== undefined ? e.ewRate : 0) * data?.localData?.ewkwh / 100).toFixed(5),
        CCLAQ: (data?.localData?.aq
          + (data?.localData?.nightkwh !== undefined ? data?.localData?.nightkwh : 0)
          + (data?.localData?.ewkwh !== undefined ? data?.localData?.ewkwh : 0)
        ),
        prevSpend: (data.isPrevSpend).toFixed(5),
        aq: data?.localData?.aq,
        totalC: (
          (e.standingCharge * 365 / 100)
          + ((e.unitRate !== undefined && e.unitRate !== null ? e.unitRate : 0) * (data?.localData?.aq !== undefined ? data?.localData?.aq : 0) / 100)
          + ((e.nightRate !== "" && e.nightRate !== null && e.nightRate !== undefined ? e.nightRate : 0) * (data?.localData?.nightkwh !== undefined ? data?.localData?.nightkwh : 0) / 100)
          + ((e.ewRate !== "" && e.ewRate !== null && e.ewRate !== undefined ? e.ewRate : 0) * (data?.localData?.ewkwh !== undefined ? data?.localData?.ewkwh : 0) / 100)
        ).toFixed(5),
        savings: (
          (e.standingCharge * 365 / 100)
          + ((e.unitRate !== undefined && e.unitRate !== null ? e.unitRate : 0) * (data?.localData?.aq !== undefined ? data?.localData?.aq : 0) / 100)
          + ((e.nightRate !== "" && e.nightRate !== null && e.nightRate !== undefined ? e.nightRate : 0) * (data?.localData?.nightkwh !== undefined ? data?.localData?.nightkwh : 0) / 100)
          + ((e.ewRate !== "" && e.ewRate !== null && e.ewRate !== undefined ? e.ewRate : 0) * (data?.localData?.ewkwh !== undefined ? data?.localData?.ewkwh : 0) / 100)
          - (data.isPrevSpend)
        ).toFixed(5),
        monthlyC: monthlyCost(e),

        ccl: users.localData.ccl,
        vat: users.localData.vat,
        totalCCL: (data.localData.ccl *
          (data?.localData?.aq
            + (data?.localData?.nightkwh !== undefined ? data?.localData?.nightkwh : 0)
            + (data?.localData?.ewkwh !== undefined ? data?.localData?.ewkwh : 0)
          ) / 100).toFixed(5),

        totalVAT: ((
          (e.standingCharge * 365 / 100)
          + ((e.unitRate !== undefined ? e.unitRate : 0) * (data?.localData?.aq !== undefined ? data?.localData?.aq : 0) / 100)
          + ((e.nightRate !== "" && e.nightRate !== null && e.nightRate !== undefined ? e.nightRate : 0) * (data?.localData?.nightkwh !== undefined ? data?.localData?.nightkwh : 0) / 100)
          + ((e.ewRate !== "" && e.ewRate !== null && e.ewRate !== undefined ? e.ewRate : 0) * (data?.localData?.ewkwh !== undefined ? data?.localData?.ewkwh : 0) / 100)
          + ((data?.localData?.ccl * (data?.localData?.aq
            + (data?.localData?.nightkwh !== undefined ? data?.localData?.nightkwh : 0)
            + (data?.localData?.ewkwh !== undefined ? data?.localData?.ewkwh : 0)
          ))
            / 100)
        ) * (data?.localData?.vat) / 100).toFixed(5),

        totalVatCcl: (
          (data.localData.ccl *
            (data.localData.aq
              + (data?.localData?.nightkwh !== undefined ? data?.localData?.nightkwh : 0)
              + (data?.localData?.ewkwh !== undefined ? data?.localData?.ewkwh : 0))
            / 100) +
          ((
            (e.standingCharge * 365 / 100)
            + ((e.unitRate !== undefined ? e.unitRate : 0) * (data?.localData?.aq !== undefined ? data?.localData?.aq : 0) / 100)
            + ((e.nightRate !== "" && e.nightRate !== null && e.nightRate !== undefined ? e.nightRate : 0) * (data?.localData?.nightkwh !== undefined ? data?.localData?.nightkwh : 0) / 100)
            + ((e.ewRate !== "" && e.ewRate !== null && e.ewRate !== undefined ? e.ewRate : 0) * (data?.localData?.ewkwh !== undefined ? data?.localData?.ewkwh : 0) / 100)
            + ((data?.localData?.ccl * (data?.localData?.aq
              + (data?.localData?.nightkwh !== undefined ? data?.localData?.nightkwh : 0)
              + (data?.localData?.ewkwh !== undefined ? data?.localData?.ewkwh : 0)
            ))
              / 100)
          ) * (data?.localData?.vat) / 100)).toFixed(5),
      })),
    }

    var document = {
      html: html,
      data: {
        users: users,
        prices: prices,
      },
      path: "./price.pdf"
    }

    var options = {
      format: "A3",
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

  async QuoteDropdownList(req: Request, res: Response) {
    try {
      let CompanyIDs: any = [];
      let filter: any = {};
      const { query } = req;
      if (query.isActive) filter.isActive = 1;

      filter.isDelete = { $in: [false, 0] };

      if (["Partner", "Sales Rep", "Observing Partner"].includes(req.user.role.roleName)) {
        const companyResult = await CompanyModel.find({ Assignee: { $in: req.user._id } });
        companyResult.map((s) => { CompanyIDs.push(String(s._id)) });
      }
      if (req.query.Company) filter.Company = req.query.Company;

      const dataQuery = QuoteModel.find(filter);
      dataQuery
        .sort({ createdAt: -1 })
        .select("QuoteID Company");

      const quotes = await dataQuery.exec();
      const countQuery = await QuoteModel.countDocuments(filter);
      res.send({ data: quotes, count: countQuery, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async listOfQuotes(req: Request, res: Response) {
    try {
      let CompanyIDs: any = [];
      let ConsumerIDs: any = [];
      let filter: any = {};
      let filterBeforeLookup: any = {};
      let monthAndYear: any = {};
      const { query } = req;

      if (query.isActive) filter.isActive = 1;
      if (query.blockedBy) filter.BlockedBy = req.user._id.toString();
      if (req.query.isDelete) filter.isDelete = true;
      else filter.isDelete = { $in: [false, 0] };

      if (req.query.Partner) {
        const companyResult = await CompanyModel.find({ Assignee: { $in: req.query.Partner } });
        companyResult.map((s) => { CompanyIDs.push(ObjectId(s._id)) });

        const cr = await UserModel.find({ Assignee: { $in: req.query.Partner } });
        cr.map((s) => { ConsumerIDs.push(ObjectId(s._id)) });

        filterBeforeLookup.$or = [
          { Company: { $in: CompanyIDs } },
          { Consumer: { $in: ConsumerIDs } }
        ];
      }

      if (['Partner', 'Sales Rep', 'Observing Partner', 'Service Partner'].includes(req.user.role.roleName)) {
        filterBeforeLookup.Assignee = { $in: [req.user._id] };
      }
      let typeNumOfQuoteStatus = [];
      if (typeof req.query.quoteStatus === 'object') {
        typeNumOfQuoteStatus = req.query.quoteStatus.map(e => Number(e));
      }
      if (req.query?.commissionStatus) {
        filterBeforeLookup.commissionStatus = req.query.commissionStatus
      }

      if (req.query.quoteStatus && typeof req.query.quoteStatus === 'string') filter.quoteStatus = { $in: [req.query.quoteStatus, Number(req.query.quoteStatus)] };
      if (req.query.month) monthAndYear.month = Number(req.query.month);
      if (req.query.year) monthAndYear.year = Number(req.query.year);
      if (req.query.quoteStatus && typeof req.query.quoteStatus === 'object') filter.quoteStatus = { $in: [...req.query.quoteStatus, ...typeNumOfQuoteStatus] };
      if (req.query.quoteService && typeof req.query.quoteService === 'string') filter.serviceType = { $in: [req.query.quoteService] };
      if (req.query.quoteService && typeof req.query.quoteService === 'object') filter.serviceType = { $in: req.query.quoteService };
      if (req.query.subServiceType) {
        if (typeof req.query.subServiceType === 'string') {
          filter.subServiceType = { $in: [req.query.subServiceType] }
        } else if (Array.isArray(req.query.subServiceType)) {
          filter.subservice = { $in: req.query.subServiceType }
        }
      }
      if (req.query.Company) filterBeforeLookup.Company = ObjectId(req.query.Company);
      if (req.query.Consumer) filterBeforeLookup.Consumer = ObjectId(req.query.Consumer);
      if (req.query.Supplier) {
        filterBeforeLookup.Supplier = ObjectId(req.query.Supplier);
        filter.quoteStatus = '1002';
      }
      if (req.query.DataOf && typeof req.query.DataOf === 'string') filter[req.query.DataOf] = { $exists: true };
      if (req.query.DataOf && typeof req.query.DataOf === 'object') {
        filter.$or = [];
        req.query.DataOf.filter(v => {
          let d: any = {};
          d[v] = { $exists: true };
          filter.$or.push(d)
        })
      }
      if (req.query.installerType) {
        if (Array.isArray(req.query.installerType)) {
          filter.installerType = { $in: req.query.installerType }
        } else {
          filter.installerType = { $in: [req.query.installerType] }

        }
      }
      commonUtils.dateFilter(req, filter, {});
      if (req.query.Search) {
        filter.$or = [
          { QuoteID: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          { "Company.businessName": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
          { "Consumer.firstName": { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        ];
      }

      let sortObj: any = { updatedAt: 1 };
      if (req.query.sort) sortObj = { [req.query.sort]: req.query.sortType === 'asc' ? 1 : -1 };
      let skipNumber = 0;
      let limitNumber = 99;
      if (req.query.skip) skipNumber = Number(req.query.skip);
      if (req.query.limit) limitNumber = Number(req.query.limit);

      if (req.path.includes("/count")) {
        const count = await QuoteModel.aggregate([
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
            $project: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
              quoteStatus: 1,
              serviceType: 1,
              isDelete: 1
            }
          },
          { $match: filter },
          { $match: monthAndYear },
          { $count: "count" }
        ]);

        let countData = 0;
        if (count.length > 0) {
          countData = count[0].count;
        }

        res.send({ count: countData, success: true });
      } else {
        const dataQuery = QuoteModel.aggregate([
          { $sort: sortObj },
          { $match: filterBeforeLookup },
          {
            $lookup: {
              from: 'users',
              localField: 'User',
              foreignField: '_id',
              as: 'User'
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
              from: 'sites',
              localField: 'Site',
              foreignField: '_id',
              as: 'Site'
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
              "path": "$Assignee",
              "preserveNullAndEmptyArrays": true
            }
          },
          { $match: filter },
          { $skip: skipNumber },
          {
            $project: {
              QuoteID: 1,
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
              serviceType: 1,
              subServiceType: 1,
              quoteStatus: 1,
              "Site.siteName": 1,
              isActive: 1,
              createdAt: 1,
              "Assignee.name": 1,
              "Company.businessName": 1,
              "Consumer.firstName": 1,
              "Consumer.surName": 1,
              "Scaffolders": 1,
              "Roofers": 1,
              "Electricians": 1,
              "Gas Engineers": 1,
              "Cavity Wall Installer": 1,
              "Under Floor Installer": 1,
              "Loft Installer": 1,
              "Ventilation Installer": 1,
              "Internal Wall Insulation": 1,
              "External Wall Insulation": 1,
              "Room In Roof Installer": 1,
              "ASHP Installer": 1,
            }
          },
          { $match: monthAndYear },
          { $limit: limitNumber }
        ]);

        const quotes = await dataQuery.exec();
        res.send({ data: quotes, count: 0, success: true });
      }
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async QuoteProvided(req: Request, res: Response) {
    try {
      const quote = await QuoteModel.findById(req.params.quote_id);
      let negotiation = quote;

      let status = 0;
      if (Number(req.body.negotiation.QuoteStatus) === 1000) {
        status = QuoteStatus.quoteStatus.quoteProvided;
      } else if (Number(req.body.negotiation.QuoteStatus) === 1012) {
        status = QuoteStatus.quoteStatus.RevisedSupplierRates;
      } else {
        status = QuoteStatus.quoteStatus.revisedQuoteProvided;
      }
      negotiation.quoteStatus = status;
      negotiation.quotePrice = req.body.negotiation.Amount;
      negotiation.notes = req.body.negotiation.Notes;
      negotiation.contractLength = req.body.negotiation.ContractLength;
      negotiation.expiryDate = req.body.negotiation.ExpiryDate;

      if (req.body.negotiation.serviceType === 'ChipAndPin') {
        negotiation.service.chipAndPin.contract_length = req.body.negotiation.ContractLength;
      } else {
        negotiation.service[req.body.negotiation.serviceType.toLowerCase()].contract_length = req.body.negotiation.ContractLength;
      }

      await QuoteModel.updateOne({ _id: req.params.quote_id }, negotiation);

      const history = new HistoryModule();
      history.QuoteActionHistory(req.params.quote_id, status, req.body.negotiation, req);

      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminQuoteUpdateInvoiceDetails(req: Request, res: Response) {
    try {
      let quoteInfo = await QuoteModel.findById(req.body.QuoteID);
      const update: any = {};
      quoteInfo.StatusHistory = quoteInfo.StatusHistory
      if (req.files.Invoice) quoteInfo.Invoiced = req.files.Invoice[0].location

      quoteInfo.quoteStatus = QuoteStatus.quoteStatus.quoteInvoiced;
      quoteInfo.isLiveDateProvided = true;
      quoteInfo.service[req.body.service].contract_start_date = new Date(Number(req.body.contractLengthDate)).getTime();
      quoteInfo.service[req.body.service].contract_end_date = new Date(new Date(new Date(Number(req.body.contractLengthDate)).setMonth(new Date(Number(req.body.contractLengthDate)).getMonth() + commonUtils.getMonthFromLength(quoteInfo.service[req.body.service].contract_length))).getTime() - (24 * 60 * 60 * 1000)).getTime();
      quoteInfo.contractLengthDate = new Date(new Date(new Date(Number(req.body.contractLengthDate)).setMonth(new Date(Number(req.body.contractLengthDate)).getMonth() + commonUtils.getMonthFromLength(quoteInfo.service[req.body.service].contract_length))).getTime() - (24 * 60 * 60 * 1000)).getTime();
      if (quoteInfo?.isCreatedByServicePartner)
        quoteInfo.commissionStatus = 'Outstanding';
      await quoteInfo.save();

      if (quoteInfo.serviceType !== 'Debt') {
        const linkedRenewal = await RenewalModel.findOne({ LinkedQuote: req.body.QuoteID });
        linkedRenewal.service[req.body.service] = quoteInfo.service[req.body.service];
        await linkedRenewal.save();
      }

      const history = new HistoryModule();
      history.QuoteActionHistory(req.body.QuoteID, QuoteStatus.quoteStatus.quoteInvoiced, {}, req);

      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminDeleteQuote(req: Request, res: Response) {
    try {
      await QuoteModel.deleteOne({ _id: req.params.quote_id });
      await RenewalModel.deleteMany({ LinkedQuote: req.params.quote_id })

      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminRejectQuoteDeleteRequest(req: Request, res: Response) {
    try {
      await QuoteModel.updateOne(
        {
          _id: req.params.quote_id,
        },
        {
          isBlock: 0,
          isDelete: 0,
        }
      );
      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminDeleteQuoteRequest(req: Request, res: Response) {
    try {
      await QuoteModel.updateOne(
        {
          _id: req.params.quote_id,
        },
        {
          isBlock: 0,
          isDelete: 1,
        }
      );
      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminBlockQuote(req: Request, res: Response) {
    try {
      await QuoteModel.updateOne(
        {
          _id: req.params.quote_id,
        },
        {
          isBlock: 1,
          isActive: 0,
          BlockedBy: req.user._id,
        }
      );

      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminUnBlockQuote(req: Request, res: Response) {
    try {
      await QuoteModel.updateOne(
        {
          _id: req.params.quote_id,
        },
        {
          isBlock: 0,
          isActive: 1,
        }
      );

      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async UpdateAssigneeRegUser(req: Request, res: Response) {
    try {
      await QuoteModel.findByIdAndUpdate(req.body.QuoteID, { Assignee: req.body.Assignee });
      await RenewalModel.updateMany({ LinkedQuote: req.body.QuoteID }, { Assignee: req.body.Assignee });

      let quote = await QuoteModel.findOne({ _id: req.body.QuoteID });

      let autoTask = new TaskModel();
      autoTask.Title = `QUOTE FOLLOW UP TASK ${quote.QuoteID} ${quote.serviceType}`;
      autoTask.Description = `Autogenerated following task`;
      autoTask.Priority = 'Normal';
      autoTask.Status = '1000'
      autoTask.TaskOn = "Quote";
      autoTask.Quote = req.body.QuoteID;
      if (quote?.Company)
        autoTask.Company = quote.Company
      if (quote?.Consumer)
        autoTask.Consumer = quote.Consumer;
      if (req.body.Assignee) {
        autoTask.Assignee = req.body.Assignee
      } else if (quote?.Assignee) {
        autoTask.Assignee = quote.Assignee
      }
      autoTask.createdBy = req.user._id;

      autoTask.DueDate = new Date().setDate(new Date().getDate() + 1);
      autoTask.Time = new Date().setDate(new Date().getDate() + 1);

      await autoTask.save();
      const Assignee = await UserModel.findById(req.body.Assignee).select('name');

      if (quote?.serviceType === "Energy" && quote?.service?.energy?.contractReviewOption) {
        let newTask = new TaskModel();
        newTask.Title = `DOMETIC RENEWAL ${quote.QuoteID}`;
        newTask.Description = `RENEWAL DUE`;
        newTask.Priority = 'Normal';
        newTask.Status = '1000'
        newTask.TaskOn = "Quote";
        newTask.Quote = req.body.QuoteID;
        if (quote?.Company)
          newTask.Company = quote.Company
        if (quote?.Consumer)
          newTask.Consumer = quote.Consumer;
        if (req.body.Assignee) {
          newTask.Assignee = req.body.Assignee
        } else if (quote?.Assignee) {
          newTask.Assignee = quote.Assignee
        }
        newTask.createdBy = req.user._id;

        let date;
        if (quote.service.energy.contractReviewOption == '3 Months') {
          date = new Date(quote.createdAt);
          date.setMonth(date.getMonth() + 3);
          date.setHours(11, 0, 0);

        }
        else if (quote.service.energy.contractReviewOption == '11 Months') {
          date = new Date(quote.createdAt);
          date.setMonth(date.getMonth() + 11);
          date.setHours(11, 0, 0);
        }
        newTask.DueDate = new Date(date);
        newTask.Time = new Date(date);
        await newTask.save();
      }

      const history = new HistoryModule();
      history.QuoteHistory(req.body.QuoteID, { Assignee: '' }, { Assignee: `${Assignee.name}, assignee updated` }, req);

      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async UpdateQuoteRegUser(req: Request, res: Response) { // this api also updates renewal data if renewals does not have status accepted , invoiced or renewal expired
    try {
      const previousObject = await QuoteModel.findById(req.body.quoteId);
      await QuoteModel.findByIdAndUpdate(req.body.quoteId, req.body);
      const history = new HistoryModule();
      if (req.body.Supplier && req.body.Supplier.length > 0 && String(previousObject.Supplier) !== String(req.body.Supplier)) {
        const Supplier = await SupplierModel.findById(req.body.Supplier);
        history.QuoteHistory(req.body.quoteId, { Supplier: '' }, { Supplier: `${Supplier.supplierName}, supplier updated` }, req);
      } else if (req.body.isDelete !== undefined) {
        history.QuoteHistory(req.body.quoteId, { isDelete: true }, { isDelete: false }, req);
      } else if (req.body?.commissionPercentage || req.body?.commissionPrice || req.body?.commissionStatus) {
        history.QuoteHistory(req.body.quoteId, previousObject, req.body, req)
      } else if (req.body.service) {
        history.QuoteHistory(req.body.quoteId, previousObject.service[req.body.serviceTypeName], req.body.service[req.body.serviceTypeName], req, req.body.serviceTypeName);
      }

      const obj = new RegUserController();
      obj.ViewQuote(req, res);
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AddPaymentInfoForDebtService(req: Request, res: Response) {
    try {
      if (!req.body?.quoteId)
        throw { message: 'quoteId required' }
      if (!req.body?.payment)
        throw { message: 'payment info required' }

      let quote = await QuoteModel.findOneAndUpdate({ _id: req.body.quoteId, serviceType: 'Debt' }, { $push: { debtpayments: req.body.payment } }, { new: true })
        .populate({ path: 'Company', select: 'businessName businessType' })
        .populate({ path: 'Consumer', select: 'firstName' })
        .populate({ path: 'Assignee', select: 'email' })
      if (quote.Company && quote?.Assignee?.email) {
        commonUtils.mail.sendmail(
          quote.Assignee.email,
          commonUtils.mail.templates.DebtPaymentAdded,
          {
            company: quote.Company.businessName,
            businessType: quote.Company.businessType,
            date: moment(req.body.payment.paymentDueDate).format('DD-MM-YYYY'),
            quoteId: quote.QuoteID,
            amount: req.body.payment.amount,
            typeOfDebt: quote.service.debt.typeOfDebt
          }
        );
      } else if (quote.Consumer && quote?.Assignee?.email) {
        commonUtils.mail.sendmail(
          quote.Assignee.email,
          commonUtils.mail.templates.DebtPaymentAdded,
          {
            consumer: quote.Consumer.firstName,
            date: moment(req.body.payment.paymentDueDate).format('DD-MM-YYYY'),
            quoteId: quote.QuoteID,
            amount: req.body.payment.amount,
            typeOfDebt: quote.service.debt.typeOfDebt
          }
        );
      }

      if (quote?._id) {
        const rc = new RegUserController();
        rc.ViewQuote(req, res);
      }
      else
        throw { message: "Can't find a quote with Debt service" }

    } catch (err) {
      console.log(err)
      return res.send({ success: false, message: err.message })

    }
  }

  async DeletePaymentInfoForDebtService(req: Request, res: Response) {
    try {
      if (!req.body?.quoteId)
        throw { message: 'quoteId required' }
      if (!req.body?.paymentId)
        throw { message: 'paymentId required' }

      let quote = await QuoteModel.findOneAndUpdate({ _id: req.body.quoteId, serviceType: 'Debt' }, { $pull: { debtpayments: { _id: req.body.paymentId } } }, { new: true })

      if (quote?._id) {
        const rc = new RegUserController();
        rc.ViewQuote(req, res);
      }
      else
        throw { message: "Can't find a quote with Debt service" }

    } catch (err) {
      console.log(err)
      return res.send({ success: false, message: err.message })

    }
  }

  async RestartQuote(req: Request, res: Response) {
    const contractLengthConvertInMonths = {
      '3 Months': 3,
      '6 Months': 6,
      '1 Year': 12,
      '1 year': 12,
      '2 Years': 24,
      '3 Years': 36,
      '4 Years': 48,
      '5 Years': 60,
      '6 Years': 72
    }
    try {
      const dataQuery = QuoteModel.findById(req.params.quote_id);
      const updateData = await dataQuery.exec();

      const updatingData = {
        quoteStatus: "1000",
        contractLengthDate: new Date(new Date(new Date().setMonth(new Date().getMonth() + contractLengthConvertInMonths[updateData.contractLength])).getTime())
      };

      await QuoteModel.findByIdAndUpdate(req.params.quote_id, updatingData);

      const UpdateQuote = QuoteModel.findById(req.params.quote_id);
      const data = await UpdateQuote
        .populate("Site User Lead Supplier Assignee")
        .populate({
          path: "Company",
          populate: {
            path: "Site",
            populate: {
              path: "User",
            },
          },
        });
      return res.send({ success: true, data });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DeleteMultiQuote(req: Request, res: Response) {
    try {
      await req.body.deleteIds.forEach(async (element) => {
        await TaskModel.remove({ Quote: element });
        await QuoteModel.remove({ _id: element });
      });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async RejectMultiQuote(req: Request, res: Response) {
    try {
      await QuoteModel.updateMany({ _id: { $in: req.body.deleteIds } }, { isDelete: false });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }
}

class ManagementController { }

class PartnerController {

  isLengthLessThen180 = (data) => ["3 Months", "6 Months", "12 months", "1 Year", "1 year"].includes(data);

  async QuoteDeleteRequestByPI(req: Request, res: Response) {
    try {
      let QuoteInformation: QuoteInterface, adminInformation: UserInterface;
      QuoteInformation = await QuoteModel.findByIdAndUpdate({ _id: req.body.id }, { isDelete: true });

      adminInformation = await UserModel.findOne({ role: "5d5b91e01c9d440000c9990f" });
      commonUtils.mail.sendmail(
        adminInformation.email,
        commonUtils.mail.templates.DeleteRequestForQuote,
        {
          AdminName: adminInformation.name,
          QuoteID: QuoteInformation.QuoteID,
        }
      );

      const history = new HistoryModule();
      history.QuoteHistory(req.body.id, { isDelete: false }, { isDelete: true }, req);

      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async QuoteBlockUnBlockByPI(req: Request, res: Response) {
    try {
      await QuoteModel.findByIdAndUpdate(req.body.id, {
        isBlock: req.body.BlockStatus,
        BlockedBy: req.user._id,
      });
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async InvoiceDownloadByPI(req: Request, res: Response) {
    try {
      const result = await QuoteModel.findOne({
        _id: req.params.quote_id,
      });
      if (result.Invoiced !== undefined && result.Invoiced) {
        res.download(
          path.join(__dirname, "../uploads/", result.Invoiced),
          result.Invoiced
        );
      } else {
        res.send({ msg: "Invoice not found", success: false });
      }
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }
}

class RegUserController {
  async QuoteDropdownList(req: Request, res: Response) {
    try {
      let CompanyIDs: any = [];
      let filter: any = {};
      const { query } = req;
      if (query.isActive) filter.isActive = 1;
      if (["Partner", "Sales Rep", "Observing Partner"].includes(req.user.role.roleName)) {
        const companyResult = await CompanyModel.find({ Assignee: { $in: req.user._id } });
        companyResult.map((s) => { CompanyIDs.push(String(s._id)) });
        filter.Company = { $in: CompanyIDs };
      }
      filter.isDelete = { $in: [false, 0] };

      if (req.query.Company) filter.Company = req.query.Company;

      const dataQuery = QuoteModel.find(filter);
      dataQuery
        .sort({ createdAt: -1 })
        .select("QuoteID Company");

      const quotes = await dataQuery.exec();
      const countQuery = await QuoteModel.countDocuments(filter);
      res.send({ data: quotes, count: countQuery, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async RevisedSupplier(req: Request, res: Response) {
    try {
      let QuoteUpdateObject: any = {};
      QuoteUpdateObject.quoteStatus = 1012
      QuoteUpdateObject.$push = {
        StatusHistory: {
          User: req.user._id,
          status: 1012,
          notes: "",
          timestamps: new Date().getTime(),
        },
      };
      await QuoteModel.updateOne(
        {
          _id: req.body.QuoteID,
        },
        QuoteUpdateObject
      );
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async QuoteActions(req: Request, res: Response) {
    try {
      const regUser = new RegUserController();
      let QuoteUpdateObject: any = {};

      const isRenewalCreating = Number(req.body.quoteStatus) === 1002;
      QuoteUpdateObject.quoteStatus = req.body.quoteStatus;
      if (req.body?.service?.eco?.subservice?.solar?.depositAmount) {
        QuoteUpdateObject['service.eco.subservice.solar.depositAmount'] = req.body.service.eco.subservice.solar.depositAmount
      }
      if (req.body?.service?.eco?.subservice?.solar?.depositDate) {
        QuoteUpdateObject['service.eco.subservice.solar.depositDate'] = req.body.service.eco.subservice.solar.depositDate
      }
      if (Number(req.body.quoteStatus) === 1002 && !Boolean(req.body.isLiveDateProvided)) {
        if (req.body.contractAcceptDate)
          QuoteUpdateObject.contractAcceptDate = req.body.contractAcceptDate;
      }
      if (isRenewalCreating) QuoteUpdateObject.IsRenewalCreated = 1;
      await QuoteModel.updateOne({ _id: req.body.QuoteID }, QuoteUpdateObject);

      const history = new HistoryModule();
      history.QuoteActionHistory(req.body.QuoteID, req.body.quoteStatus, req.body, req);

      if (isRenewalCreating) {
        const renewResult = await RenewalModel.findOne().sort({ createdAt: -1 }).exec();
        let a = [0, 999]
        if (renewResult) a = renewResult.RenewalID.split("-");
        let nextRenewalID = Number(a[1]) + 1;
        const RE_QuoteInformation = await QuoteModel.findOne({ _id: req.body.QuoteID }).exec();
        let data: any = {};
        data.RenewalID = `REN-${nextRenewalID}`;
        data.LinkedQuote = RE_QuoteInformation._id;
        if (Boolean(RE_QuoteInformation.Company)) data.Company = RE_QuoteInformation.Company;
        if (Boolean(RE_QuoteInformation.Consumer)) data.Consumer = RE_QuoteInformation.Consumer;
        data.Site = RE_QuoteInformation.Site;
        data.Supplier = RE_QuoteInformation.Supplier;
        data.serviceType = RE_QuoteInformation.serviceType;
        if (RE_QuoteInformation.Assignee)
          data.Assignee = RE_QuoteInformation.Assignee;
        data.service = RE_QuoteInformation.service;
        data.contractLength = RE_QuoteInformation.contractLength;
        data.contractLengthDate = null;
        data.Price = RE_QuoteInformation.quotePrice;
        data.createdBy = req.user._id;
        data.Status = QuoteStatus.RenewalStatus.LivePending;
        if (RE_QuoteInformation.serviceType !== 'Debt' && RE_QuoteInformation.serviceType !== 'Eco') {
          const newRenewal = new RenewalModel(data);

          const history = new HistoryModule();
          history.RenewalHistory(newRenewal._id, { Create: '' }, { Create: 'Renewal created' }, req);

          await newRenewal.save();

        }
        if (data?.Supplier && data?.Company && req?.body?.QuoteID && Number(req.body.quoteStatus) === 1002 && (data.serviceType == "Gas" || data.serviceType == "Electric")) {
          let paymentHistoryObj = new PaymentHistoryController()
          let paymentObj = {}
          paymentObj['body'] = {
            supplierId: data.Supplier,
            companyId: data.Company,
            quoteId: req.body.QuoteID,
            uplift: (RE_QuoteInformation.uplift) || 0.5,   // default set to 0.5
            contractAcceptDate: req.body.contractAcceptDate
          }
          if (data.serviceType === "Gas") {
            paymentObj['body']['service'] = "Gas",
              paymentObj['body']['gasAq'] = data.service['gas'].kWH
            paymentObj['body']['gasUnitRate'] = Number(data.service['gas']['unitRate'])

          }
          if (data.serviceType == "Electric") {
            paymentObj['body']['service'] = "Electric"
            paymentObj['body']['electricUnitRates'] = {}
            paymentObj['body']['electricAq'] = {}
            paymentObj['body']['electricUnitRates']["unitDayRate"] = (!data.service['electric']["unitDayRate"] && isNaN(data.service['electric']["unitDayRate"])) ? null : Number(data.service['electric']["unitDayRate"])
            paymentObj['body']['electricAq']["unitDaykWh"] = (!data.service['electric']["unitDaykWh"] && isNaN(data.service['electric']["unitDaykWh"])) ? null : Number(data.service['electric']["unitDaykWh"])
            paymentObj['body']['electricUnitRates']["unitNightRate"] = (!data.service['electric']["unitNightRate"] && isNaN(data.service['electric']["unitNightRate"])) ? null : Number(data.service['electric']["unitNightRate"])
            paymentObj['body']['electricAq']["unitNightkWH"] = (!data.service['electric']["unitNightkWH"] && isNaN(data.service['electric']["unitNightkWH"])) ? null : Number(data.service['electric']["unitNightkWH"])
            paymentObj['body']['electricUnitRates']["unitWkdRate"] = (!data.service['electric']["unitWkdRate"] && isNaN(data.service['electric']["unitWkdRate"])) ? null : Number(data.service['electric']["unitWkdRate"])
            paymentObj['body']['electricAq']["unitWkdkWh"] = (!data.service['electric']["unitWkdkWh"] && isNaN(data.service['electric']["unitWkdkWh"])) ? null : Number(data.service['electric']["unitWkdkWh"])

            Object.keys(paymentObj['body']['electricUnitRates']).forEach(key => {
              if (paymentObj['body'][key] === null)
                delete paymentObj['body'][key]
            })
            Object.keys(paymentObj['body']['electricAq']).forEach(key => {
              if (paymentObj['body'][key] === null)
                delete paymentObj['body'][key]
            })
          }
          await paymentHistoryObj.Reguser.addHistoryFunc(paymentObj)
        }
        res.send({ success: true });

      } else {
        res.send({ success: true });
      }
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async createRenewalFromQuote(req: Request, res: Response) {
    try {
      let quote = await QuoteModel.findOne({ _id: req.body.QuoteID }).select('quoteStatus');
      if (quote.quoteStatus == 1008 || quote.quoteStatus == 1009 || quote.quoteStatus == "1008" || quote.quoteStatus == "1009") {
        return res.send({ success: true, message: 'Quote is expired or in DND , please create new quote' })
      }
      let renewal = await RenewalModel.findOne({ LinkedQuote: req.body.QuoteID });
      if (renewal) {
        return res.send({ success: true, message: `Renewal for this quote already exists with id : ${renewal.RenewalID}.` })
      }
      if (quote.quoteStatus == 1002 || quote.quoteStatus == '1002' || quote.quoteStatus == 1004 || quote.quoteStatus == "1004" || quote.quoteStatus == 1008 || quote.quoteStatus == '1008') {

        if (renewal) {
          return res.send({ success: true, message: `Renewal for this quote already exists with id : ${renewal.RenewalID}.` })
        } else {
          const regUser = new RegUserController();
          const renewResult = await RenewalModel.findOne().sort({ createdAt: -1 }).exec();
          let a = [0, 999]
          if (renewResult) a = renewResult.RenewalID.split("-");
          let nextRenewalID = Number(a[1]) + 1;
          const RE_QuoteInformation = await QuoteModel.findOne({ _id: req.body.QuoteID }).exec();
          if (RE_QuoteInformation.serviceType === 'Eco' || RE_QuoteInformation.serviceType === 'Debt') {
            return res.send({ success: true, message: `Renewal for this quote can't be created.` });
          }
          let data: any = {};
          data.RenewalID = `REN-${nextRenewalID}`;
          data.LinkedQuote = RE_QuoteInformation._id;
          if (Boolean(RE_QuoteInformation.Company)) data.Company = RE_QuoteInformation.Company;
          if (Boolean(RE_QuoteInformation.Consumer)) data.Consumer = RE_QuoteInformation.Consumer;
          data.Site = RE_QuoteInformation.Site;
          data.Supplier = RE_QuoteInformation.Supplier;
          data.serviceType = RE_QuoteInformation.serviceType;
          data.service = RE_QuoteInformation.service
          if (RE_QuoteInformation.Assignee)
            data.Assignee = RE_QuoteInformation.Assignee;
          data.contractLength = RE_QuoteInformation.contractLength;
          data.contractLengthDate = null;
          data.Price = RE_QuoteInformation.quotePrice;
          data.createdBy = req.user._id;
          data.Status = QuoteStatus.RenewalStatus.LivePending;
          const newRenewal = new RenewalModel(data);

          await newRenewal.save();
          return res.send({ success: true, message: `Renewal REN-${nextRenewalID} created successfully.` })
        }
      }
      else {
        return res.send({ success: false, message: 'Please accept quote or confirm rates first , then you can create renewal.' })
      }
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async CreateQuote(req: Request, res: Response) {
    try {
      const reqBody = req.body.quoteData
      let quoteData: any = {};
      if (reqBody.renewal !== undefined && reqBody.renewal && Number(reqBody.renewal) === 1) {
        await QuoteModel.findByIdAndUpdate({ _id: reqBody.previousQuoteId }, { isRenewal: 1 });
      }
      if (reqBody) quoteData = reqBody;
      if (reqBody.Consumer !== undefined && reqBody.Consumer) {
        const ConsumerInfo = await UserModel.findOne({ _id: reqBody.Consumer });
        let count = await QuoteModel.find({ Consumer: reqBody.Consumer }).countDocuments();
        quoteData.QuoteID = `Q${(Number(count) + 1)}-${ConsumerInfo.consumerId}`;
      } else {
        const CompanyInfo = await CompanyModel.findOne({ _id: reqBody.Company });
        let count = await QuoteModel.find({ Company: reqBody.Company }).countDocuments();
        quoteData.QuoteID = `Q${(Number(count) + 1)}-${CompanyInfo.companyID}`;
      }

      if (req.user && ["Partner", "Sales Rep", "Service Partner"].includes(req.user.role.roleName)) {
        quoteData.Assignee = req.user._id;
      }

      quoteData.createdBy = req.user._id;

      if (reqBody.serviceType !== 'SolarPaid')
        quoteData.uplift = reqBody.service && reqBody.serviceType && reqBody.service[reqBody.serviceType.toLowerCase()].uplift || 0.5;
        
      quoteData.StatusHistory = {
        User: req.user._id,
        status: QuoteStatus.quoteStatus.newQuote,
        notes: "",
        timestamps: new Date().getTime(),
      };
      quoteData.quoteStatus = QuoteStatus.quoteStatus.newQuote;

      if (reqBody.Creator && (reqBody.Creator === "sales_rep" || reqBody.Creator === "partner")) {
        quoteData.User = [req.user._id];
      } else {
        if (reqBody.User) quoteData.User = reqBody.User;
      }

      quoteData.quoteStatus = QuoteStatus.quoteStatus.newQuote;
      const newQuote = new QuoteModel(quoteData);
      const QuoteInformation = await newQuote.save();
      const history = new HistoryModule();
      history.QuoteHistory(QuoteInformation._id, { Create: '' }, { Create: `Quote created` }, req);

      if (reqBody.Company || reqBody.Consumer) {
        let obj: any = {}
        if (reqBody.Company !== undefined && reqBody.Company) obj.CompanyID = reqBody.Company
        if (reqBody.Consumer !== undefined && reqBody.Consumer) obj.ConsumerID = reqBody.Consumer
        obj.QuoteID = QuoteInformation._id
        obj.QuoteEmailType = "QuoteCreated"
        if (["Partner", "Sales Rep"].includes(req.user.role.roleName)) {
          obj.IntroducerID = reqBody.User && reqBody.User[0]
          obj.Status = 2000
        } else {
          obj.Status = 2001
        }
        // commonUtils.SendMailToAllQuoteUser(obj).then(() => { });
      }
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async createDuplicateQuote(req: Request, res: Response) {
    try {
      let currentQuote = await QuoteModel.findOne({ _id: req.body.QuoteID }).lean();
      let duplicateQuote: any = {};

      if (currentQuote.Consumer !== undefined && currentQuote.Consumer) {
        const ConsumerInfo = await UserModel.findOne({ _id: currentQuote.Consumer });
        let count = await QuoteModel.find({ Consumer: currentQuote.Consumer }).countDocuments();
        duplicateQuote.QuoteID = `Q${(Number(count) + 1)}-${ConsumerInfo.consumerId}`;
        duplicateQuote.Consumer = currentQuote.Consumer;
      } else {
        const CompanyInfo = await CompanyModel.findOne({ _id: currentQuote.Company });
        let count = await QuoteModel.find({ Company: currentQuote.Company }).countDocuments();
        duplicateQuote.QuoteID = `Q${(Number(count) + 1)}-${CompanyInfo.companyID}`;
        duplicateQuote.Company = currentQuote.Company;
        duplicateQuote.Site = currentQuote.Site;
      }
      if (currentQuote.Assignee) {
        duplicateQuote.Assignee = currentQuote.Assignee;
      }
      duplicateQuote.createdBy = currentQuote.createdBy;
      duplicateQuote.service = {};
      if (!currentQuote.service) {
        throw { success: false, message: "Please fill all service data first." }
      }
      if (currentQuote.serviceType == 'ChipAndPin') {
        duplicateQuote.service.chipAndPin = currentQuote.service.chipAndPin

      } else {
        duplicateQuote.service[currentQuote.serviceType.toLowerCase()] = currentQuote.service[currentQuote.serviceType.toLowerCase()]
      }
      duplicateQuote.serviceType = currentQuote.serviceType;
      duplicateQuote.Notes = currentQuote.Notes;
      duplicateQuote.contractLength = currentQuote.contractLength;
      duplicateQuote.Supplier = currentQuote.Supplier;
      duplicateQuote.quoteStatus = QuoteStatus.quoteStatus.newQuote;
      duplicateQuote.User = currentQuote.User;

      const newQuote = new QuoteModel(duplicateQuote);
      const QuoteInformation = await newQuote.save();
      const history = new HistoryModule();
      history.QuoteHistory(QuoteInformation._id, { Create: '' }, { Create: `Quote created` }, req);

      res.send({ success: true, message: `Duplicate quote created with id:${duplicateQuote.QuoteID}` });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async ViewQuote(req: Request, res: Response) {
    try {
      let id = ''
      if (req.body.id) id = req.body.id;
      else if (req.body.quoteId) id = req.body.quoteId
      else id = req.params.quote_id;
      const dataQuery = QuoteModel.findById(id);
      const dataResult = await dataQuery
        // .populate("Site User Lead Supplier Assignee StatusHistory.User Notes.addedBy createdBy", "siteName siteAddress postcode name email supplierName leadId avatar")
        .populate("User Lead Supplier Assignee StatusHistory.User Notes.addedBy createdBy", "name email supplierName leadId avatar")
        .populate({
          path: "Assignee",
          select: 'name email isActive',
          populate: {
            path: "role",
            select: 'roleName'
          }
        })
        .populate({
          path: "Site",
          select: "siteName siteAddress postcode town city country gas electric water chipandpin",
          populate: {
            path: "User",
            select: "name email jobTitle DOB nationalInsurance homeAddress previousAddress previousAddressYear phone mobile"
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
          select: "-documents -city_list -Site -Notes -Lead ",
          populate: {
            path: "Assignee",
            select: "name email isActive"
          },
        })
        .populate([
          { path: 'service.eco.surveyAppoinment', populate: [{ path: 'Booker', select: 'name email' }, { path: 'Assignee', select: 'name email' }] },
          { path: 'service.eco.scaffoldingAppoinment', populate: [{ path: 'Booker', select: 'name email' }, { path: 'Assignee', select: 'name email' }] },
          { path: 'service.eco.installationAppoinment', populate: [{ path: 'Booker', select: 'name email' }, { path: 'Assignee', select: 'name email' }] },
          { path: 'service.eco.insulationAppoinment', populate: [{ path: 'Booker', select: 'name email' }, { path: 'Assignee', select: 'name email' }] },
          { path: 'service.eco.ventilationAppoinment', populate: [{ path: 'Booker', select: 'name email' }, { path: 'Assignee', select: 'name email' }] },
          { path: 'service.eco.heatingAppoinment', populate: [{ path: 'Booker', select: 'name email' }, { path: 'Assignee', select: 'name email' }] },
          { path: 'service.eco.solarRenewablesAppoinment', populate: [{ path: 'Booker', select: 'name email' }, { path: 'Assignee', select: 'name email' }] },
        ])
        .select({
          QuoteID: 1, service: 1, isActive: 1, isBlock: 1, isDelete: 1, contractLengthDate: 1, contractLength: 1, StatusHistory: 1, QuoteHistory: 1, expiryDate: 1, serviceType: 1, subServiceType: 1, quoteStatus: 1, contractAcceptDate: 1, createdAt: 1, Notes: 1, quotePrice: 1, isLiveDateProvided: 1, docusignHistory: 1, isCreatedByServicePartner: 1, commissionPercentage: 1, commissionPrice: 1, commissionStatus: 1, debtpayments: 1, gallery: 1,
          Scaffolders: 1,
          Roofers: 1,
          Electricians: 1,
          "Gas Engineers": 1,
          "Cavity Wall Installer": 1,
          "Under Floor Installer": 1,
          "Loft Installer": 1,
          "Ventilation Installer": 1,
          "Internal Wall Insulation": 1,
          "External Wall Insulation": 1,
          "Room In Roof Installer": 1,
          "ASHP Installer": 1,
          "OpenSolarProjectId" :1,
          "OpenSolarProjectUrl": 1,
          digitalDashboard:1
        });

      res.send({ data: dataResult, success: true });
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

      await QuoteModel.updateOne({ _id: req.body.id }, { $push: { Notes: [comment] } });

      const history = new HistoryModule();
      history.QuoteHistory(req.body.id, { Comment: '' }, { Comment: 'Comment added' }, req);

      const rc = new RegUserController();
      rc.ViewQuote(req, res);
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  serviceUpdate = (data) => {
    let g: any = {};
    if (data.serviceType) {
      g = data;
      if (data.serviceType == "ChipAndPin") {
        g.service['chipAndPin'].contract_start_date = new Date(new Date(new Date(data.service["chipAndPin"].contract_start_date).setMonth(new Date(Number(data.service["chipAndPin"].contract_start_date)).getMonth() + commonUtils.getMonthFromLength(data.service["chipAndPin"].contract_length))).getTime()).getTime();
        g.service['chipAndPin'].contract_end_date = new Date(new Date(new Date(data.service["chipAndPin"].contract_end_date).setMonth(new Date(Number(data.service["chipAndPin"].contract_end_date)).getMonth() + commonUtils.getMonthFromLength(data.service["chipAndPin"].contract_length))).getTime()).getTime();
      } else {
        g.service[data.serviceType.toLowerCase()].contract_start_date = new Date(new Date(new Date(data.service[data.serviceType.toLowerCase()].contract_start_date).setMonth(new Date(Number(data.service[data.serviceType.toLowerCase()].contract_start_date)).getMonth() + commonUtils.getMonthFromLength(data.service[data.serviceType.toLowerCase()].contract_length))).getTime()).getTime();
        g.service[data.serviceType.toLowerCase()].contract_end_date = new Date(new Date(new Date(data.service[data.serviceType.toLowerCase()].contract_end_date).setMonth(new Date(Number(data.service[data.serviceType.toLowerCase()].contract_end_date)).getMonth() + commonUtils.getMonthFromLength(data.service[data.serviceType.toLowerCase()].contract_length))).getTime()).getTime();
      }
      return g.service;
      const dt = new Date(data.service[data.serviceType.toLowerCase()].contract_start_date);
      dt.setMonth(
        dt.getMonth() +
        commonUtils.getMonthFromLength(data.service[data.serviceType.toLowerCase()].contract_length)
      );
      g[data.serviceType.toLowerCase()].contract_start_date = dt.getTime();
    }
    return g;
  };

  ContractLengthUpdate = (data) =>
    new Date(
      new Date(data.contractLengthDate).setMonth(
        new Date().getMonth() +
        commonUtils.getMonthFromLength(data.contractLength)
      )
    ).getTime();
}

export default class AllControllers {
  admin: AdminController;
  management: ManagementController;
  partner: PartnerController;
  regUser: RegUserController;
  constructor() {
    this.admin = new AdminController();
    this.management = new ManagementController();
    this.partner = new PartnerController();
    this.regUser = new RegUserController();
  }
}
