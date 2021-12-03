const express = require('express')
const { ctrlWrapper, validation, auth } = require('../../middlewars')
const { auth: ctrl } = require('../../controllers')
const { joiSignUpSchema, joiSigninSchema } = require('../../models/user')

const router = express.Router()

router.post('/signup', validation(joiSignUpSchema), ctrlWrapper(ctrl.signup))
router.post('/signin', validation(joiSigninSchema), ctrlWrapper(ctrl.signin))
router.post('/logout', auth, ctrlWrapper(ctrl.logout))

module.exports = router
