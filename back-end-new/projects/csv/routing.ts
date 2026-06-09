import passportConfig from "../../bin/passport";
const express = require('express');
const router = express.Router();
const multer = require('multer');
import CsvController from './controller'
const CsvObject = new CsvController();

const invoicestorage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.csv`);
    }
});
let uploadInvoice = multer({
    storage: invoicestorage,
    limits: {
        fieldSize: 250 * 1024 * 1024
    }
});

router.post('/import/regUser/saveCsv', uploadInvoice.single('CSV'), CsvObject.saveCSVAndReturnName);
router.post('/import/regUser/Company', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.importAllInOne);
router.post('/import/regUser/CompanyWithMapping',passportConfig.isAuthenticated,CsvObject.importAllInOneWithMapping);
router.post('/import/regUser/Company_all', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.importAllInOne);
router.post('/import/regUser/Contact', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.importContactCSVData);
router.post('/import/regUser/Site', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.importSiteCSVData);
router.get('/import/regUser/download', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.downloadLogFile);

router.post('/import/regUser/Consumer', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.importConsumerCSVData);
router.get('/export/regUser/Consumer', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportConsumerCSVData);

router.get('/export/regUser/Company', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportCompanyCSVData);
router.get('/export/regUser/Contact', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportContactCSVData);
router.get('/export/regUser/Site', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportSiteCSVData);

router.get('/export/regUser/Gas', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportGasCSVData);
router.get('/export/regUser/Electric', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportElectricCSVData);
router.get('/export/regUser/Water', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportWaterCSVData);
router.get('/export/regUser/ChipAndPin', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportChipAndPinCSVData);
router.get('/export/regUser/Telecoms', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportTelecomsCSVData);
router.get('/export/regUser/Broadband', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportBroadbandCSVData);
router.get('/export/regUser/Energy', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportEnergyCSVData);
router.get('/export/regUser/Funeral', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportFuneralCSVData);
router.get('/export/regUser/Mortgage', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportMortgageCSVData);

router.post('/import/regUser/Quote', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.importQuotesCSVData);

router.get('/export/regUser/renewal/Gas', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportGasCSVData);
router.get('/export/regUser/renewal/Electric', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportElectricCSVData);
router.get('/export/regUser/renewal/Water', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportWaterCSVData);
router.get('/export/regUser/renewal/ChipAndPin', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportChipAndPinCSVData);
router.get('/export/regUser/renewal/Telecoms', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportTelecomsCSVData);
router.get('/export/regUser/renewal/Broadband', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportBroadbandCSVData);
router.get('/export/regUser/renewal/Energy', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportEnergyCSVData);
router.get('/export/regUser/renewal/Funeral', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportFuneralCSVData);
router.get('/export/regUser/renewal/Mortgage', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.exportMortgageCSVData);

router.post('/import/regUser/Renewal', passportConfig.isAuthenticated, passportConfig.isAuthorized, CsvObject.importRenewalCSVData)

export default router;
