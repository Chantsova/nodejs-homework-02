const express = require('express')
const { ctrlWrapper, auth, upload } = require('../../middlewars')
const { users: ctrl } = require('../../controllers')

const router = express.Router()

router.get('/current', auth, ctrlWrapper(ctrl.getCurrent))

router.patch('/avatars', auth, upload.single('avatar'), ctrlWrapper(ctrl.updateAvatar))

module.exports = router
