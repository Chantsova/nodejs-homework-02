const { Conflict, Unauthorized } = require('http-errors')
const jwt = require('jsonwebtoken')

const HTTP_CODES = require('../helpers/httpCodes')
const { User } = require('../models/user')

const { SECRET_KEY } = process.env

const signup = async(req, res) => {
  const { name, email, password } = req.body
  const user = await User.findOne({ email })
  if (user) {
    throw new Conflict(`User with ${email} already exist`)
  }

  const newUser = new User({ name, email })
  newUser.setPassword(password)
  newUser.save()
  res.status(HTTP_CODES.CREATED).json({
    status: 'success',
    code: 201,
    data: {
      user: {
        email,
        name
      }
    }
  })
}

const signin = async(req, res) => {
  const { email, password } = req.body
  console.log(password)
  const user = await User.findOne({ email })
  if (!user || !user.comparePassword(password)) {
    throw new Unauthorized('Email or password is wrong')
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
