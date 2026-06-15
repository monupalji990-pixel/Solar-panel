import passportConfig from "../../../bin/passport";
import Controller from "./controller";

const express = require("express");
const router = express.Router();
const ControllerObj = new Controller()

router.post('/invoice/item', ControllerObj.Reguser.add)
router.get('/invoice/item', ControllerObj.Reguser.list)
router.get('/invoice/item/:id', ControllerObj.Reguser.get)
router.put('/invoice/item/:id', ControllerObj.Reguser.edit)
router.delete('/invoice/item/:id', ControllerObj.Reguser.delete)
export default router;
