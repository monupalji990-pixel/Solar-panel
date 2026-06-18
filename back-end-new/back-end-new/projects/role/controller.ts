import RoleModel from '../../models/role';
import ControllerUtils from "../../utils/ControllerUtils";
import { Request, Response } from "../../templates/commandInterface";

export default class RoleController extends ControllerUtils {
    constructor() {
        super();
    }

    listRoles = async (req: Request, res: Response) => {
        let roleNames = [];
        if(req.user.role.roleName === 'Admin'){
            roleNames = ['Management', 'Partner', 'Sales Rep', 'Observing Partner','Service Partner','Surveyor','Installer'];
        } 
        if(req.user.role.roleName === 'Management'){
            roleNames = ['Partner', 'Sales Rep', 'Observing Partner','Service Partner','Surveyor','Installer'];
        } 
        RoleModel
            .find({roleName: {$in: roleNames}})
            .lean()
            .select('roleName')
            .exec((err, result) => {
                if (err) {
                    return res.send(err);
                }
                return res.send(result);
            });
    };

    listRolesAdminWithAdmin = async (req: Request, res: Response) => {
        RoleModel
            .find({
                roleName: {
                    $in: ['Admin', 'Management', 'Partner', 'Sales Rep', 'Observing Partner']
                }
            })
            .lean()
            .exec((err, result) => {
                if (err) {
                    return res.send(err);
                }
                return res.send(result);
            });
    };
}