const { Conflict, Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const { nanoid } = require('nanoid')

const HTTP_CODES = require('../helpers/httpCodes')
const { sendEmail } = require('../helpers/sendEmail')
const { User } = require('../models/user')

const { SECRET_KEY } = process.env

const signup = async(req, res) => {
  const { name, email, password } = req.body

  const user = await User.findOne({ email })
  if (user) {
    throw new Conflict(`User with ${email} already exist`)
  }

  const verificationToken = nanoid()
  const avatarURL = gravatar.url(email)

  const newUser = new User({
    name, email, avatarURL, verificationToken
  })
  newUser.setPassword(password)

  await newUser.save()

  const mail = {
    to: email,
    subject: 'Confirm email',
    html: `<a target='_blank' href='http://localhost:3000/api/users/verify/${verificationToken}'>Click for email confirmation</a>`
  }

  await sendEmail(mail)

  res.status(HTTP_CODES.CREATED).json({
    status: 'success',
    code: 201,
    data: {
      user: {
        email,
        name,
        avatarURL,
        verificationToken
      }
    }
  })
}

const signin = async(req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !user.verify || !user.comparePassword(password)) {
    throw new Unauthorized('Email or password is wrong or email is not verify')
  }

  const payload = {
    id: user._id
  }
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
  await User.findByIdAndUpdate(user._id, { token })
  res.json({
    status: 'success',
    code: 200,
    data: {
      token
    }
  })
}

const logout = async(req, res) => {
  const { _id } = req.user
  await User.findByIdAndUpdate(_id, { token: null })
  res.status(204).json()
}

module.exports = {
  signup,
  signin,
  logout
}
