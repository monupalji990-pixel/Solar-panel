const express = require('express');
import passportConfig from "../../bin/passport";
const router = express.Router();

import SupplierController from './controller';
const SupplierObject = new SupplierController();

import aws from "../../sharedModules/smallModules/aws";
const Attachment = aws.addProfileImage.fields([{ name: "Attachments", maxCount: 10 }]);
const LogoAttachment = aws.addProfileImage.fields([
    {name:"logo",maxCount:1}
]);
const Middleware = (passportConfig.isAuthenticated, passportConfig.isAuthorized);

router.use('/supplier', router);

router.get('/regUser/count', Middleware, SupplierObject.supplierList);
router.post('/regUser/add_document', Middleware, Attachment, SupplierObject.AddDocument);
router.post('/regUser/add_reading', Middleware, Attachment, SupplierObject.AddMeterReading);
router.get('/regUser/detail/:supplier_id', Middleware, SupplierObject.ViewSupplierDetails);
router.get('/regUser/reading_document/:company_id', Middleware, SupplierObject.FetchNewReadings);
router.get("/regUser/delete_document/:type/:supplier_id/:document_id", Middleware, SupplierObject.DeleteAttachments);

router.post('/admin/create', Middleware, SupplierObject.addNewSupplier);
router.post('/admin/uploadLogo',Middleware,LogoAttachment,(req,res,next)=>{
    try {    
        if(req?.files?.logo?.length > 0){
            return res.send({success:true , url:req.files.logo[0].location})
          }     
    } catch (error) {
            return res.send({success:false,message:error.message})      
    }
})
router.post('/admin/removeLogo',Middleware,SupplierObject.removeLogo)
router.post('/admin/update', Middleware,SupplierObject.UpdateSupplier);
router.get('/admin/list', Middleware, SupplierObject.supplierList);
router.get('/admin/show/:supplier_id', Middleware, SupplierObject.ViewSupplierDetails);
router.get('/admin/delete/:supplier_id', Middleware, SupplierObject.supplierDelete);
router.get('/admin/block/:supplier_id', Middleware, SupplierObject.supplierBlock);
router.get('/admin/unblock/:supplier_id', Middleware, SupplierObject.supplierUnBlock);
router.get('/admin/contact_list', Middleware, SupplierObject.SupplierContactList);
router.get('/admin/contact', Middleware, SupplierObject.ViewSupplierContact);
router.post('/admin/contact/add', Middleware, SupplierObject.SupplierContactAdd);
router.post('/admin/contact/delete', Middleware, SupplierObject.SupplierContactDelete);
router.post('/admin/contact/update', Middleware, SupplierObject.SupplierContactUpdate);

router.post('/management/create', Middleware, SupplierObject.addNewSupplier);
router.post('/management/update', Middleware, SupplierObject.UpdateSupplier);
router.get('/management/list', Middleware, SupplierObject.supplierList);
router.get('/management/show/:supplier_id', Middleware, SupplierObject.ViewSupplierDetails);
router.get('/management/delete/:supplier_id', Middleware, SupplierObject.supplierDelete);
router.get('/management/block/:supplier_id', Middleware, SupplierObject.supplierBlock);
router.get('/management/unblock/:supplier_id', Middleware, SupplierObject.supplierUnBlock);
router.get('/management/contact_list', Middleware, SupplierObject.SupplierContactList);
router.get('/management/contact', Middleware, SupplierObject.ViewSupplierContact);
router.post('/management/contact/add', Middleware, SupplierObject.SupplierContactAdd);
router.post('/management/contact/update', Middleware, SupplierObject.SupplierContactUpdate);
router.post('/management/contact/delete', Middleware, SupplierObject.SupplierContactDelete);

router.get('/partner/list', Middleware, SupplierObject.supplierList);

router.get('/sales_rep/list', Middleware, SupplierObject.supplierList);
router.get('/sales_rep/show/:supplier_id', Middleware, SupplierObject.ViewSupplierDetails);
router.get('/sales_rep/contact_list', Middleware, SupplierObject.SupplierContactList);
router.get('/sales_rep/contact', Middleware, SupplierObject.ViewSupplierContact);

router.get('/service_partner/list', Middleware, SupplierObject.supplierList);

export default router;