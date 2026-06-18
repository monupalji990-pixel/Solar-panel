import passportConfig from "../../bin/passport";
const express = require("express");
const router = express.Router();
import AuthController from "./controller";

const authObj = new AuthController();

router.post('/', authObj.index);
router.post('/login', authObj.login);
router.get('/isLoggedIn', passportConfig.isAuthenticated, authObj.isLoggedIn);
// router.get('/logout', passportConfig.isAuthenticated, authObj.logout);
router.get('/new-update', authObj.NewUpdate);
router.get("/get-all-users", authObj.getAllUsers);
router.get('/isLoggedIn',  authObj.isLoggedIn);
router.get('/logout',  authObj.logout);

export default router;
