import passportConfig from "../../bin/passport";
import SendinblueController from "./controller";

const express = require('express');
const router = express.Router();
const SendinblueObject = new SendinblueController();

router.use("/sendinblue", passportConfig.isAuthenticated, passportConfig.isAuthorized);
router.use('/sendinblue', router);

router.get('/admin/listSenders',SendinblueObject.listSenders);

router.post('/admin/getAllIpsOfSender',SendinblueObject.getAllIpsOfSender)

router.get('/admin/listContactlist', SendinblueObject.getListContactList);
router.post('/admin/viewCotactlistDetails',SendinblueObject.getContactListDetails);
router.get('/admin/listContacts', SendinblueObject.listContacts);
router.post('/admin/createContact', SendinblueObject.createContact);
router.post('/admin/updateContact', SendinblueObject.updateContact);
router.post('/admin/viewContact',SendinblueObject.viewContact);
router.post('/admin/deleteContact',SendinblueObject.deleteContact);
router.post('/admin/autoAddContacts',SendinblueObject.autoAddContacts);

router.get('/admin/listCampaigns', SendinblueObject.listCampaigns);
router.post('/admin/createCampaign',SendinblueObject.createCampaign)
router.post('/admin/sendCampaign',SendinblueObject.sendCampaign);
router.post('/admin/viewCampaign',SendinblueObject.viewCampaign);
router.post('/admin/deleteCampaign',SendinblueObject.deleteCampaign);
router.put('/admin/updateCampaign',SendinblueObject.updateCampaign);

router.get('/admin/listTemplates', SendinblueObject.listTemplates);

router.get('/management/listSenders',SendinblueObject.listSenders);

router.post('/management/getAllIpsOfSender',SendinblueObject.getAllIpsOfSender)

router.get('/management/listContactlist', SendinblueObject.getListContactList);
router.post('/management/viewCotactlistDetails',SendinblueObject.getContactListDetails);
router.get('/management/listContacts', SendinblueObject.listContacts);
router.post('/management/createContact', SendinblueObject.createContact);
router.post('/management/updateContact', SendinblueObject.updateContact);
router.post('/management/viewContact',SendinblueObject.viewContact);
router.post('/management/deleteContact',SendinblueObject.deleteContact);


router.get('/management/listCampaigns', SendinblueObject.listCampaigns);
router.post('/management/createCampaign',SendinblueObject.createCampaign)
router.post('/management/sendCampaign',SendinblueObject.sendCampaign);
router.post('/management/viewCampaign',SendinblueObject.viewCampaign);
router.post('/management/deleteCampaign',SendinblueObject.deleteCampaign);
router.put('/management/updateCampaign',SendinblueObject.updateCampaign);

router.get('/management/listTemplates', SendinblueObject.listTemplates);

router.get('/sales_rep/listContactlist', SendinblueObject.getListContactList);

export default router;
