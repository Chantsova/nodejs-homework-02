const { Schema, model } = require('mongoose')
const Joi = require('joi')
const bcrypt = require('bcrypt')

const userSchema = Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  avatarURL: {
    type: String,
    required: [true, 'Avatar is required']
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter'
  },
  token: {
    type: String,
    default: null
  }
}, { versionKey: false, timestamps: true })

userSchema.methods.setPassword = function(password) {
  this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

const joiSignUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required()
})

const joiSigninSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required()
})

const User = model('user', userSchema)

module.exports = {
  User,
  joiSignUpSchema,
  joiSigninSchema
}
