const { User } = require('../models')
const path = require('path')
const fs = require('fs/promises')
const Jimp = require('jimp')

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

module.exports = {
  getCurrent,
  updateAvatar
}
