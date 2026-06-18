import passportConfig from "../../bin/passport";
const express = require("express");
const router = express.Router();
import docusignController from "./controller";

const docusignObj = new docusignController();
const Middleware = (passportConfig.isAuthenticated, passportConfig.isAuthorized);

router.get('/docusign/admin/listTemplates', Middleware, docusignObj.admin.listTemplates)
router.get('/docusign/admin/getToken', Middleware, docusignObj.admin.getToken);
router.post('/docusign/admin/viewTemplate', Middleware, docusignObj.admin.viewTemplate);
router.post('/docusign/admin/listTabs', Middleware, docusignObj.admin.listTabsOfTemplate);
router.post('/docusign/admin/viewTemplateReceipients', Middleware, docusignObj.admin.viewTemplateReceipients)
router.post('/docusign/admin/useTemplate', Middleware, docusignObj.admin.useTemplate)
router.post('/docusign/admin/getEnvelope', Middleware, docusignObj.admin.getEnvelopeDetails);
router.post('/docusign/admin/getEnvelopeStatusDetails', Middleware, docusignObj.admin.getEnvelopeStatusDetails)
router.post('/docusign/admin/audit', Middleware, docusignObj.admin.auditEvents);
router.post('/docusign/admin/dropdown', Middleware, docusignObj.admin.dropdownListModuleWise);

router.get('/docusign/management/listTemplates', Middleware, docusignObj.admin.listTemplates)
router.get('/docusign/management/getToken', Middleware, docusignObj.admin.getToken);
router.post('/docusign/management/viewTemplate', Middleware, docusignObj.admin.viewTemplate);
router.post('/docusign/management/listTabs', Middleware, docusignObj.admin.listTabsOfTemplate);
router.post('/docusign/management/viewTemplateReceipients', Middleware, docusignObj.admin.viewTemplateReceipients)
router.post('/docusign/management/useTemplate', Middleware, docusignObj.admin.useTemplate)
router.post('/docusign/management/getEnvelope', Middleware, docusignObj.admin.getEnvelopeDetails);
router.post('/docusign/management/getEnvelopeStatusDetails', Middleware, docusignObj.admin.getEnvelopeStatusDetails)
router.post('/docusign/management/audit', Middleware, docusignObj.admin.auditEvents);
router.post('/docusign/management/dropdown', Middleware, docusignObj.admin.dropdownListModuleWise);

router.get('/docusign/partner/listTemplates', Middleware, docusignObj.admin.listTemplates)
router.get('/docusign/partner/getToken', Middleware, docusignObj.admin.getToken);
router.post('/docusign/partner/viewTemplate', Middleware, docusignObj.admin.viewTemplate);
router.post('/docusign/partner/listTabs', Middleware, docusignObj.admin.listTabsOfTemplate);
router.post('/docusign/partner/viewTemplateReceipients', Middleware, docusignObj.admin.viewTemplateReceipients)
router.post('/docusign/partner/useTemplate', Middleware, docusignObj.admin.useTemplate)
router.post('/docusign/partner/getEnvelope', Middleware, docusignObj.admin.getEnvelopeDetails);
router.post('/docusign/partner/getEnvelopeStatusDetails', Middleware, docusignObj.admin.getEnvelopeStatusDetails)
router.post('/docusign/partner/audit', Middleware, docusignObj.admin.auditEvents);
router.post('/docusign/partner/dropdown', Middleware, docusignObj.admin.dropdownListModuleWise);

router.get('/docusign/sales_rep/listTemplates', Middleware, docusignObj.admin.listTemplates)
router.get('/docusign/sales_rep/getToken', Middleware, docusignObj.admin.getToken);
router.post('/docusign/sales_rep/viewTemplate', Middleware, docusignObj.admin.viewTemplate);
router.post('/docusign/sales_rep/listTabs', Middleware, docusignObj.admin.listTabsOfTemplate);
router.post('/docusign/sales_rep/viewTemplateReceipients', Middleware, docusignObj.admin.viewTemplateReceipients)
router.post('/docusign/sales_rep/useTemplate', Middleware, docusignObj.admin.useTemplate)
router.post('/docusign/sales_rep/getEnvelope', Middleware, docusignObj.admin.getEnvelopeDetails);
router.post('/docusign/sales_rep/getEnvelopeStatusDetails', Middleware, docusignObj.admin.getEnvelopeStatusDetails)
router.post('/docusign/sales_rep/audit', Middleware, docusignObj.admin.auditEvents);
router.post('/docusign/sales_rep/dropdown', Middleware, docusignObj.admin.dropdownListModuleWise);

export default router;