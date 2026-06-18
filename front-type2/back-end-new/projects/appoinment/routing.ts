import passportConfig from "../../bin/passport";
import AppoinmentController from './controller'

const router = require('express').Router();

router.use('/appoinment' , passportConfig.isAuthenticated);
router.use('/appoinment',router)

router.post('/',AppoinmentController.add)
router.post('/userList',AppoinmentController.getUserList)
router.get('/list',AppoinmentController.list)
router.get('/group-user',AppoinmentController.listByUser)
router.get('/:id',AppoinmentController.get)
router.put('/:id',AppoinmentController.edit)
router.delete('/:id',AppoinmentController.delete)
router.get('/whatsapp-cron',AppoinmentController.cronFunction)
router.post('/replace-user',AppoinmentController.replaceUser)

export default router;