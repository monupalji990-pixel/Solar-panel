import passportConfig from "../../bin/passport";
import Controller from "./controller";

const express = require("express");
const router = express.Router();
const ControllerObj = new Controller()
import itemRouting from './item/routing';

router.use(passportConfig.isAuthenticated, passportConfig.isAuthorized, itemRouting);
router.use('/invoice', passportConfig.isAuthenticated, passportConfig.isAuthorized);
router.use('/invoice', router);

router.post('/', ControllerObj.Reguser.add)
router.get('/', ControllerObj.Reguser.list)
router.get('/from-list', ControllerObj.Reguser.fromList)
router.get('/get-pdf/:id', ControllerObj.Reguser.getPdf)
router.get('/:id', ControllerObj.Reguser.get)
router.put('/:id', ControllerObj.Reguser.edit)
router.delete('/:id', ControllerObj.Reguser.delete)
export default router;
