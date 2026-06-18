const router = require('express').Router();
let {FormController} = require('./controller')

router.use('/form',router)

router.post('/email-check',FormController.checkCustomerAndUser)
router.post('/',FormController.add)
router.get('/list',FormController.list)
router.put('/:id',FormController.edit)


export default router;