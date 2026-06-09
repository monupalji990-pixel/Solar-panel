const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

import templateController from "./controller";
import aws from "../../sharedModules/smallModules/aws";
import passportConfig from "../../bin/passport";

const Template = aws.addProfileImage.fields([
  { name: "template", maxCount: 1 },
]);

const templateObj = new templateController();

router.post(
  "/template/admin/addTemplate",
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  Template,
  templateObj.admin.addTemplate
);
router.post(
  "/template/admin/getFieldsOfPdf",
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5242880 },
    fileFilter: function(req, file, cb) {
      if (file.mimetype === "application/pdf") {
        return cb(null, true);
      } else {
        req.fileValidationError = "Please only upload pdf file";
        return cb(null, false, req.fileValidationError);
      }
    },
  }).single("template"),
  templateObj.admin.getPdfFields
);
router.get("/template/admin/list",passportConfig.isAuthenticated,passportConfig.isAuthorized, templateObj.admin.listTemplates);
router.get("/template/admin/count",passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.listTemplates)
router.get('/template/admin/view/:tempId',passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.viewTemplate);
router.post('/template/admin/update',passportConfig.isAuthenticated,passportConfig.isAuthorized,Template,templateObj.admin.updateTemplate);
router.get('/template/admin/delete/:tempId',passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.deleteTemplate);

router.post(
  "/template/management/addTemplate",
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  Template,
  templateObj.admin.addTemplate
);
router.post(
  "/template/management/getFieldsOfPdf",
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5242880 },
    fileFilter: function(req, file, cb) {
      if (file.mimetype === "application/pdf") {
        return cb(null, true);
      } else {
        req.fileValidationError = "Please only upload pdf file";
        return cb(null, false, req.fileValidationError);
      }
    },
  }).single("template"),
  templateObj.admin.getPdfFields
);
router.get("/template/management/list",passportConfig.isAuthenticated,passportConfig.isAuthorized, templateObj.admin.listTemplates);
router.get("/template/management/count",passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.listTemplates)
router.get('/template/management/view/:tempId',passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.viewTemplate);
router.post('/template/management/update',passportConfig.isAuthenticated,passportConfig.isAuthorized,Template,templateObj.admin.updateTemplate);
router.get('/template/management/delete/:tempId',passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.deleteTemplate);

router.post(
  "/template/partner/addTemplate",
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  Template,
  templateObj.admin.addTemplate
);
router.post(
  "/template/partner/getFieldsOfPdf",
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5242880 },
    fileFilter: function(req, file, cb) {
      if (file.mimetype === "application/pdf") {
        return cb(null, true);
      } else {
        req.fileValidationError = "Please only upload pdf file";
        return cb(null, false, req.fileValidationError);
      }
    },
  }).single("template"),
  templateObj.admin.getPdfFields
);
router.get("/template/partner/list",passportConfig.isAuthenticated,passportConfig.isAuthorized, templateObj.admin.listTemplates);
router.get("/template/partner/count",passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.listTemplates)
router.get('/template/partner/view/:tempId',passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.viewTemplate);
router.post('/template/partner/update',passportConfig.isAuthenticated,passportConfig.isAuthorized,Template,templateObj.admin.updateTemplate);
router.get('/template/partner/delete/:tempId',passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.deleteTemplate);

router.post(
  "/template/sales_rep/addTemplate",
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  Template,
  templateObj.admin.addTemplate
);
router.post(
  "/template/sales_rep/getFieldsOfPdf",
  passportConfig.isAuthenticated,
  passportConfig.isAuthorized,
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5242880 },
    fileFilter: function(req, file, cb) {
      if (file.mimetype === "application/pdf") {
        return cb(null, true);
      } else {
        req.fileValidationError = "Please only upload pdf file";
        return cb(null, false, req.fileValidationError);
      }
    },
  }).single("template"),
  templateObj.admin.getPdfFields
);
router.get("/template/sales_rep/list",passportConfig.isAuthenticated,passportConfig.isAuthorized, templateObj.admin.listTemplates);
router.get("/template/sales_rep/count",passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.listTemplates)
router.get('/template/sales_rep/view/:tempId',passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.viewTemplate);
router.post('/template/sales_rep/update',passportConfig.isAuthenticated,passportConfig.isAuthorized,Template,templateObj.admin.updateTemplate);
router.get('/template/sales_rep/delete/:tempId',passportConfig.isAuthenticated,passportConfig.isAuthorized,templateObj.admin.deleteTemplate);


export default router;