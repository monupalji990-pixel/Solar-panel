import passportConfig from "../../bin/passport";
import DriveController from "./controller";

const express = require('express');
const router = express.Router();

router.use('/drive-new', passportConfig.isAuthenticated, passportConfig.isAuthorized)
router.use('/drive-new',router);

router.post('/file',DriveController.createFile)
router.post('/folder',DriveController.createFolder)
router.put('/folder/:id',DriveController.editFolderName)
router.post('/list',DriveController.list)
router.get('/list-all',DriveController.listAll)
router.post('/move-folder',DriveController.moveFolder)

router.delete('/folder/:id',DriveController.deleteFolder)
router.delete('/:id',DriveController.deleteFile)

export default router;


