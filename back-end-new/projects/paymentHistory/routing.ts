import passportConfig from "../../bin/passport";
import PaymentController from "./controller";

const express = require("express");
const router = express.Router();
const paymentContObj = new PaymentController()

router.use('/payment', passportConfig.isAuthenticated, passportConfig.isAuthorized);
router.use('/payment', router);

router.post('/regUser/loadSupplierPayment', paymentContObj.Reguser.addSupplierPayment)
router.post('/regUser/addPaymentHistory', paymentContObj.Reguser.addHistory)
router.post('/regUser/splitCommission', paymentContObj.Reguser.splitCommission)
router.post('/regUser/getPaymentHistory', paymentContObj.Reguser.getHistory)
router.post('/regUser/updatePaymentHistory', paymentContObj.Reguser.updateHistory)
router.post('/regUser/listPaymentHistory', paymentContObj.Reguser.listPaymentHistory)
router.post('/regUser/edit-payment', paymentContObj.Reguser.editPayment)
router.post('/regUser/user/commission', paymentContObj.Reguser.loadUserCommission)
router.post('/regUser/user/quotes', paymentContObj.Reguser.fetchUserCommissionQuotes)
router.post('/regUser/edit-bulk-payment', paymentContObj.Reguser.editBulkPayment)
router.post('/regUser/edit-monthly-payment', paymentContObj.Reguser.editMonthlyPayoutRecords)
router.post('/regUser/count', paymentContObj.Reguser.listPaymentHistory);
router.post('/regUser/split-commission-records', paymentContObj.Reguser.splitCommissionRecordsWithFilter)
router.post('/regUser/split-supplier-records', paymentContObj.Reguser.splitSupplierRecordsWithFilter)

export default router;