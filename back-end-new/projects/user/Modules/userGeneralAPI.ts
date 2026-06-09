import ControllerUtils from "../../../utils/ControllerUtils";
import { Request, Response } from "../../../templates/commandInterface";
import UserModel from "../../../models/user";
import RoleModel from "../../../models/role";

import Modules from "../../../sharedModules/index";
const { responseModule, mail, general } = Modules.smallModules;
var path = require("path");
export default class UserGeneralAPI extends ControllerUtils {
  constructor() {
    super();
  }

  async addRoleToUserAdmin(req: Request, res: Response) {
    try {
      await UserModel.updateOne(
        {
          _id: req.body.userId,
        },
        {
          role: req.body.roleId,
        },
        true
      );
      responseModule.sendResponse(res, { success: true });
    } catch (err) {
      return responseModule.sendResponse(res, err);
    }
  }
  async addNewUserAdmin(req: Request, res: Response) {
    req.body.email = req.body.email.toLowerCase();
    const newUser = new UserModel({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      gender: req.body.gender,
      portal: req.body.portal,
      role: req.body.role,
      secondaryEmails: req.body.secondaryEmails,
    });
    try {
      await newUser.save();
      if (req.body.checkbox)
        mail.sendmail(
          req.body.email,
          mail.templates.userCreationWelcomeConfig.status,
          { name: req.body.email }
        );
      res.send({ success: true, message: "User added successfully" });
    } catch (err) {
      responseModule.sendResponse(res, {
        success: false,
        err: err,
      });
    }
  }
  async changePasswordAdmin(req: Request, res: Response) {
    try {
      await UserModel.newpassword(req.body.newpass);
      await UserModel.findByIdAndUpdate(req.body.userid, { password: res });
      responseModule.sendResponse(res, { success: true });
    } catch (err) {
      return responseModule.sendResponse(res, { err, success: false });
    }
  }

  async deleteUserAdmin(req: Request, res: Response) {
    try {
      var deleteRes = await UserModel.deleteOne({ _id: req.params.userId });
      res.send({ success: true, message: "User deleted successfully" });
    } catch (err) {
      responseModule.sendResponse(res, err);
    }
  }

  async deleteManyUserAdmin(req: Request, res: Response) {
    try {
      await UserModel.deleteMany({ _id: req.body.ArrayOfId });
      responseModule.sendResponse(res, { success: true });
    } catch (err) {
      return responseModule.sendResponse(res, err);
    }
  }

  async listUsersAdmin(req: Request, res: Response) {
    var filter = {};
    var { search } = req.query;
    // var { filters } = req.body
    if (search && search != "") {
      filter = {
        $or: [
          {
            email: {
              $regex: ".*" + search + ".*",
            },
          },
          {
            name: {
              $regex: ".*" + search + ".*",
            },
          },
        ],
      };
    }
    try {
      var countQuery = await UserModel.countDocuments(filter);
      var dataQuery = await general
        .commanFindQuery(UserModel.find(filter), req.query)
        .populate({ path: "role", select: "roleName" })
        .lean();
      res.send({ data: dataQuery, count: countQuery, success: true });
    } catch (err) {
      console.log("error come", err);
      return responseModule.sendResponse(res, err);
    }
  }

  async updateUserAdmin(req: Request, res: Response) {
    if (req.body.updation.email)
      req.body.updation.email = req.body.updation.email.toLowerCase();
    try {
      var updateRes = await UserModel.updateOne(
        {
          _id: req.body.userId,
        },
        req.body.updation
      );

      return res.send({ success: true, message: "User updated successfully" });
    } catch (err) {
      return responseModule.sendResponse(res, err);
    }
  }

  async changePasswordRegUser(req: Request, res: Response) {
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
      return responseModule.sendResponse(res, err);
    }
  }
  async updateRegUser(req: Request, res: Response) {
    var update = {
      gender: "",
      name: "",
      email: "",
    };
    if (req.body.name) update.name = req.body.name;
    if (req.body.gender) update.gender = req.body.gender;
    if (req.body.email) update.email = req.body.email.toLowerCase();

    try {
      var updateRes = await UserModel.findByIdAndUpdate(req.user._id, update, {
        new: true,
      }).populate("role");
      res.send({
        success: true,
        userData: updateRes,
        message: "Profile updated successfully",
      });
    } catch (err) {
      return responseModule.sendResponse(res, err);
    }
  }

  async addSecondaryEmailRegUser(req: Request, res: Response) {
    try {
      var updateRes = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            secondaryEmails: req.body.sEmail,
          },
        },
        { new: true }
      ).populate("role");

      res.send({
        success: true,
        userData: updateRes,
        message: "Secondary email added successfully",
      });
    } catch (err) {
      return responseModule.sendResponse(res, err);
    }
  }

  async addSecondaryEmailByAdmin(req: Request, res: Response) {
    try {
      var editUser = await UserModel.findById(req.body.userId, {
        secondaryEmails: true,
        email: true,
      });
      if (
        editUser.secondaryEmails.indexOf(req.body.sEmail.toLowerCase()) != -1
      ) {
        return res.send({
          err: "This Secondary email is already exist",
          success: false,
        });
      } else {
        if (editUser.email.toLowerCase() == req.body.sEmail.toLowerCase()) {
          return res.send({
            err: "This Secondary email is same as primary email",
            success: false,
          });
        } else {
          var updateRes = await UserModel.findByIdAndUpdate(
            req.body.userId,
            {
              $push: {
                secondaryEmails: req.body.sEmail,
              },
            },
            { new: true }
          ).populate("role");
          if (updateRes.err)
            return res.send({ err: updateRes.err, success: false });
          res.send({
            success: true,
            userData: updateRes,
            message: "Secondary email added successfully",
          });
        }
      }

      // res.send({ success: true, userData: updateRes })
    } catch (err) {
      return responseModule.sendResponse(res, err);
    }
  }

  async removeSecondaryEmailRegUser(req: Request, res: Response) {
    try {
      let p:any = {};
      p["secondaryEmails." + req.params.index] = 1;
      var response = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
          $unset: p,
        },
        { new: true }
      );

      var userResponse = await UserModel.findByIdAndUpdate(
        req.user._id,
        {
          $pull: {
            secondaryEmails: null,
          },
        },
        { new: true }
      ).populate("role");

      res.send({
        success: true,
        userData: userResponse,
        message: "Secondary email removed successfully",
      });
    } catch (err) {
      return responseModule.sendResponse(res, err);
    }
  }

  async removeSecondaryEmailByAdmin(req: Request, res: Response) {
    try {
      let p:any = {};
      p["secondaryEmails." + req.body.index] = 1;
      await UserModel.findByIdAndUpdate(
        req.body.userId,
        {
          $unset: p,
        },
        { new: true }
      );

      var sendReponse = await UserModel.findByIdAndUpdate(
        req.body.userId,
        {
          $pull: {
            secondaryEmails: null,
          },
        },
        { new: true }
      ).populate({ path: "role", select: "roleName" });

      res.send({
        success: true,
        userData: sendReponse,
        message: "Secondary email removed successfully",
      });
    } catch (err) {
      return responseModule.sendResponse(res, err);
    }
  }

  async uploadImage(req: Request, res: Response) {
    try {
      if (process.env.NODE_ENV == "development") {
        var updatedUser = await UserModel.findByIdAndUpdate(
          req.user._id,
          {
            profileImage: req.file.filename,
            userPic: process.env.PROFILEPICURLDEV + "?" + req.file.filename,
          },
          { new: true }
        ).populate("role");
        res.send({
          success: true,
          userData: updatedUser,
          message: "Image uploaded successfully!",
          profileImage: req.file.filename,
          userPic: process.env.PROFILEPICURLDEV + "?" + req.file.filename,
        });
      } else {
        var updatedUser = await UserModel.findByIdAndUpdate(
          req.user._id,
          {
            profileImage: req.file.filename,
            userPic: process.env.PROFILEPICURLPROD + "?" + req.file.filename,
          },
          { new: true }
        ).populate("role");
        res.send({
          success: true,
          userData: updatedUser,
          message: "Image uploaded successfully!",
          profileImage: req.file.filename,
          userPic: process.env.PROFILEPICURLPROD + "?" + req.file.filename,
        });
      }
    } catch (err) {}
  }

  async getProfileImage(req: Request, res: Response) {
    try {
      res.sendFile(
        path.join(__dirname + "/../../uploads/") + req.user.profileImage
      );
    } catch (err) {
      res.send({ success: false });
    }
  }

  async swapWithPrimaryEmail(req: Request, res: Response) {
    try {
      var sEmail = req.user.secondaryEmails[req.params.index];
      var users = await UserModel.findOne({ email: sEmail });
      if (users) {
        return res.send({
          success: false,
          message:
            "This secondary email is already registered as primary email, choose another one",
        });
      } else {
        let p:any = { email: sEmail };
        // p.email = sEmail;
        p["secondaryEmails." + req.params.index] = req.user.email;
        var userResponse = await UserModel.findByIdAndUpdate(
          req.user._id,
          {
            $set: p,
          },
          { new: true }
        ).populate("role");
        res.send({
          success: true,
          userData: userResponse,
          message: "Secondary email swaped with primary email,successfully!",
        });
      }
    } catch (err) {
      return responseModule.sendResponse(res, err);
    }
  }

  async addNewRoleAdmin(req: Request, res: Response) {
    try {
      var newRole = new RoleModel({
        roleName: req.body.roleName,
        authorisedAPIS: req.body.authorisedAPIS,
        authorisedContainers: req.body.authorisedContainers,
        configurations: req.body.configurations,
      });
      var saveres = await newRole.save();
      return res.send(saveres);
    } catch (err) {
      res.send({ success: false, err: err });
    }
  }
  async listRolesAdmin(req: Request, res: Response) {
    try {
      var findRes = await RoleModel.find({}).lean();
      return res.send(findRes);
    } catch (err) {
      res.send({ success: false, err: err });
    }
  }

  async replaceRolesAdmin(req: Request, res: Response) {
    try {
      const result = await RoleModel.updateOne(
        {
          _id: req.body.roleId,
        },
        req.body.newRole
      );
      return res.send(result);
    } catch (err) {
      res.send({ success: false, err: err });
    }
  }
}
