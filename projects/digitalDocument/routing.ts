const express = require("express");
const router = express.Router();
import aws from "../../sharedModules/smallModules/aws";
import digitalDocumentController from "./controller";
import passportConfig from "../../bin/passport";
const digitalDocumentObj = new digitalDocumentController();
const multer = require("multer");

const document = aws.addProfileImage.fields([
    {name:"document",maxCount:1}
]);

const middleValidation = (req,res,next) =>{
    try {
        if(!req.body.type){
            throw {message:"Type is required"};
        }
        if(!req.body.templateId){
            throw {message: "Template id required"};
        }
        if(req.body.type === "company" && !req.body.companyId){
              throw {message:"Company id required"};
        }
        if(req.body.type === "quote" && !req.body.quoteId ){
            throw {message:"Quote id required"};
        }
        if(req.body.type === "renewal" && !req.body.renewalId ){
          throw {message:"Renewal id required"};
      }
        if(!req.body.mode){
            throw {message:"Mode required"}
        }
        next()
    } catch (error) {
        console.log(error);
        res.send({success:false,message:error.message});
    }
}

router.post("/digitalDocument/admin/generatePopulatedPdf",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.generatePopulatedPdf);
router.post("/digitalDocument/admin/savePdf", passportConfig.isAuthenticated,passportConfig.isAuthorized,middleValidation,aws.putBase64,digitalDocumentObj.admin.savePdf);
router.post("/digitalDocument/admin/attachReadOnly", passportConfig.isAuthenticated,passportConfig.isAuthorized,multer({
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
}).single("document"),digitalDocumentObj.admin.makeReadOnlyPdfFormFields);
router.post("/digitalDocument/admin/attachSignedPdf",passportConfig.isAuthenticated,passportConfig.isAuthorized,document,digitalDocumentObj.admin.attachSignedPdf);
router.get("/digitalDocument/admin/list/quote/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);
router.get("/digitalDocument/admin/list/company/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);
router.get("/digitalDocument/admin/list/renewal/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);

router.get("/digitalDocument/admin/view/:digitalDocumentId",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.viewDocument);

router.post("/digitalDocument/management/generatePopulatedPdf",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.generatePopulatedPdf);
router.post("/digitalDocument/management/savePdf", passportConfig.isAuthenticated,passportConfig.isAuthorized,middleValidation,aws.putBase64,digitalDocumentObj.admin.savePdf);
router.post("/digitalDocument/management/attachReadOnly", passportConfig.isAuthenticated,passportConfig.isAuthorized,multer({
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
}).single("document"),digitalDocumentObj.admin.makeReadOnlyPdfFormFields);
router.post("/digitalDocument/management/attachSignedPdf",passportConfig.isAuthenticated,passportConfig.isAuthorized,document,digitalDocumentObj.admin.attachSignedPdf);
router.get("/digitalDocument/management/list/quote/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);
router.get("/digitalDocument/management/list/company/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);
router.get("/digitalDocument/management/list/renewal/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);
router.get("/digitalDocument/management/view/:digitalDocumentId",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.viewDocument);

router.post("/digitalDocument/partner/generatePopulatedPdf",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.generatePopulatedPdf);
router.post("/digitalDocument/partner/savePdf", passportConfig.isAuthenticated,passportConfig.isAuthorized,middleValidation,aws.putBase64,digitalDocumentObj.admin.savePdf);
router.post("/digitalDocument/partner/attachReadOnly", passportConfig.isAuthenticated,passportConfig.isAuthorized,multer({
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
}).single("document"),digitalDocumentObj.admin.makeReadOnlyPdfFormFields);
router.post("/digitalDocument/partner/attachSignedPdf",passportConfig.isAuthenticated,passportConfig.isAuthorized,document,digitalDocumentObj.admin.attachSignedPdf);
router.get("/digitalDocument/partner/list/quote/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);
router.get("/digitalDocument/partner/list/company/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);
router.get("/digitalDocument/partner/list/renewal/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);

router.get("/digitalDocument/partner/view/:digitalDocumentId",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.viewDocument);

router.post("/digitalDocument/sales_rep/generatePopulatedPdf",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.generatePopulatedPdf);
router.post("/digitalDocument/sales_rep/savePdf", passportConfig.isAuthenticated,passportConfig.isAuthorized,middleValidation,aws.putBase64,digitalDocumentObj.admin.savePdf);
router.post("/digitalDocument/sales_rep/attachReadOnly", passportConfig.isAuthenticated,passportConfig.isAuthorized,multer({
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
}).single("document"),digitalDocumentObj.admin.makeReadOnlyPdfFormFields);
router.post("/digitalDocument/sales_rep/attachSignedPdf",passportConfig.isAuthenticated,passportConfig.isAuthorized,document,digitalDocumentObj.admin.attachSignedPdf);
router.get("/digitalDocument/sales_rep/list/quote/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);
router.get("/digitalDocument/sales_rep/list/company/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);
router.get("/digitalDocument/sales_rep/list/renewal/:id",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.listDocuments);

router.get("/digitalDocument/sales_rep/view/:digitalDocumentId",passportConfig.isAuthenticated,passportConfig.isAuthorized,digitalDocumentObj.admin.viewDocument);


export default router;