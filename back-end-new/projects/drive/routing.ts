import passportConfig from "../../bin/passport";
import DriveController from "./controller";

const express = require('express');
const router = express.Router();

router.use('/drive', passportConfig.isAuthenticated, passportConfig.isAuthorized)
router.use('/drive', router);

router.post('/file', DriveController.createFile)
router.post('/folder', DriveController.createFolder)
router.put('/folder/:id', DriveController.editFolderName)
router.post('/list', DriveController.list)
router.delete('/folder/:id', DriveController.deleteFolder)
router.delete('/:id', DriveController.deleteFile)
router.get('/add-default-folder-consumer', DriveController.addDefaultFolderScript)
router.post('/list-all', DriveController.listAll)
router.post('/move-folder', DriveController.moveFolder)
export default router;


