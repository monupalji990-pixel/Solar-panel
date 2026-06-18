
const express = require("express");
const router = express.Router();

import passportConfig from "../../bin/passport";
import ConsumerController from "./controller";
import UserController from "../user/controller";
import CompanyController from "../company/controller";
const ConsumerObject = new ConsumerController();
const UserObject = new UserController();
const CompanyObject = new CompanyController();
import aws from "../../sharedModules/smallModules/aws";
const Attachment = aws.addProfileImage.fields([{ name: "Attachments", maxCount: 10 }]);
const FileUpload = aws.addProfileImage.fields([{ name: "select_a_file_to_upload[]", maxCount: 10 }]);
const Middleware = (passportConfig.isAuthenticated, passportConfig.isAuthorized);

router.use('/consumer', router);

router.post('/create', FileUpload, ConsumerObject.regUser.CreateConsumerFromWebsite);
router.get("/regUser/single_show/:id", ConsumerObject.regUser.SingleConsumerView);
router.post("/regUser/add_notes", Attachment, ConsumerObject.regUser.addNotes);
router.post("/regUser/deleteRequest", Attachment, ConsumerObject.regUser.deleteRequestRegUser);
router.post("/admin/deleteMultiConsumer", Middleware, ConsumerObject.regUser.deleteMultiConsumerRegUser);
router.post("/admin/rejectMultiConsumer", Middleware, ConsumerObject.regUser.deleteRejectConsumerRegUser);

router.post('/regUser/create', ConsumerObject.regUser.addConsumer);
router.get('/regUser/view/:consumer_id', Middleware, ConsumerObject.regUser.viewConsumer);
router.get('/regUser/list', Middleware, ConsumerObject.regUser.listConsumer);
router.get('/regUser/count', Middleware, ConsumerObject.regUser.ConsumerCount);
router.get('/regUser/dropdown_list', Middleware, ConsumerObject.regUser.dropdownListConsumer);
router.post('/regUser/update', Middleware, ConsumerObject.regUser.updateConsumer);
router.get('/regUser/assignee_list', Middleware, UserObject.regUser.assigneeList);
router.post('/regUser/assignee', Middleware, UserObject.regUser.addAssignee);
router.post("/regUser/document/add", Middleware, Attachment, CompanyObject.AddDocument);
router.post("/regUser/citylist",Middleware,ConsumerObject.regUser.getCityList)
// router.post('/regUser/notes/add', Middleware, CompanyObject.AddNotes);

router.post('/admin/remove_assignee', Middleware, UserObject.admin.RemoveAssignee);
router.get("/admin/delete_document/:type/:consumer_id/:document_id", Middleware, CompanyObject.DeleteAttachments);
router.post('/admin/delete', Middleware, ConsumerObject.admin.deleteConsumer);

export default router;