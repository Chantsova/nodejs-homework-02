const { User } = require('../models')
const path = require('path')
const fs = require('fs/promises')
const Jimp = require('jimp')
const { NotFound } = require('http-errors')
const { sendEmail } = require('../helpers/sendEmail')
const HTTP_CODES = require('../helpers/httpCodes')

const getCurrent = async(req, res) => {
  const { name, email } = req.user
  res.json({
    status: 'success',
    code: 200,
    data: {
      user: {
        name,
        email
      }
    }
  })
}

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars')

const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file
  const imageName = `${req.user.id}_${originalname}`

  try {
    const resultUpload = path.join(avatarsDir, imageName)

    Jimp.read(tempUpload, (err, avatar) => {
      if (err) throw err
      avatar
        .resize(250, 250)
        .write(resultUpload)
    })

    const avatarURL = path.join('public', 'avatars', imageName)
    await User.findByIdAndUpdate(req.user.__id, { avatarURL })
    res.json({ avatarURL })
  } catch (error) {
    await fs.unlink(tempUpload)
    throw error
  }
}

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params
  const user = await User.findOne({ verificationToken })
  if (!user) {
    throw NotFound()
  }

  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null })

  res.json({
    message: 'Verify success'
  })
}

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (user.verify) {
    throw new Error('Verification has already been passed')
  }

  const verificationToken = user.verificationToken

  const mail = {
    to: email,
    subject: 'Confirm email',
    html: `<a target='_blank' href='http://localhost:3000/api/users/verify/${verificationToken}'>Click for email confirmation</a>`
  }

  await sendEmail(mail)

  res.status(HTTP_CODES.OK).json({
    status: 'success',
    code: 200,
    data: {
      user: {
        email,
      }
    },
    message: 'Verification email sent'
  })
}

module.exports = {
  getCurrent,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail
}
