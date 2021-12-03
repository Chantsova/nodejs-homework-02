const { Router } = require('express')
const { joiSchema, favoriteJoiSchema } = require('../../models/contact')
const { ctrlWrapper, validation, auth } = require('../../middlewars')
const { contacts: ctrl } = require('../../controllers')

const router = Router()

router.get('/', auth, ctrlWrapper(ctrl.getAllContacts))
router.get('/:contactId', ctrlWrapper(ctrl.getContactById))
router.post('/', auth, validation(joiSchema), ctrlWrapper(ctrl.addNewContact))
router.delete('/:contactId', ctrlWrapper(ctrl.deleteContactById))
router.put('/:contactId', validation(joiSchema), ctrlWrapper(ctrl.updateContactById))
router.patch('/:contactId/favorite', validation(favoriteJoiSchema), ctrlWrapper(ctrl.updateStatusContact))

module.exports = router
