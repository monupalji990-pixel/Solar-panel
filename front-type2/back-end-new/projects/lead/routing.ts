import passportConfig from "../../bin/passport";
import LeadController from "./controller";

const express = require('express');
const router = express.Router();
const LeadObject = new LeadController();
import aws from "../../sharedModules/smallModules/aws";

const Attachment = aws.addProfileImage.fields([{ name: "Attachments", maxCount: 10 }]);

router.post('/upload',aws.addProfileImage.fields([{ name: "image", maxCount: 100 }]),LeadObject.admin.upload)
router.use("/lead", passportConfig.isAuthenticated, passportConfig.isAuthorized);
router.use('/lead', router);

router.get('/regUser/dropdown_list', LeadObject.regUser.LeadDropdownList);
router.get('/regUser/show/:id', LeadObject.regUser.showLeadRegUser);
router.get('/regUser/single_show/:id', LeadObject.regUser.singleViewLead);
router.post('/lead/regUser/assignee_sales_rep', LeadObject.regUser.assigneeSalesRep);
router.post("/regUser/add_notes", Attachment, LeadObject.regUser.addNotes);
router.post("/regUser/sold_service", Attachment, LeadObject.regUser.soldService);
router.post("/regUser/save_service",LeadObject.regUser.saveLeadServiceData);
router.get("/regUser/source_stats",LeadObject.regUser.sourceStats)
router.get('/regUser/digital-dashboard-stats',LeadObject.regUser.digitalDashboardStats)

router.post('/admin/add', LeadObject.regUser.addLeadRegUser);
router.get('/admin/list', LeadObject.regUser.listLeadRegUser);
router.get('/admin/count', LeadObject.regUser.leadCount);
router.post('/admin/update', LeadObject.regUser.updateLeadRegUser);
router.post('/admin/delete', LeadObject.admin.deleteLeadAdmin);
router.post('/admin/deleteLeadRequestAccept', LeadObject.admin.deleteLeadAdmin);
router.post('/admin/deleteLeadRequestReject', LeadObject.admin.deleteLeadRequestRejectAdmin);
router.post('/admin/deleteMultiLead', LeadObject.admin.deleteMultiLeadRegUser);
router.post('/admin/rejectMultiLead', LeadObject.admin.rejectMultiLeadRegUser);
router.post('/admin/getPdf', LeadObject.admin.getPdf);

router.post('/management/add', LeadObject.regUser.addLeadRegUser);
router.get('/management/list', LeadObject.regUser.listLeadRegUser);
router.get('/management/count', LeadObject.regUser.leadCount);
router.post('/management/update', LeadObject.regUser.updateLeadRegUser);
router.post('/management/deleteRequest', LeadObject.regUser.deleteRequestLeadRegUser);

router.post('/partner/add', LeadObject.regUser.addLeadRegUser);
router.get('/partner/list', LeadObject.regUser.listLeadRegUser);
router.get('/partner/count', LeadObject.regUser.leadCount);
router.post('/partner/update', LeadObject.regUser.updateLeadRegUser);
router.post('/partner/deleteRequest', LeadObject.regUser.deleteRequestLeadRegUser);

router.post('/sales_rep/add', LeadObject.regUser.addLeadRegUser);
router.get('/sales_rep/list', LeadObject.regUser.listLeadRegUser);
router.get('/sales_rep/count', LeadObject.regUser.leadCount);
router.post('/sales_rep/update', LeadObject.regUser.updateLeadRegUser);
router.post('/sales_rep/deleteRequest', LeadObject.regUser.deleteRequestLeadRegUser);

router.get('/service_partner/list', LeadObject.regUser.listLeadRegUser);
router.post('/service_partner/update', LeadObject.regUser.updateLeadRegUser);

export default router;
