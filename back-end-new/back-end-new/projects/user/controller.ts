const async = require("async");
const _ = require("lodash");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types

import { Request, Response } from "../../templates/commandInterface";
import UserModel, { UserInterface } from "../../models/user";
import GeneralUserAPI from "./Modules/userGeneralAPI";
import RoleModel from "../../models/role";
import SiteModel from "../../models/Site";
import CompanyModel from "../../models/Company";
import ConsumerModel from "../../models/user"
import LeadModel from "../../models/Lead";
import QuoteModel from "../../models/Quotes";
import TaskModel from "../../models/Task";
import commanUtils from "../../sharedModules/smallModules/commanUtils";
import HistoryModule from "../../sharedModules/smallModules/historyModule";
import aws from "../../sharedModules/smallModules/aws";
import SendinblueController from '../sendinblue/controller';
import { constants } from "buffer";
import Quote from "../../models/Quotes";
import Renewal from "../../models/Renewal";
var path = require("path");
class AdminController {

  async updateUserEmail(req: Request, res: Response) {
    try {
      let users = await UserModel.find({ email: /tidbit\w*/gi }).select('email');
      let arr = [];
      for (let u of users) {
        let email = u.email;
        email = email.replace(/tidbit\w*/gi, 'edan');
        console.log(email);
        arr.push(email);
        u.email = email;
        u.save();
      }
      return res.send({ success: true, arr });
    } catch (error) {
      console.log(error)
      commanUtils.sendErrorResponse(req, res, error);

    }
  }

  async updateUserPass(req: Request, res: Response) {
    try {
      let users = await UserModel.find({ password: { $exists: true } }).select('email password').skip(100).limit(100);
      let arr = [];
      for (let u of users) {
        let password = u.password;
        password = 'Powerfly@2021';
        console.log(password);
        arr.push(password);
        u.password = password;
        u.save();
      }
      return res.send({ success: true, arr });
    } catch (error) {
      console.log(error)
      commanUtils.sendErrorResponse(req, res, error);

    }
  }
  async listUsersAdmin(req: Request, res: Response) {
    try {
      const userResult = await UserModel.find({})
        .select(commanUtils.projection.user.admin.list)
        .lean();
      res.send(userResult);
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async addNewUserAdmin(req: Request, res: Response) {
    try {
      const newUser = new UserModel({
        email: req.body.email.toLowerCase(),
        password: req.body.password,
      });
      await newUser.save();
      commanUtils.sendResponse(res, { success: true });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  addNewContactFromView = async (req: Request, res: Response) => {
    try {
      const newUser = new UserModel({
        email: req.body.contactEmail.toLowerCase(),
        secondary_email: req.body.secondary_email.toLowerCase(),
        companyId: req.body.companyId,
        mobile: req.body.contactMobile,
        name: req.body.contactName,
        phone: req.body.contactOffice,
        jobTitle: req.body.jobTitle,
        DOB: req.body.DOB,
        nationalInsurance: req.body.nationalInsurance,
        homeAddress: req.body.homeAddress,
        previousAddress: req.body.previousAddress,
        previousAddressYear: req.body.previousAddressYear,
        createdBy: req.user._id,
      });
      const user = await newUser.save();
      await CompanyModel.updateOne({ _id: req.body.companyId }, { $push: { Contact: user._id } });
      let sendinblueControllerObj = new SendinblueController();
      let listIds = [];
      if (req.body?.listIds?.length > 0) {
        listIds = req.body.listIds.filter(e => {
          if (e != 18)
            return true;
          return false;
        })
      }
      listIds.push(18);
      let sendinblueContact = await sendinblueControllerObj.createContactService({ email: user.email, attributes: { FIRSTNAME: user.name, SMS: user.mobile }, listIds: listIds })
      console.table(sendinblueContact);
      const history = new HistoryModule();

      history.CompanyHistory(req.body.companyId, { Create: '' }, { Create: `${req.body.contactName}, contact created` }, req);
      if (sendinblueContact.success == false)
        res.send({ success: true, message: 'contact Added successfully but not added to sendinblue due to ' + sendinblueContact.message });
      else
        res.send({ success: true, message: 'contact Added successfully' });

    } catch (err) {
      if (err.message.includes('duplicate') && err.message.includes('email_1') && err.message.includes('dup key')) {
        res.send({ success: false, message: "Email is already exist." });
      } else {
        commanUtils.sendErrorResponse(req, res, err);
      }
    }
  };

  async editUser(req: Request, res: Response) {
    try {
      let hasPassword = "";
      let passwordValue = "no-pass";
      if (req.body.editData.portalAccess && req.body.editData.updatePassword) {
        passwordValue = req.body.editData.password;
      }

      UserModel.newpassword(passwordValue, async (err: any, resp: any) => {
        if (err) {
          res.send({ err, success: false });
        } else {
          hasPassword = resp;
          let updateObject: any = {};
          let resMessage = "";
          updateObject = req.body.editData
          if (req.body.editData.email) updateObject.email = req.body.editData.email.toLowerCase();
          if (req.body.editData.secondary_email) updateObject.secondary_email = req.body.editData.secondary_email.toLowerCase();
          const previousObject = await UserModel.findById(req.body.findId)

          UserModel.findByIdAndUpdate(
            req.body.findId,
            updateObject,
            { new: true },
            async (error, doc) => {
              if (error) {
                res.send({ error, success: false });
              } else {
                if (req.body.companyId) {
                  let obj: any = {};
                  if (req.body?.editData?.mobile)
                    obj.SMS = req.body.editData.mobile
                  if (req.body?.editData?.email)
                    obj.EMAIL = req.body.editData.email
                  if (req.body?.editData?.name)
                    obj.FIRSTNAME = req.body.editData.name

                  if (Object.keys(obj).length > 0) {
                    let sendinblueControllerObj = new SendinblueController();
                    let sendinblueContact = await sendinblueControllerObj.updateContactService(previousObject.email, obj)
                    sendinblueContact.success ? resMessage = " And Contact updated successfully in sendinblue" : null
                    if (sendinblueContact.success == false) {
                      if (sendinblueContact.code == "document_not_found") {
                        sendinblueContact = await sendinblueControllerObj.createContactService({ email: doc.email, attributes: { SMS: doc.mobile, FIRSTNAME: doc.name }, listIds: [18] })
                        sendinblueContact.success ? resMessage = " And Contact added successfully in sendinblue" : null;
                      } else {
                        sendinblueContact.success == false ? resMessage = " And " + sendinblueContact.message + " in sendinblue" : null
                      }
                    }
                  }

                  const history = new HistoryModule();
                  history.CompanyHistory(req.body.companyId, previousObject, updateObject, req, 'Contact');
                }
                res.send({ success: true, message: "Contact edited successfully in CRM" + resMessage });
              }
            }
          );
        }
      });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async AssigneeList(req: Request, res: Response) {
    try {
      const filter: any = {}
      if (req.query?.role) {
        if (!Array.isArray(req.query.role)) {
          filter.role = [req.query.role]
        }
      } else {
        filter.role = {
          $in: [
            '5d5b92031c9d440000c99914',
            '5d5b92031c9d440000c99911',
            '5d5b92031c9d440000c99912',
            '5d5b91db1c9d440000c9991d',
            '608f9c0adec79b10729cc88d',
            '62b02a8fda27b400c8b8cf1e',
            '62a8266b193c318de458db58'
          ]
        };
      }

      if (req.query.installerType) {
        if (Array.isArray(req.query.installerType)) {
          filter.installerType = { $in: req.query.installerType }
        } else {
          filter.installerType = { $in: [req.query.installerType] }

        }
      }

      filter.isActive = 1; // to filter only active users
      let query = UserModel.find(filter);
      commanUtils.commanFindQuery(query, req.query).populate("role", "roleName");
      query.select(commanUtils.projection.user.regUser.list).lean();
      const assignee = await query.exec();
      res.send({ data: assignee, success: true });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async downloadFile(req: Request, res: Response) {
    try {
      const userPicKey = req.body[0].replace(process.env.AWS_FILE_BASE_URL, '')
      aws.pipeFileDownload(userPicKey, req, res);
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async listCompanyContactreguser(req: Request, res: Response) {
    try {
      let filter = {};
      filter = {
        companyId: req.query.companyId,
      };
      let query = UserModel.find(filter);
      query.select(commanUtils.projection.company.admin.list);
      query = commanUtils.commanFindQuery(query, req.query);
      const count = await UserModel.countDocuments(filter);
      const data = await query.exec();

      res.send({ data: data, count: count, success: true });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminDeleteUsers(req: Request, res: Response) {
    try {
      req.body.deleteIds.forEach(async (element) => {
        const UserDetails = await UserModel.findOne({ _id: element });
        if (UserDetails.companyId !== undefined) {
          await CompanyModel.update({ _id: UserDetails.companyId },
            {
              $pullAll: {
                Contact: [UserDetails._id],
              },
            }
          );
        }

        let siteList: any = {};
        if (UserDetails.companyId !== undefined) {
          siteList = await CompanyModel.findOne({ _id: UserDetails.companyId });
        }

        if (siteList) {
          if (siteList.Site) {
            siteList.Site.forEach(async (ele) => {
              await SiteModel.update({ _id: ele },
                {
                  $pullAll: {
                    User: [UserDetails._id],
                  },
                },
                () => { }
              );
            });
          }
        }

        await UserModel.deleteOne({ _id: element });
      });
      res.send({ success: true });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminDeletePartner(req: Request, res: Response) {
    try {
      await CompanyModel.updateMany(
        {
          Partner: req.body.OldPartner,
        },
        {
          Partner: req.body.Partner,
        }
      );

      await LeadModel.updateMany(
        {
          Partner: req.body.OldPartner,
        },
        {
          Partner: req.body.Partner,
        }
      );
      await QuoteModel.updateMany(
        {
          createdBy: req.body.OldPartner,
        },
        {
          createdBy: req.body.Partner,
        }
      );
      await UserModel.deleteOne({
        _id: req.body.OldPartner,
      });
      res.send({ success: true });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminRejectDeleteRequestUsers(req: Request, res: Response) {
    try {
      await req.body.deleteIds.forEach(async (element) => {
        await UserModel.updateOne({ _id: element }, { isDelete: false });
      });
      res.send({ success: true });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async ManagementRequestDeleteUsers(req: Request, res: Response) {
    try {
      const previousObject = await UserModel.findById(req.body.id);
      await UserModel.updateOne({ _id: req.body.id }, { isBlock: 0, isDelete: req.body.isDelete });

      const history = new HistoryModule();
      history.UserHistory(req.body.id, previousObject, { isDelete: req.body.isDelete }, req);

      const ob = new RegUserController();
      ob.ShowContact(req, res);
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminBlockUsers(req: Request, res: Response) {
    try {
      await req.body.blockIds.forEach(async (element) => {
        await UserModel.updateOne(
          {
            _id: element,
          },
          {
            isBlock: true,
            isActive: 0,
          }
        );
      });
      res.send({ success: true });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async AdminUnBlockUsers(req: Request, res: Response) {
    await req.body.blockIds.forEach(async (element) => {
      await UserModel.updateOne(
        {
          _id: element,
        },
        {
          isBlock: false,
          isActive: 1,
        }
      );
    });
    res.send({ success: true });
  }

  async PartnerBlockUsers(req: Request, res: Response) {
    await req.body.blockIds.forEach(async (element) => {
      await UserModel.updateOne(
        {
          _id: element,
        },
        {
          isBlock: true,
          isActive: 0,
        }
      );
    });
    res.send({ success: true });
  }

  async PartnerUnBlockUsers(req: Request, res: Response) {
    await req.body.blockIds.forEach(async (element) => {
      await UserModel.updateOne(
        {
          _id: element,
        },
        {
          isBlock: false,
          isActive: 1,
        }
      );
    });
    res.send({ success: true });
  }

  async addNewUserManagement(req: Request, res: Response) {
    const newUser = new UserModel({
      email: req.body.email.toLowerCase(),
      city_list: req.body?.city_list,
      password: req.body.password,
      name: req.body.name,
      role: req.body.role ? req.body.role : "5d5b92031c9d440000c99912",
      companyId: req.body.companyId,
      Site: req.body.sites,
      createdBy: req.user._id,
      portalAccess: true,
      jobTitle: req.body.jobTitle,
      mobile: req.body?.mobile,
      phone: req.body?.phone,
      addressOne: req.body?.address,
      color: req.body?.color || 'rgb(25, 53, 98)'
    });

    const resFound = await UserModel.findOne({ email: req.body.email.toLowerCase() }).lean();

    if (resFound) {
      res.send({
        success: false,
        errors: {
          email: true,
          emailText: "This email already exist",
        },
      });
    } else {
      if (req.body?.fixCommission && !isNaN(req.body?.fixCommission))
        newUser.fixCommission = req.body.fixCommission
      if (req.body?.percentageCommission && !isNaN(req.body?.percentageCommission))
        newUser.percentageCommission = req.body.percentageCommission
      if (req.body.role === '62b02a8fda27b400c8b8cf1e') {
        newUser.installerType = req.body.installerType
      }
      const respUser = await newUser.save();

      await SiteModel.updateOne({ _id: req.body.sites }, { $push: { User: [respUser._id] } });

      await CompanyModel.updateOne({ _id: req.body.companyId }, { $push: { Contact: [respUser._id] } });
      if (req.body?.role === "5d5b92031c9d440000c99914")
        await CompanyModel.updateMany({ Assignee: { $ne: ObjectId(respUser._id) } }, { $addToSet: { Assignee: ObjectId(respUser._id) } })

      if (req.body?.role === "5d5b92031c9d440000c99914")
        await ConsumerModel.updateMany({ Assignee: { $ne: ObjectId(respUser._id) } }, { $addToSet: { Assignee: ObjectId(respUser._id) } })

      const history = new HistoryModule();
      history.UserHistory(respUser._id, { create: '' }, { create: ("User created") }, req);
      res.send({ success: true });
    }
  }

  async listOfUsers(req: Request, res: Response) {
    let filter: any = {};
    if (req.query.isDelete) filter.isDelete = true;
    filter.role = {
      $exists: true,
      $ne: null,
      $nin: ['5d5b92031c9d440000c99915'],
    };
    if (req.query.role) {
      let roleIds = await RoleModel.find({ roleName: { $in: req.query.role } }).select('_id')
      filter.role['$in'] = roleIds
    }
    if (req.query.status && Number(req.query.status) != NaN) {
      filter.isActive = Number(req.query.status)
    }
    if (req.query.Search) {
      filter.$or = [
        { email: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { name: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
      ];
    }

    if (["Management"].includes(req.user.role.roleName)) {
      filter.role = {
        $in: [
          "5d5b92031c9d440000c99914",
          "5d5b92031c9d440000c99911",
          "5d5b92031c9d440000c99912",
          "5d5b91db1c9d440000c9991d",
          "62a8266b193c318de458db58",
          "62b02a8fda27b400c8b8cf1e"
        ],
      };
    }

    if (["Partner"].includes(req.user.role.roleName)) {
      filter.createdBy = req.user._id;
      filter.role = {
        $exists: true,
        $ne: null,
        $eq: '5d5b92031c9d440000c99912'
      };
    }
    if (req.query.installerType) {
      if (Array.isArray(req.query.installerType)) {
        filter.installerType = { $in: req.query.installerType }
      } else {
        filter.installerType = { $in: [req.query.installerType] }

      }
    }

    const dataQuery = commanUtils.commanFindQuery(UserModel.find(filter), req.query);
    const data = await dataQuery
      .populate({
        path: "role",
        select: "roleName roleNo",
        match: {
          roleName: {
            $in: [
              "Admin",
              "Management",
              "Partner",
              "Sales Rep",
              "Observing Partner",
              "Service Partner",
              "Surveyor",
              "Installer"
            ],
          },
        },
      })
      .lean()
      .select("name email isActive isDelete avatar installerType");

    res.send({ data: data, count: 0, success: true });
  }

  async UsersCount(req: Request, res: Response) {
    let filter: any = {};
    if (req.query.isDelete) filter.isDelete = true;
    filter.role = {
      $exists: true,
      $ne: null,
      $nin: ['5d5b92031c9d440000c99915']
    };
    if (req.query.Search) {
      filter.$or = [
        { email: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
        { name: { $regex: `.*${req.query.Search}.*`, $options: "i" } },
      ];
    }

    if (["Management"].includes(req.user.role.roleName)) {
      filter.role = {
        $in: [
          "5d5b92031c9d440000c99914",
          "5d5b92031c9d440000c99911",
          "5d5b92031c9d440000c99912",
          "5d5b91db1c9d440000c9991d",
        ],
      };
    }

    if (["Partner"].includes(req.user.role.roleName)) {
      filter.createdBy = req.user._id;
      filter.role = {
        $exists: true,
        $ne: null,
        $eq: '5d5b92031c9d440000c99912'
      };
    }

    const count = await UserModel.countDocuments(filter);
    res.send({ count: count, success: true });
  }

  async DeleteRequestCount(req:Request, res: Response){
    try {
      const companyCount = await CompanyModel.countDocuments({isDelete:true})
      const consumerCount = await UserModel.countDocuments({isDelete:true,role:"5d5b92031c9d440000c99915"})
      const leadCount = await LeadModel.countDocuments({isDelete:true})
      const quoteCount = await Quote.countDocuments({isDelete:true})
      const renewalCount = await Renewal.countDocuments({isDelete:true})
      const taskCount = await TaskModel.countDocuments({isDelete:true})


      console.log(companyCount,consumerCount,leadCount,quoteCount,renewalCount,taskCount)

      return res.send({success:true,data:{
        companyCount:companyCount,
        consumerCount:consumerCount,
        leadCount:leadCount,
        quoteCount:quoteCount,
        renewalCount:renewalCount,
        taskCount:taskCount
      }})

    } catch (error) {
      console.log(error)
    }
  }
  async listOfUsersByManagement(req: Request, res: Response) {
    let filter: any = {};
    filter.role = {
      $in: [
        "5d5b92031c9d440000c99914",
        "5d5b92031c9d440000c99911",
        "5d5b92031c9d440000c99912",
        "5d5b91db1c9d440000c9991d",
      ],
    };
    if (req.query.isActive) filter.isActive = 1;

    const dataQuery = commanUtils.commanFindQuery(UserModel.find(filter), req.query);

    const data = await dataQuery
      .populate({
        path: "role",
        select: "roleName roleNo",
        match: {
          roleName: {
            $in: [
              "Admin",
              "Management",
              "Partner",
              "Sales Rep",
              "Observing Partner",
            ],
          },
        },
      })
      .populate("Site")
      .populate({
        path: "companyId",
        populate: {
          path: "Site",
        },
      })
      .populate({
        path: "companyId",
        populate: {
          path: "Contact",
        },
      })
      .lean();

    const count = await UserModel.countDocuments(filter);
    res.send({ data: data, count: count, success: true });
  }

  async GetUserInfo(req: Request, res: Response) {
    const dataQuery = UserModel.findOne({ _id: req.user._id });
    const data = await dataQuery.populate("role").lean();
    res.send({ data: data, success: true });
  }

  async editUserProfile(req: Request, res: Response) {
    let editUser: any = {};
    if (req.body.name) {
      editUser.name = req.body.name;
    }
    if (req.body.email) {
      editUser.email = req.body.email;
    }
    if (req.body.mobile) {
      editUser.mobile = req.body.mobile;
    }

    if (req.body.email) {
      const docs = await UserModel.find({ email: req.body.email });
      if (docs.length > 1) {
        res.send({ success: false, message: "This email already exist" });
      } else {
        await UserModel.updateOne(
          {
            _id: req.user._id,
          },
          editUser
        );
        const userData = await UserModel.findById(req.user._id).populate("role");
        res.send({ success: true, userData });
      }
    } else {
      await UserModel.updateOne(
        {
          _id: req.user._id,
        },
        editUser
      );
      const userData = await UserModel.findById(req.user._id).populate("role");
      res.send({ success: true, userData });
    }
  }

  async updatePassword(req: Request, res: Response) {
    UserModel.newpassword(req.body.password, (err, resp) => {
      if (err) {
        return res.send(err);
      }
      UserModel.findByIdAndUpdate(
        req.body.UserID,
        {
          password: resp,
        },
        (error) => {
          if (error) {
            return res.send({
              ...error,
              success: false,
            });
          }
          const history = new HistoryModule();
          history.UserHistory(req.body.UserID, { 'passwordEdit': '' }, { 'passwordEdit': '' }, req);

          return res.send({ success: true });
        }
      );
    });
  };

  async updateUser(req: Request, res: Response) {
    try {
      let updatedUser: any = {};
      if (req.body.updation.name) updatedUser.name = req.body.updation.name;
      if (req.body.updation.color) updatedUser.color = req.body.updation.color
      if (req.body.updation.isDelete !== undefined) updatedUser.isDelete = req.body.updation.isDelete;
      if (req.body.updation.email) updatedUser.email = req.body.updation.email;
      if (req.body.updation.jobTitle) updatedUser.jobTitle = req.body.updation.jobTitle;
      if (req.body.updation?.city_list) updatedUser.city_list = req.body.updation.city_list;
      if (req.body.updation?.installerType) updatedUser.installerType = req.body.updation?.installerType
      if (req.body.updation.status) {
        if (req.body.updation.status === 1) {
          updatedUser.isBlock = false;
          updatedUser.isActive = 1;
        } else {
          updatedUser.isBlock = true;
          updatedUser.isActive = 0;
        }
      }
      if (req.body.updation?.phone) {
        updatedUser.phone = req.body.updation.phone
      }

      if (req.body.updation?.mobile) {
        updatedUser.mobile = req.body.updation.mobile
      }

      if (req.body.updation?.address) {
        updatedUser.addressOne = req.body.updation.address
      }

      if (req.body.updation.isDelete !== undefined) updatedUser.isDelete = req.body.updation.isDelete
      if (req.body?.updation?.fixCommission && !isNaN(req.body?.updation?.fixCommission))
        updatedUser.fixCommission = req.body.updation.fixCommission
      if (req.body?.updation?.percentageCommission && !isNaN(req.body?.updation?.percentageCommission))
        updatedUser.percentageCommission = req.body.updation.percentageCommission

      const previousObject = await UserModel.findById(req.body.userId);
      await UserModel.updateOne({ _id: req.body.userId }, updatedUser);
      const history = new HistoryModule();
      history.UserHistory(req.body.userId, previousObject, updatedUser, req);

      const ob = new RegUserController();
      req.body.message = "User edited successfully";
      ob.ShowContact(req, res);
    } catch (error) {
      console.log(error.message);
      if (error.message.includes("duplicate") && error.message.includes("email_1")) {
        const ob = new RegUserController();
        req.body.message = "Email already exist.";
        ob.ShowContact(req, res);
      }
    }
  }

  async deleteUserreguser(req: Request, res: Response) {
    const user = await UserModel.findById(req.body.id);
    await UserModel.deleteOne({ _id: req.body.id });
    if (req.body.companyId) {
      const history = new HistoryModule();
      history.CompanyHistory(req.body.companyId, { Delete: '' }, { Delete: `${user.name}, contact deleted` }, req);
    }

    return res.send({ success: true });
  }

  async RemoveAssignee(req: Request, res: Response) {
    const user = await UserModel.findById(req.body.RemoveID);
    if (req.body.CompanyID !== undefined && req.body.CompanyID) {
      await CompanyModel.update({ _id: req.body.CompanyID }, { $pull: { Assignee: req.body.RemoveID } });

      const history = new HistoryModule();
      history.CompanyHistory(req.body.CompanyID, { Assignee: '' }, { Assignee: `${user.name}, assignee removed` }, req);

    }
    if (req.body.Consumer !== undefined && req.body.Consumer) {
      await UserModel.update({ _id: req.body.Consumer }, { $pull: { Assignee: req.body.RemoveID } });

      const history = new HistoryModule();
      history.ConsumerHistory(req.body.Consumer, { Assignee: '' }, { Assignee: `${user.name}, assignee removed` }, req);
    }

    return res.send({ success: true });
  }

  async changePasswordOfUser(req: Request, res: Response) {
    try {
      var rescompare = await req.user.comparePassword(req.body.currentPassword);
      if (rescompare == true) {
        await UserModel.updateOne(
          {
            _id: req.user._id,
          },
          { password: req.body.newPassword }
        );

        res.send({ success: true, message: "Password updated successfully!" });
      } else {
        res.send({ success: false, message: "CurrentPassword is not same" });
      }
    } catch (err) {
      return res.send(res, err);
    }
  }

  async deleteUserIntroducer(req: Request, res: Response) {
    await UserModel.deleteOne({
      _id: req.body.userId,
    });
    return res.send({ success: true });
  }

  async DeleteUserAndAssigneeOther(req: Request, res: Response) {
    try {
      // company
      const company = await CompanyModel.find({ Assignee: { $in: [req.body.OldUser] } });
      await company.forEach(async (t) => {
        await CompanyModel.findOneAndUpdate({ _id: t._id }, { $pullAll: { Assignee: [req.body.OldUser] } })
        let ud = await CompanyModel.findById(t._id)
        const as = ud.Assignee;
        if (as.length < 1) {
          as.push(req.body.NewUser);
        } else {
          as.unshift(req.body.NewUser);
        }
        const UniqueAssignee = as.filter((value, index, self) => {
          return self.indexOf(value) === index;
        })
        await CompanyModel.update({ _id: t._id }, { Assignee: UniqueAssignee })
      })

      // consumer
      const consumer = await UserModel.find({ Assignee: { $in: [req.body.OldUser] } });
      await consumer.forEach(async (t) => {
        await UserModel.findOneAndUpdate({ _id: t._id }, { $pullAll: { Assignee: [req.body.OldUser] } })
        let ud = await UserModel.findById(t._id)
        const as = ud.Assignee;
        if (as.length < 1) {
          as.push(req.body.NewUser);
        } else {
          as.unshift(req.body.NewUser);
        }
        const UniqueAssignee = as.filter((value, index, self) => {
          return self.indexOf(value) === index;
        })
        await UserModel.update({ _id: t._id }, { Assignee: UniqueAssignee })
      })

      await LeadModel.updateMany({ Assignee: req.body.OldUser }, { Assignee: req.body.NewUser });
      await QuoteModel.updateMany({ Assignee: req.body.OldUser }, { Assignee: req.body.NewUser });

      await TaskModel.updateMany({ Assignee: req.body.OldUser }, { Assignee: req.body.NewUser });
      const ot = await TaskModel.find({ Observer: req.body.OldUser });
      await ot.forEach(async (t) => {
        await TaskModel.findOneAndUpdate({ _id: t._id }, { $pullAll: { Observer: [req.body.OldUser] } })
        let ud = await TaskModel.findById(t._id)
        const as = ud.Observer;
        if (as.length < 1) {
          as.push(req.body.NewUser);
        } else {
          as.unshift(req.body.NewUser);
        }
        const uo = as.filter((value, index, self) => {
          return self.indexOf(value) === index;
        })
        await TaskModel.update({ _id: t._id }, { Observer: uo })
      })

      await UserModel.deleteOne({ _id: req.body.OldUser });
      res.send({ success: true });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async wsSetOnline(data: any) {
    try {
      //id required
      await UserModel.findOneAndUpdate({}, { isOnline: data })

    } catch (error) {
      console.log(error)

    }
  }

  async getUserOnlineStatus(data) {
    try {
      await UserModel.updateOne({ _id: data.user }, { isOnline: true });
      let user = await UserModel.findOne({ _id: data.user }).select('name avatar role isOnline idleStatus').
        populate('role', 'roleName').lean()
      return user;
    } catch (error) {
      console.log(error)
    }
  }

  async getNotLoggedInUsers(req: any, res: any, next: any) {
    try {
      let skip = req.query?.skip ? Number(req.query.skip) : 0
      let limit = req.query?.limit ? Number(req.query.limit) : 20

      let users = await UserModel.find({ isOnline: false }).select('name avatar role isOnline idleStatus')
        .populate('role', 'roleName').skip(skip).limit(limit).lean()
      return res.send({ success: true, data: users })
    } catch (error) {
      commanUtils.sendErrorResponse(req, res, error);

    }
  }

  async wsSetOffline(data: any) {
    try {
      //id required
      await UserModel.findOneAndUpdate({ _id: data.user }, { isOnline: false })

    } catch (error) {
      console.log(error)

    }
  }

  async wsChangeidleStatus(data: any) {
    try {
      //id required
      await UserModel.findOneAndUpdate({ _id: data._id }, { idleStatus: data.status })
      return true;
    } catch (error) {
      console.log(error)

    }
  }
  async isAdmin(data: any) {
    try {
      let user = await UserModel.findOne({ _id: data.user }).select('role').lean();
      if (user && user.role.toString() === "5d5b91e01c9d440000c9990f") {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error)
    }
  }
}

class RegUserController {
  async UpdateAvatar(req: Request, res: Response) {
    try {
      let editUser: any = {};
      if (req.files.avatar) editUser.avatar = req.files.avatar[0].location
      else editUser.avatar = ''
      await UserModel.findByIdAndUpdate(req.user._id, editUser);
      const userData = await UserModel.findById(req.user._id).populate("role");
      res.send({ success: true, userData });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async ShowContact(req: Request, res: Response) {
    try {
      let id = ''
      if (req.body.userId) id = req.body.userId;
      else if (req.body.id) id = req.body.id;
      else id = req.params.id
      const result = await UserModel.findById(id).populate('role', 'roleName').select('name email avatar jobTitle DOB isBlock isActive isDelete gdpr phone mobile nationalInsurance addressOne homeAddress secondary_email previousAddress previousAddressYear fixCommission percentageCommission city city_list color installerType');

      if (req.body.message) {
        return res.send({ success: true, contact: result, message: req.body.message });
      }
      res.send({ success: true, contact: result });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async addAssignee(req: Request, res: Response) {
    try {
      let d: any = {};
      if (req.body.ConsumerID) d = await UserModel.findOne({ _id: req.body.ConsumerID });
      let cma = d.Assignee;
      req.body.Assignee.forEach((element) => { cma.unshift(element) });
      const uni = cma.filter((value, index, self) => { return self.indexOf(value) === index })
      if (req.body.ConsumerID) await UserModel.update({ _id: req.body.ConsumerID }, { Assignee: uni });

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
        history.ConsumerHistory(req.body.ConsumerID, { Assignee: '' }, { Assignee: `${as} assignee added` }, req);
      }

      res.send({ success: true });
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async getSalesRepRegUser(req: Request, res: Response) {
    try {
      const filter = {
        role: {
          $in: ['5d5b92031c9d440000c99914',
            '5d5b92031c9d440000c99911',
            '5d5b92031c9d440000c99912',
            '5d5b91db1c9d440000c9991d',
            '608f9c0adec79b10729cc88d']
        },
        isActive: 1
      };

      let query = UserModel.find(filter);
      commanUtils.commanFindQuery(query, req.query);
      query.select(commanUtils.projection.user.regUser.list).lean();
      const partners = await query.exec();
      commanUtils.sendResponse(res, partners);
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async getPartnerListRegUser(req: Request, res: Response) {
    try {
      const filter = {
        role: "5d5b92031c9d440000c99911",
      };
      let query = UserModel.find(filter);
      commanUtils.commanFindQuery(query, req.query);
      query.select(commanUtils.projection.user.regUser.list).lean();
      const partners = await query.exec();
      commanUtils.sendResponse(res, partners);
    } catch (err) {
      commanUtils.sendErrorResponse(req, res, err);
    }
  }

  async assigneeList(req: Request, res: Response) {
    let d = new UserModel;
    if (req.query.Consumer) d = UserModel.findById(req.query.Consumer);
    let data = await d.populate({
      path: "Assignee",
      select: "name email isActive",
      populate: {
        path: "role",
        select: 'roleName'
      },
    }).select("Assignee");
    if (Array.isArray(data.Assignee)) {
      data.Assignee = data.Assignee.filter(d => d?.isActive !== 0)
    }
    let assigneeData = data.Assignee;
    let assigneeDataCount = data.Assignee;
    if (req.query.sort) {
      assigneeData = _.sortBy(assigneeData, (v) => v[req.query.sort]);
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
}

export default class MasterControllers extends GeneralUserAPI {
  admin: AdminController;
  regUser: RegUserController;
  constructor() {
    super();
    this.admin = new AdminController();
    this.regUser = new RegUserController();
  }
}