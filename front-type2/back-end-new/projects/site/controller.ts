const async = require("async");
import SiteModel from "../../models/Site";
import commonUtils from "../../sharedModules/smallModules/commanUtils";
import CompanyModel from "../../models/Company";
import ControllerUtils from "../../utils/ControllerUtils";
import { Request, Response } from "../../templates/commandInterface";
import HistoryModule from "../../sharedModules/smallModules/historyModule";
import UserModel from "../../models/user";

class AdminController { }
class ManagementController { }
class PartnerController { }
class SalesRepController { }
class ObservingPartnerController { }
class RegUserController {
  async addSiteRegUser(req: Request, res: Response) {
    try {
      let siteDetail: any;
      const siteResult = await SiteModel.find({ company: req.body.companyId, siteName: req.body.siteName });
      if (siteResult.length > 0) {
        return res.send({
          success: false,
          reason: "Site already Exist",
          statusCode: "2311",
        });
      }
      let dynamicObj :any ={};
      if(req.body.gas){
        dynamicObj.gas=req.body.gas ;
      }
      if(req.body.electric){
        dynamicObj.electric=req.body.electric ;
      }
      if(req.body.water){
        dynamicObj.water=req.body.water ;
      }
      if(req.body.chipandpin){
        dynamicObj.chipandpin=req.body.chipandpin ;
      }
      const newSite = new SiteModel({
        siteName: req.body.siteName,
        siteAddress: req.body.siteAddress,
        firstLine: req.body.firstLine,
        secondLine: req.body.secondLine,
        town: req.body.town,
        city: req.body.city,
        country: req.body.country,
        postcode: req.body.postcode,
        company: req.body.companyId,
        User:
          req.body.contactPerson !== undefined && req.body.contactPerson
            ? req.body.contactPerson
            : [],
            ...dynamicObj
      });

      siteDetail = await newSite.save();

      let companyObject: any = {};
      if (req.body.activeOne) {
        companyObject.isActive = 1;
      } else {
        companyObject.isActive = 0;
      }
      companyObject.$push = {
        Site: [siteDetail._id],
      };
      await CompanyModel.updateOne({ _id: req.body.companyId }, companyObject);

      const history = new HistoryModule();
      history.CompanyHistory(req.body.companyId, { Create: '' }, { Create: `${req.body.siteName}, site created` }, req);

      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async editSite(req: Request, res: Response) {
    try {
      const siteResult = await SiteModel.findOne({ company: req.body.editData.companyId, siteName: req.body.editData.siteName });
      if (siteResult) {
        if (siteResult._id != req.body.findId) {
          return res.send({
            success: false,
            reason: "Site name is already Exist",
            statusCode: "2311",
          });
        }
      }

      const previousObject = await SiteModel.findById(req.body.findId);

      const obj: any = {}
      if (req.body.editData.siteName) obj.siteName = req.body.editData.siteName;
      if (req.body.editData.siteAddress) obj.siteAddress = req.body.editData.siteAddress;
      if (req.body.editData.firstLine) obj.firstLine = req.body.editData.firstLine;
      if (req.body.editData.town) obj.town = req.body.editData.town;
      if (req.body.editData.city) obj.city = req.body.editData.city;
      if (req.body.editData.country) obj.country = req.body.editData.country;
      if (req.body.editData.postcode) obj.postcode = req.body.editData.postcode;
      if (req.body.editData.User) obj.User = req.body.editData.User;
      if (req.body.editData.gas) obj.gas = req.body.editData.gas;
      if (req.body.editData.electric) obj.electric = req.body.editData.electric;
      if (req.body.editData.water) obj.water = req.body.editData.water;
      if (req.body.editData.chipandpin) obj.chipandpin = req.body.editData.chipandpin;
      await SiteModel.findByIdAndUpdate(req.body.findId, obj);

      if (req.body.editData.User) {
        const history = new HistoryModule();
        const user = await UserModel.findById(req.body.editData.User[0]).select('name');
        history.CompanyHistory(req.body.companyId, { 'Site Contact': '', siteName: previousObject.siteName }, { 'Site Contact': `${user.name}, contact updated` }, req, 'Site')
      } else {
        const history = new HistoryModule();
        history.CompanyHistory(req.body.companyId, previousObject, req.body.editData, req, 'Site')
      }

      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async listCompanySite(req: Request, res: Response) {
    try {
      let filter = {};
      filter = {
        company: req.query.companyId,
      };
      const query = SiteModel.find(filter);
      query.populate("User").select(commonUtils.projection.company.admin.list);
      commonUtils.commanFindQuery(query, req.query);
      const count = await SiteModel.countDocuments(filter);
      const data = query.exec();
      res.send({ data: data, count: count, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async viewSite(req: Request, res: Response) {
    try {
      const data = await SiteModel.findById(req.params.id).populate("User", "name");
      return res.send({ data, success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async deleteSite(req: Request, res: Response) {
    try {
      const site = await SiteModel.findById(req.body.id);
      await SiteModel.deleteOne({ _id: req.body.id });
      const history = new HistoryModule();
      history.CompanyHistory(req.body.companyId, { Delete: '' }, { Delete: `${site.siteName}, site deleted` }, req);
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
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

  async editSiteIntroducer(req: Request, res: Response) {
    try {
      const siteResult = await SiteModel.findOne({
        company: req.body.editData.companyId,
        siteName: req.body.editData.siteName,
      });

      if (siteResult !== undefined) {
        if (siteResult._id != req.body.findId) {
          return res.send({
            success: false,
            reason: "Site name is already Exist",
            statusCode: "2311",
          });
        }
      }
      await SiteModel.findByIdAndUpdate(req.body.findId, {
        siteName: req.body.editData.siteName,
        siteAddress: req.body.editData.siteAddress,
        firstLine: req.body.editData.firstLine,
        secondLine: req.body.editData.secondLine,
        town: req.body.editData.town,
        city: req.body.editData.city,
        country: req.body.editData.country,
        postcode: req.body.editData.postcode,
        User: req.body.editData.contactPerson,
      });
      res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }

  async deleteSiteIntroducer(req: Request, res: Response) {
    try {
      await SiteModel.deleteOne({ _id: req.body.id });
      return res.send({ success: true });
    } catch (err) {
      commonUtils.sendErrorResponse(req, res, err);
    }
  }
}