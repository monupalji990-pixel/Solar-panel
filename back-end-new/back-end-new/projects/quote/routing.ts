import passportConfig from "../../bin/passport";
import QuoteController from "./controller";
import aws from "../../sharedModules/smallModules/aws";
import SolarController from "./solar"

const express = require("express");
const router = express.Router();
const quoteObj = new QuoteController();
const Invoice = aws.addProfileImage.fields([{ name: "Invoice", maxCount: 1 }]);
const Attachment = aws.addProfileImage.fields([{ name: "Attachments", maxCount: 10 }]);

router.use('/quote', passportConfig.isAuthenticated, passportConfig.isAuthorized);
router.use('/quote', router);

router.post('/regUser/quoteAction', quoteObj.regUser.QuoteActions);
router.post('/regUser/revisedSupplier', quoteObj.regUser.RevisedSupplier);
router.get('/regUser/dropdown_list', quoteObj.regUser.QuoteDropdownList);
router.post('/regUser/add_notes', Attachment, quoteObj.regUser.addNotes);
router.get('/regUser/count', quoteObj.admin.listOfQuotes);

router.post('/quote/admin/getPdf', quoteObj.admin.getPdf);
router.post('/admin/create', quoteObj.regUser.CreateQuote);
router.post('/admin/createRenewalFromQuote', quoteObj.regUser.createRenewalFromQuote)
router.post('/admin/createDuplicateQuote', quoteObj.regUser.createDuplicateQuote)
router.post('/admin/update', quoteObj.admin.UpdateQuoteRegUser);
router.get('/admin/list', quoteObj.admin.listOfQuotes);
router.get('/admin/show/:quote_id', quoteObj.regUser.ViewQuote);
router.post('/admin/provided/:quote_id', quoteObj.admin.QuoteProvided);
router.post('/admin/invoiceDetail', Invoice, quoteObj.admin.AdminQuoteUpdateInvoiceDetails);
router.get('/admin/deleteQuote/:quote_id', quoteObj.admin.AdminDeleteQuote);
router.get('/admin/blockQuote/:quote_id', quoteObj.admin.AdminBlockQuote);
router.get('/admin/unBlockQuote/:quote_id', quoteObj.admin.AdminUnBlockQuote);
router.get('/admin/acceptQuoteDeleteRequest/:quote_id', quoteObj.admin.AdminDeleteQuote);
router.get('/admin/rejectQuoteDeleteRequest/:quote_id', quoteObj.admin.AdminRejectQuoteDeleteRequest);
router.post('/admin/deleteMultiQuote', quoteObj.admin.DeleteMultiQuote);
router.post('/admin/updateAssignee', quoteObj.admin.UpdateAssigneeRegUser);
router.get('/admin/restart/:quote_id', quoteObj.admin.RestartQuote);
router.post('/admin/rejectMultiQuote', quoteObj.admin.RejectMultiQuote);
router.post('/admin/paymentForDebt', quoteObj.admin.AddPaymentInfoForDebtService);
router.post('/admin/deletePayment', quoteObj.admin.DeletePaymentInfoForDebtService);


router.get('/management/restart/:quote_id', quoteObj.admin.RestartQuote);
router.post('/management/create', quoteObj.regUser.CreateQuote);
router.post('/management/createRenewalFromQuote', quoteObj.regUser.createRenewalFromQuote);
router.post('/management/createDuplicateQuote', quoteObj.regUser.createDuplicateQuote)
router.post('/management/update', quoteObj.admin.UpdateQuoteRegUser);
router.get('/management/list', quoteObj.admin.listOfQuotes);
router.get('/management/show/:quote_id', quoteObj.regUser.ViewQuote);
router.post('/management/provided/:quote_id', quoteObj.admin.QuoteProvided);
router.post('/management/quoteUpdateInvoiceDetails/:quote_id', Invoice, quoteObj.admin.AdminQuoteUpdateInvoiceDetails);
router.get('/management/deleteQuoteRequest/:quote_id', quoteObj.admin.AdminDeleteQuoteRequest);
router.get('/management/blockQuote/:quote_id', quoteObj.admin.AdminBlockQuote);
router.get('/management/unBlockQuote/:quote_id', quoteObj.admin.AdminUnBlockQuote);
router.post('/management/updateAssignee', quoteObj.admin.UpdateAssigneeRegUser);
router.post('/management/invoiceDetail', Invoice, quoteObj.admin.AdminQuoteUpdateInvoiceDetails);
router.post('/management/quoteDeleteRequest', passportConfig.isAuthenticated, passportConfig.isAuthorized, quoteObj.partner.QuoteDeleteRequestByPI);
router.post('/management/paymentForDebt', quoteObj.admin.AddPaymentInfoForDebtService);
router.post('/management/deletePayment', quoteObj.admin.DeletePaymentInfoForDebtService);


router.post('/partner/create', quoteObj.regUser.CreateQuote);
router.post('/partner/createRenewalFromQuote', quoteObj.regUser.createRenewalFromQuote);
router.post('/partner/createDuplicateQuote', quoteObj.regUser.createDuplicateQuote)
router.post('/partner/update', quoteObj.admin.UpdateQuoteRegUser);
router.get('/partner/list', quoteObj.admin.listOfQuotes);
router.get('/partner/show/:quote_id', quoteObj.regUser.ViewQuote);
router.post('/partner/quoteDeleteRequest', quoteObj.partner.QuoteDeleteRequestByPI);
router.post('/partner/blockQuote', quoteObj.partner.QuoteBlockUnBlockByPI);
router.post('/partner/unblockQuote', quoteObj.partner.QuoteBlockUnBlockByPI);
router.get('/partner/quoteInvoice/:quote_id', quoteObj.partner.InvoiceDownloadByPI);

router.post('/sales_rep/create', quoteObj.regUser.CreateQuote);
router.post('/sales_rep/createRenewalFromQuote', quoteObj.regUser.createRenewalFromQuote)
router.post('/sales_rep/createDuplicateQuote', quoteObj.regUser.createDuplicateQuote)
router.post('/sales_rep/update', quoteObj.admin.UpdateQuoteRegUser);
router.get('/sales_rep/list', quoteObj.admin.listOfQuotes);
router.get('/sales_rep/show/:quote_id', quoteObj.regUser.ViewQuote);
router.get('/sales_rep/quoteInvoice/:quote_id', quoteObj.partner.InvoiceDownloadByPI);
router.post('/sales_rep/quoteDeleteRequest', quoteObj.partner.QuoteDeleteRequestByPI);

router.get('/observing_partner/list', quoteObj.admin.listOfQuotes);
router.get('/observing_partner/show/:quote_id', quoteObj.regUser.ViewQuote);

router.get('/service_partner/list', quoteObj.admin.listOfQuotes);
router.get('/service_partner/show/:quote_id', quoteObj.regUser.ViewQuote);
router.post('/service_partner/provided/:quote_id', quoteObj.admin.QuoteProvided);
router.post('/service_partner/invoiceDetail', Invoice, quoteObj.admin.AdminQuoteUpdateInvoiceDetails);
router.post('/service_partner/update', quoteObj.admin.UpdateQuoteRegUser);

// solar routes

router.post('/data-from-opensolar',SolarController.getDataFromUrl)

export default router;
