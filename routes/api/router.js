const { Router } = require('express')
const contactsController = require('../../controllers/controller.js')
const { joiSchema, favoriteJoiSchema } = require('../../models/contact')

const router = Router()

const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      error.status = 400
      next(error)
    }
    next()
  }
}

router.get('/', contactsController.getAllContacts)
router.get('/:contactId', contactsController.getContactById)
router.post('/', validation(joiSchema), contactsController.addNewContact)
router.delete('/:contactId', contactsController.deleteContactById)
router.put('/:contactId', validation(joiSchema), contactsController.updateContactById)
router.patch('/:contactId/favorite', validation(favoriteJoiSchema), contactsController.updateStatusContact)

module.exports = router
