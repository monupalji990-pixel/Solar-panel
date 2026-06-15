import passportConfig from "../../bin/passport";
const express = require('express');
const router = express.Router();

import aws from "../../sharedModules/smallModules/aws";
import RenewalController from "./controller";
const RenewalObject = new RenewalController();
const Invoice = aws.addProfileImage.fields([{ name: "Invoice", maxCount: 100 }]);
const Attachment = aws.addProfileImage.fields([{ name: "Attachments", maxCount: 10 }]);

router.use("/renewal", passportConfig.isAuthenticated, passportConfig.isAuthorized);
router.use('/renewal', router);

router.post('/regUser/action', RenewalObject.RenewalAction);
router.post('/regUser/revisedSupplier', RenewalObject.RevisedSupplier);
router.get('/regUser/count', RenewalObject.regUser.listRenewalForRegUser);
router.post('/regUser/add_notes', Attachment, RenewalObject.regUser.addNotes);

router.get('/admin/list', RenewalObject.regUser.listRenewalForRegUser);
router.post('/admin/update', RenewalObject.regUser.UpdateRenewalRegUser);
router.post('/admin/updateAssignee', RenewalObject.regUser.UpdateAssigneeRegUser);
router.get('/admin/show/:renewal_id', RenewalObject.regUser.ViewRenewal);
router.get('/admin/delete/:renewal_id', RenewalObject.DeleteRenewal);
router.get('/admin/reject/:renewal_id', RenewalObject.RejectRenewal);
router.post('/admin/provided/:renewal_id', RenewalObject.RenewalProvided);
router.post('/admin/invoiceDetail', Invoice, RenewalObject.RenewalInvoiced);
router.post('/admin/deleteMultiRenewal', Invoice, RenewalObject.DeleteMultiRenewal);
router.post('/admin/rejectMultiRenewal', Invoice, RenewalObject.RejectMultiRenewal);
router.post('/admin/paymentForDebt', RenewalObject.regUser.AddPaymentInfoForDebtService);
router.post('/admin/deletePayment', RenewalObject.regUser.DeletePaymentInfoForDebtService);
router.get('/admin/deleteClosedCompaniesRenewals',RenewalObject.regUser.softDeleteRenewalsForClosedCompanies)

router.get('/management/list', RenewalObject.regUser.listRenewalForRegUser);
router.post('/management/update', RenewalObject.regUser.UpdateRenewalRegUser);
router.post('/management/updateAssignee', RenewalObject.regUser.UpdateAssigneeRegUser);
router.get('/management/show/:renewal_id', RenewalObject.regUser.ViewRenewal);
router.get('/management/delete/:renewal_id', RenewalObject.DeleteRenewal);
router.post('/management/provided/:renewal_id', RenewalObject.RenewalProvided);
router.post('/management/invoiceDetail', Invoice, RenewalObject.RenewalInvoiced);
router.get('/management/delete_request/:renewal_id', RenewalObject.DeleteRequest);
router.post('/management/deleteRequest', RenewalObject.DeleteRequest);
router.post('/management/paymentForDebt', RenewalObject.regUser.AddPaymentInfoForDebtService);
router.post('/management/deletePayment', RenewalObject.regUser.DeletePaymentInfoForDebtService);

router.get('/partner/list', RenewalObject.regUser.listRenewalForRegUser);
router.post('/partner/update', RenewalObject.regUser.UpdateRenewalRegUser);
router.get('/partner/show/:renewal_id', RenewalObject.regUser.ViewRenewal);
router.post('/partner/action', RenewalObject.RenewalAction);
router.get('/partner/download_invoice/:renewal_id', RenewalObject.InvoiceDownload);
router.get('/partner/delete_request/:renewal_id', RenewalObject.DeleteRequest);
router.post('/partner/deleteRequest', RenewalObject.DeleteRequest);

router.get('/sales_rep/list', RenewalObject.regUser.listRenewalForRegUser);
router.post('/sales_rep/update', RenewalObject.regUser.UpdateRenewalRegUser);
router.get('/sales_rep/show/:renewal_id', RenewalObject.regUser.ViewRenewal);
router.post('/sales_rep/action', RenewalObject.RenewalAction);
router.get('/sales_rep/download_invoice/:renewal_id', RenewalObject.InvoiceDownload);
router.get('/sales_rep/delete_request/:renewal_id', RenewalObject.DeleteRequest);
router.post('/sales_rep/deleteRequest', RenewalObject.DeleteRequest);

router.get('/service_partner/list', RenewalObject.regUser.listRenewalForRegUser);
router.get('/service_partner/show/:renewal_id', RenewalObject.regUser.ViewRenewal);
router.post('/service_partner/provided/:renewal_id', RenewalObject.RenewalProvided);
router.post('/service_partner/invoiceDetail', Invoice, RenewalObject.RenewalInvoiced);

export default router;
