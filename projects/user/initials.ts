export {};
import userModel from '../../models/user';
import roleModel from '../../models/role';

var roleJSON = require('./Modules/initialData/roles.json');
var userJSON = require('./Modules/initialData/users.json');

var Promise = require('bluebird');

function addRoles() {
    return new Promise((resolve: (arg0: any) => any, reject: (arg0: any) => any) => {
        var allrolesPromise = roleJSON.map((v: { roleName: any; }) => {
            return new Promise((resolve: (arg0: any) => void, reject: any) => {
                roleModel.updateOne({
                    roleName: v.roleName
                }, v, {
                    upsert: true
                }, (err: any, result: any) => {
                    console.log(err, result);
                    resolve(err);
                });
            });
        });
        Promise
            .all(allrolesPromise)
            .then((resp: any) => resolve(resp))
            .catch((resp: any) => reject(resp));
    });
}
function addUser() {
    return new Promise((resolve: (arg0: any) => any, reject: (arg0: any) => any) => {
        var allUserPromise = userJSON.map((v: { email: any; }) => {
            return new Promise((resolve: (arg0: any) => any, reject: (arg0: any) => any) => {
                userModel.updateOne({
                    email: v.email
                }, v, {
                    upsert: true
                }, (err: any, result: any) => {
                    err ? reject(err) : resolve(result);
                });
            });
        });
        Promise
            .all(allUserPromise)
            .then((resp: any) => resolve(resp))
            .catch((resp: any) => reject(resp));
    });
}
const setup = (req: any, res: any) => {
    return new Promise((resolve: (arg0: any) => any, reject: (arg0: any) => any) => {
        var promises = [];
        promises.push(addRoles());
        promises.push(addUser());
        Promise.all(promises)
            .then((resp: any) => resolve(resp))
            .catch((resp: any) => reject(resp));
    });
};

export default {
    setup
}