const express = require('express');
const formidable = require('formidable');
const SupplierPriceController = require('../Controller/supplier_rate');

const SupplierPriceContObj = new SupplierPriceController();


const router = express.Router();

const fileMiddleware = (req, res, next) => {
    try {
        let form = new formidable.IncomingForm({ multiples: true, keepExtensions: true, maxFileSize: 100 * 1024 * 1024 });

        form.parse(req, (err, fields, files) => {
            if (err) {
                return res.send({ success: false, message: err.message })
            }
            ;
            console.log(fields)
            req.body = fields;
            try {
                if (files.upload && files.upload.path) {
                    req.file = {
                        path: files.upload.path,
                        name: files.upload.name
                    }
                }
                if (fields.mapper) {
                    req.body.mapper = JSON.parse(fields.mapper);
                }
            } catch (error) {
                return res.send({ success: false, message: error.message })
            }

            next();
        });
    } catch (error) {
        return res.send({ success: false, message: error.message })
    }
}
//dev added
// router.post('/admin/addData', SupplierPriceContObj.addSupplierData);
router.post('/admin/getHeaders', fileMiddleware, SupplierPriceContObj.getExcelHeaders);
router.post('/admin/uploadPostcodes', fileMiddleware, SupplierPriceContObj.addPostcodes);
router.post('/admin/parsePostcodes', fileMiddleware, SupplierPriceContObj.parsePostcodes);
router.post('/admin/ldzFromPostcode', SupplierPriceContObj.getLdzFromPostcodeApi);

router.post('/admin/generateStandardFlatFile/gas', fileMiddleware, SupplierPriceContObj.generateStandardFlatFile);
router.post('/admin/generateStandardFlatFile/electric', fileMiddleware, SupplierPriceContObj.generateStandardFlatFile);
router.post('/admin/addPrices/gas', SupplierPriceContObj.addGasBulkData);
router.post('/admin/addPrices/electric', SupplierPriceContObj.addElectricBulkData);
// router.get('/file:file',SupplierPriceContObj.getFile)
router.get('/file', SupplierPriceContObj.getFile)
router.post('/admin/listData/gas', SupplierPriceContObj.gasListPrices);
router.post('/admin/listData/electric', SupplierPriceContObj.electricListPrices);

router.post('/admin/removeData', SupplierPriceContObj.removeSupplierData);
router.post('/whatsapp-msg',SupplierPriceContObj.whatsappTest)
// router.post('/admin/removeData/electric', SupplierPriceContObj.removeSupplierData);
// router.post('/admin/addSupplier', SupplierContObj.addSupplier);



module.exports = router;
