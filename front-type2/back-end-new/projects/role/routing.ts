const express = require('express');
import passportConfig from "../../bin/passport";

const router = express.Router();

import RoleController from './controller'
const RoleObject = new RoleController();

router.get('/roles/regUser/list', passportConfig.isAuthenticated, passportConfig.isAuthorized, RoleObject.listRoles);

export default router;
