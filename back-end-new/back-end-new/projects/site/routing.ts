import passportConfig from "../../bin/passport";
const express = require('express');
const router = express.Router();

import SiteController from './controller'
const SiteObject = new SiteController();

router.get('/site/regUser/show/:id', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.viewSite);

router.post('/site/admin/add', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.addSiteRegUser);
router.post('/site/admin/edit', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.editSite);
router.get('/site/admin/list', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.listCompanySite);
router.post('/site/admin/deleteSite', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.deleteSite);

router.post('/site/management/add', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.addSiteRegUser);
router.get('/site/management/list', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.listCompanySite);
router.post('/site/management/edit', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.editSite);
router.post('/site/management/deleteSite', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.deleteSite);

router.post('/site/partner/add', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.addSiteRegUser);
router.get('/site/partner/list', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.listCompanySite);
router.post('/site/partner/edit', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.editSite);
router.post('/site/partner/deleteSite', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.deleteSite);

router.post('/site/sales_rep/add', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.addSiteRegUser);
router.post('/site/sales_rep/edit', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.regUser.editSite);
router.post('/site/sales_rep/deleteSite', passportConfig.isAuthenticated, passportConfig.isAuthorized, SiteObject.deleteSiteIntroducer);

export default router;