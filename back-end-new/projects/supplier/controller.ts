let async = require("async");
let _ = require("lodash");
let path = require("path");
const fs = require("fs");

import SupplierModel from "../../models/Supplier";
import CompanyModel from "../../models/Company";
import UserModel from "../../models/user";
import ControllerUtils from "../../utils/ControllerUtils";
import { Request, Response } from "../../templates/commandInterface";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import aws from "../../sharedModules/smallModules/aws";
import HistoryModule from "../../sharedModules/smallModules/historyModule";

export default class SupplierController extends ControllerUtils {
  constructor() {
    super();
  }

  async addNewSupplier(req: Request, res: Response) {
    try {
      const supplyResult = await SupplierModel.findOne({ supplierName: req.body.supplierName });

      if (supplyResult != undefined) {
        if (supplyResult._id != req.body.findId) {
          return res.send({
            success: false,
            reason: "Supplier is already Exist",
            statusCode: "2311",
          });
        }
      }

      let SupplierObject: any = {};
      SupplierObject.supplierName = req.body.supplierName;
      SupplierObject.supplierType = req.body.supplierType;
      SupplierObject.products = req.body.products;
      SupplierObject.SupplierContact = req.body.SupplierContact;
      SupplierObject.createdBy = req.user._id;
      SupplierObject.serviceType = req.body.serviceType;
      SupplierObject.logo = req.body?.logo
      SupplierObject.kva = isNaN(Number(req.body?.kva) ) ? 0 : Number(req.body?.kva)
      let newSupplier = new SupplierModel(SupplierObject);
      const s = await newSupplier.save();

      const history = new HistoryModule();
      history.SupplierHistory(s._id, { Create: '' }, { Create: `${req.body.supplierName}, supplier crated` }, req);

      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async supplierList(req: Request, res: Response) {
    let filter: any = {};
    if (req.query.Search) {
      filter.supplierName = { $regex: new RegExp(["(.*)", req.query.Search, "(.*)"].join(""), "gmi") } 
    }
    if(req.query.serviceType){
      if(typeof req.query.serviceType == 'string')
        filter.serviceType={$all:[req.query.serviceType]}
      else
        filter.serviceType={$all:req.query.serviceType}
    }
    if(req.query.supplierType){
      if(typeof req.query.supplierType == 'string')
        filter.supplierType={$all:[req.query.supplierType]}
      else
        filter.supplierType={$all:req.query.supplierType}
    }

    if (req.query.isActive) filter.isActive = true;
    if (req.query.isDelete) filter.isDelete = 1;
    if (['Sales Rep'].includes(req.user.role.roleName)) {
      filter.serviceType = { $in: ['Chip and Pin', 'Renewable Energy', 'Gas', 'Electric'] }
    }

    try {
      if (req.path.includes("/count")) {
        const count = await SupplierModel.aggregate([
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

        const supplierQuery = SupplierModel.aggregate([
          { $sort: sortObj },
          { $match: filter },
          { $skip: skipNumber },
          { $limit: limitNumber }
        ]);
        const data = await supplierQuery.exec();
        res.send({ data, count: 0, success: true });
      }
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async supplierDelete(req: Request, res: Response) {
    try {
      await SupplierModel.deleteOne({
        _id: req.params.supplier_id,
      });

      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async ViewSupplierDetails(req: Request, res: Response) {
    try {
      let id = ''
      if (req.body.id) id = req.body.id
      else id = req.params.supplier_id
      const data = await SupplierModel.findById(id).populate("meterReading.addedBy documents.addedBy");
      res.send({ success: true, data });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async FetchNewReadings(req: Request, res: Response) {
    try {
      const data = await CompanyModel.findById(req.params.company_id).populate("meterReading.addedBy");
      res.send({ success: true, data });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DeleteMeterReadingDocument(req: Request, res: Response) {
    try {
      const ReadingData = await CompanyModel.findById(req.params.company_id);
      ReadingData.meterReading.filter((el) => {
        if (String(el._id) === String(req.params.document_id)) {
          el.attachment.filter((at) => {
            fs.unlink(path.join(__dirname, `../uploads/${at.value}`), () => { });
          });
          return true;
        }
      });

      await CompanyModel.update(
        { _id: req.params.company_id },
        { $pull: { meterReading: { _id: req.params.document_id } } }
      );

      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async UpdateSupplier(req: Request, res: Response) {
    try {
      const supplierResult = await SupplierModel.findOne({ supplierName: req.body.supplier.supplierName });
      if (
        supplierResult &&
        supplierResult._id != req.body.supplier.supplier_id
      ) {
        return res.send({
          success: false,
          reason: "Supplier is already Exist",
          statusCode: "2311",
        });
      }

      const previousObject = await SupplierModel.findById(req.body.supplier.supplier_id);
      await SupplierModel.findOneAndUpdate({ _id: req.body.supplier.supplier_id }, req.body.supplier);

      const history = new HistoryModule();
      history.SupplierHistory(req.body.supplier.supplier_id, previousObject, req.body.supplier, req);

      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async removeLogo(req:Request,res:Response){
    try {
        if(!req.body?.supplierId){
          throw {message: "supplierId required"}
        }
        if(!req.body?.logo){
          throw {message: "logo required"}
        }
        aws.deleteFileFromS3({value:req.body?.logo})
        await SupplierModel.updateOne({_id:req.body.supplierId},{logo:null})
        return res.send({success:true,message:"logo deleted successfully"})
      
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }
  async supplierBlock(req: Request, res: Response) {
    try {
      await SupplierModel.updateOne({ _id: req.params.supplier_id }, { isActive: 0 });
      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async supplierUnBlock(req: Request, res: Response) {
    try {
      await SupplierModel.updateOne({ _id: req.params.supplier_id }, { isActive: 1 });
      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async AddMeterReading(req: Request, res: Response) {
    try {

      let meter = {
        description: req.body.description,
        timestamps: new Date().getTime(),
        addedBy: req.user._id,
        service_type: req.body.service_type,
        attachment: ''
      };

      if (req.files.Attachments) {
        meter.attachment = req.files.Attachments
          .map(f => ({
            name: f.originalname,
            value: f.location,
            type: f.mimetype
          }));
      }

      if (req.body.CompanyID !== undefined && req.body.CompanyID) {
        await CompanyModel.updateOne({ _id: req.body.CompanyID }, { $push: { meterReading: [meter] } });

        const history = new HistoryModule();
        history.CompanyHistory(req.body.CompanyID, { 'Meter reading': '' }, { 'Meter reading': 'Meter reading added' }, req);

      }
      if (req.body.ConsumerID !== undefined && req.body.ConsumerID) {
        await UserModel.updateOne({ _id: req.body.ConsumerID }, { $push: { meterReading: [meter] } });

        const history = new HistoryModule();
        history.ConsumerHistory(req.body.ConsumerID, { 'Meter reading': '' }, { 'Meter reading': 'Meter reading added' }, req);
      }

      res.send({ success: true, data: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async ViewMeterReadingAttachment(req: Request, res: Response) {
    res.sendFile(
      path.join(__dirname, `../uploads/${req.params.attachment_id}`)
    );
  }

  async UploadAttachments(req: Request, res: Response) {
    res.send({ success: true });
  }

  async DownloadAttachment(req: Request, res: Response) {
    res.download(path.join(__dirname, `../uploads/${req.params.filename}`));
  }

  async SupplierContactList(req: Request, res: Response) {
    let data = await SupplierModel.findById(req.query.supplierId);
    let contactData = data.SupplierContact;
    let contactDataCount = data.SupplierContact.length;
    if (req.query.sort) {
      contactData = _.sortBy(
        contactData,
        (v) => v[req.query.sort]
      );
      if (req.query.sortType === "desc") {
        contactData = contactData.reverse();
      }
    }
    
    if (req.query.skip || req.query.limit) {
      contactData = contactData.slice(
        Number(req.query.skip),
        Number(req.query.skip) + Number(req.query.limit)
      );
    }
    res.send({ data: contactData, count: contactDataCount, success: true });
  }

  async ViewSupplierContact(req: Request, res: Response) {
    let data = await SupplierModel.findById(req.query.supplierId).select("SupplierContact");
    let sc = data.SupplierContact;
    let scd = {}
    sc.filter(s => {
      if (s.Email === req.query.contactEmail) {
        scd = s;
        return 0;
      }
    })
    res.send({ data: scd, success: true });
  }

  async SupplierContactAdd(req: Request, res: Response) {
    await SupplierModel.updateOne({ _id: req.body.supplierId }, { $push: { SupplierContact: [req.body.editData] } });

    const history = new HistoryModule();
    history.SupplierHistory(req.body.supplierId, { Create: '' }, { Create: `${req.body.editData.ContactPersonName}, contact created` }, req);
    res.send({ success: true });
  }

  async SupplierContactUpdate(req: Request, res: Response) {
    let data = await SupplierModel.findById(req.body.supplierId).select("SupplierContact");
    let sc = data.SupplierContact;
    let previousOne = {};
    sc.filter((s, index) => {
      if (s.Email === req.body.editData.previousEmail) {
        previousOne = sc[index];
        sc[index] = req.body.editData;
        return 0;
      }
    })
    await SupplierModel.updateOne({ _id: req.body.supplierId, }, { SupplierContact: sc });

    const history = new HistoryModule();
    history.SupplierHistory(req.body.supplierId, previousOne, req.body.editData, req);
    res.send({ success: true });
  }

  async SupplierContactDelete(req: Request, res: Response) {
    let data = await SupplierModel.findById(req.body.supplierId).select("SupplierContact");
    let sc = data.SupplierContact;
    sc.filter((s, index) => {
      if (s && s.Email === req.body.editData.Email) {
        sc.splice(index, 1);
        return 0;
      }
    })

    await SupplierModel.updateOne({ _id: req.body.supplierId, }, { SupplierContact: sc });

    const history = new HistoryModule();
    history.SupplierHistory(req.body.supplierId, { 'Delete': '' }, { 'Delete': `${req.body.editData.contactPersonName}, contact deleted` }, req);
    res.send({ success: true });
  }

  async AddDocument(req: Request, res: Response) {
    try {
      let documents = {
        title: req.body.description,
        timestamps: new Date().getTime(),
        addedBy: req.user._id,
        attachment: '',
        createdAt: new Date()
      };

      if (req.files && req.files.Attachments) {
        documents.attachment = req.files.Attachments
          .map(f => ({
            name: f.originalname,
            value: f.location,
            type: f.mimetype
          }));
      }

      await SupplierModel.updateOne({ _id: req.body.id }, { $push: { documents: [documents] } });

      const history = new HistoryModule();
      history.SupplierHistory(req.body.id, { 'Document': '' }, { 'Document': 'New document added' }, req);

      const rc = new SupplierController();
      rc.ViewSupplierDetails(req, res);
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async DeleteAttachments(req: Request, res: Response) {
    try {
      let Documents = await SupplierModel.findById(req.params.supplier_id);
      Documents[req.params.type].filter((el) => {
        if (String(el._id) === String(req.params.document_id)) {
          el.attachment && el.attachment.filter((at) => aws.deleteFileFromS3(at));
          return true;
        }
        return false;
      });
      await SupplierModel.update({ _id: req.params.supplier_id }, { $pull: { [req.params.type]: { _id: req.params.document_id } } });

      const history = new HistoryModule();
      history.SupplierHistory(req.params.supplier_id, { 'Document': '' }, { 'Document': 'Document deleted' }, req);

      const rc = new SupplierController();
      rc.ViewSupplierDetails(req, res);
    } catch (error) {
      res.send({ success: false, data: error });
    }
  }
}