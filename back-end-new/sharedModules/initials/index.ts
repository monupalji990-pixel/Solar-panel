import userModel from "../../models/user";
import roleModel from "../../models/role";
import { Response } from "../../templates/commandInterface";

var roleJSON = require("./roles.json");
var userJSON = require("./users.json");
var Promise = require("bluebird");

function addRoles() {
  return new Promise((resolve:Function, reject:Function) => {
    var allRolesPromise = roleJSON.map((v:any) => {
      return new Promise((resolve:Function, reject:Function) => {
        roleModel.updateOne(
          {
            roleName: v.roleName,
          },
          v,
          {
            upsert: true,
          },
          (err:any) => {
            resolve(err);
          }
        );
      });
    });
    
    Promise.all(allRolesPromise)
      .then((resp:Response) => resolve(resp))
      .catch((resp:Response) => reject(resp));
  });
}

function addUser() {
  return new Promise((resolve:Function, reject:Function) => {
    var allUserPromise = userJSON.map((v:any) => {
      return new Promise((resolve:Function, reject:Function) => {
        userModel.updateOne(
          {
            email: v.email,
          },
          v,
          {
            upsert: true,
          },
          (err:any, result:any) => {
            resolve(err);
          }
        );
      });
    });
    Promise.all(allUserPromise)
      .then((resp:Response) => resolve(resp))
      .catch((resp:Response) => reject(resp));
  });
}

const setup = () => {
  return new Promise((resolve:Function, reject:Function) => {
    var promises = [];
    promises.push(addRoles());
    promises.push(addUser());
    Promise.all(promises)
      .then((resp:Response) => resolve(resp))
      .catch((resp:Response) => reject(resp));
  });
};

export default {
   setup
}