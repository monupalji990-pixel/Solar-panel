import passportConfig from "../../bin/passport";
const express = require("express");
const router = express.Router();
const multer = require("multer");
import CompanyValidator from "./Modules/companyValidators";

import CompanyController from "./controller";
import ContactController from "../user/controller";

const companyObj = new CompanyController();
const contactObj = new ContactController();

const companyValObj = new CompanyValidator();
import aws from "../../sharedModules/smallModules/aws";
const Attachment = aws.addProfileImage.fields([{ name: "Attachments", maxCount: 10 }]);
const Middleware = (passportConfig.isAuthenticated, passportConfig.isAuthorized);

router.get("/company/regUser/dropdown_list", Middleware, companyObj.CompanyDropdownList);
router.get("/company/regUser/single_show/:id", Middleware, companyObj.SingleCompanyView);
router.get("/company/regUser/single_show_with_site/:id", Middleware, companyObj.SingleCompanyViewWithSite);

router.post("/company/regUser/upload_attachment/:company_id", companyObj.UploadAttachment);
router.get("/company/regUser/download_attachment/:downloadName/:fileName", companyObj.DownloadAttachment);
router.get("/company/regUser/delete_document/:type/:company_id/:document_id", Middleware, companyObj.DeleteAttachments);
router.post("/company/regUser/document/add", Middleware, Attachment, companyObj.AddDocument);
router.get("/company/regUser/documents/:company_id", Middleware, companyObj.FetchNewDocuments);
router.post('/company/regUser/add_notes', Middleware, Attachment, companyObj.AddNotes);
router.get('/company/regUser/notes/show/:company_id', Middleware, companyObj.GetNotes);
router.get("/company/regUser/site_list", Middleware, companyObj.listCompanySiteList);
router.get("/company/regUser/contact_list", Middleware, contactObj.admin.listCompanyContactreguser);

router.get("/company/admin/list", Middleware, companyObj.regUser.listCompanyRegUser);
router.get("/company/admin/count", Middleware, companyObj.regUser.CompanyCount);
router.get('/company/admin/assignee_list', Middleware, companyObj.CompanyAssigneeList);
router.get("/company/admin/list_for_quote", Middleware, companyObj.listCompaniesForQuote);
router.post("/company/admin/add", companyValObj.createCompany, Middleware, companyObj.regUser.createCompanyRegUser);
router.post("/company/admin/deleteCompany", Middleware, companyObj.deleteRequestAcceptAdmin);
router.post("/company/admin/deleteMultiCompany", Middleware, companyObj.regUser.deleteMultiCompanyRegUser);
router.post("/company/admin/rejectMultiCompany", Middleware, companyObj.regUser.deleteRejectCompanyRegUser);
router.post("/company/admin/edit", Middleware, companyObj.updateCompany);
router.post("/company/admin/updatePartner", Middleware, companyObj.regUser.updateCompanyPartnerRegUser);
router.get("/company/admin/show/:id", Middleware, companyObj.regUser.showCompanyRegUser);
router.post("/company/admin/active_company_reg_user", Middleware, companyObj.regUser.activeCompanyreguser);
router.post("/company/admin/delete_request_accept", Middleware, companyObj.deleteRequestAcceptAdmin);
router.post("/company/admin/delete_request_reject", Middleware, companyObj.deleteRequestRejectAdmin);
router.post("/company/admin/block_company", Middleware, companyObj.regUser.blockUnblockreguser);
router.post("/company/admin/unblock_company", Middleware, companyObj.regUser.blockUnblockreguser);
router.post("/company/admin/assignee", Middleware, companyObj.AddAssigneeRegUser);
router.post("/company/admin/dropdownCompanyForLead", Middleware, companyObj.DropdownCompaniesAndSitesForLead);
router.post("/company/admin/dropdownSiteForLead", Middleware, companyObj.DropdownSitesForLead);

router.get("/company/management/list", Middleware, companyObj.regUser.listCompanyRegUser);
router.get("/company/management/count", Middleware, companyObj.regUser.CompanyCount);
router.get("/company/management/list_for_quote", Middleware, companyObj.listCompaniesForQuote);
router.post("/company/management/add", companyValObj.createCompany, Middleware, companyObj.regUser.createCompanyRegUser);
router.post("/company/management/edit", Middleware, companyObj.updateCompany);
router.post("/company/management/updatePartner", Middleware, companyObj.regUser.updateCompanyPartnerRegUser);
router.post("/company/management/activeCompanyreguser", Middleware, companyObj.regUser.activeCompanyreguser);
router.get("/company/management/show/:id", Middleware, companyObj.regUser.showCompanyRegUser);
router.post("/company/management/deleteRequest", Middleware, companyObj.regUser.deleteRequestRegUser);
router.post("/company/management/blockCompany", Middleware, companyObj.regUser.blockUnblockreguser);
router.post("/company/management/unblockCompany", Middleware, companyObj.regUser.blockUnblockreguser);
router.post("/company/management/assignee", Middleware, companyObj.AddAssigneeRegUser);
router.get('/company/management/assignee_list', Middleware, companyObj.CompanyAssigneeList);
router.post("/company/management/dropdownCompanyForLead", Middleware, companyObj.DropdownCompaniesAndSitesForLead);
router.post("/company/management/dropdownSiteForLead", Middleware, companyObj.DropdownSitesForLead);

router.get("/company/partner/list", Middleware, companyObj.regUser.listCompanyRegUser);
router.get("/company/partner/count", Middleware, companyObj.regUser.CompanyCount);
router.get("/company/partner/d_list", Middleware, companyObj.DropdownCompanies);
router.post("/company/partner/add", companyValObj.createCompany, Middleware, companyObj.regUser.createCompanyRegUser);
router.post("/company/partner/edit", Middleware, companyObj.updateCompany);
router.post("/company/partner/activeCompanyreguser", Middleware, companyObj.regUser.activeCompanyreguser);
router.get("/company/partner/show/:id", Middleware, companyObj.regUser.showCompanyRegUser);
router.post("/company/partner/deleteRequest", Middleware, companyObj.regUser.deleteRequestRegUser);
router.post("/company/partner/blockCompany", Middleware, companyObj.regUser.blockUnblockreguser);
router.post("/company/partner/unblockCompany", Middleware, companyObj.regUser.blockUnblockreguser);
router.get("/company/sales_rep/list", Middleware, companyObj.regUser.listCompanyRegUser);
router.post("/company/sales_rep/add", companyValObj.createCompany, Middleware, companyObj.regUser.createCompanyRegUser);
router.get("/company/sales_rep/count", Middleware, companyObj.regUser.CompanyCount);
router.get("/company/sales_rep/d_list", Middleware, companyObj.DropdownCompanies);
router.get("/company/sales_rep/show/:id", Middleware, companyObj.regUser.showCompanyRegUser);
router.post("/company/sales_rep/edit", Middleware, companyObj.updateCompany);
router.post("/company/sales_rep/update_company", Middleware, companyObj.updateCompanyIntroducer);
router.post("/company/sales_rep/deleteRequest", Middleware, companyObj.regUser.deleteRequestRegUser);

router.get("/company/observing_partner/list", Middleware, companyObj.regUser.listCompanyRegUser);
router.get("/company/observing_partner/count", Middleware, companyObj.regUser.CompanyCount);
router.get("/company/observing_partner/show/:id", Middleware, companyObj.regUser.showCompanyRegUser);

router.get("/company/service_partner/list", Middleware, companyObj.regUser.listCompanyRegUser);
router.get("/company/service_partner/show/:id", Middleware, companyObj.regUser.showCompanyRegUser);

router.get("/company/installer/list", Middleware, companyObj.regUser.listCompanyRegUser);
router.get("/company/installer/show/:id", Middleware, companyObj.regUser.showCompanyRegUser);

router.get("/company/surveyor/list", Middleware, companyObj.regUser.listCompanyRegUser);
router.get("/company/surveyor/show/:id", Middleware, companyObj.regUser.showCompanyRegUser);

export default router;
