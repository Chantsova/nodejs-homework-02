const express = require('express')
const { ctrlWrapper, auth, upload, validation } = require('../../middlewars')
const { users: ctrl } = require('../../controllers')
const { joiResendMailSchema } = require('../../models/user')

const router = express.Router()

router.get('/current', auth, ctrlWrapper(ctrl.getCurrent))

router.patch('/avatars', auth, upload.single('avatar'), ctrlWrapper(ctrl.updateAvatar))

router.get('/verify/:verificationToken', ctrlWrapper(ctrl.verifyEmail))

router.post('/verify', validation(joiResendMailSchema), ctrlWrapper(ctrl.resendVerifyEmail))

module.exports = router
