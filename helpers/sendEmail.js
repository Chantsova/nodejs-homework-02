const sgMail = require('@sendgrid/mail')
require('dotenv').config()

const { SENDGRID_KEY } = process.env

sgMail.setApiKey(SENDGRID_KEY)

const sendEmail = async (data) => {
  const email = { ...data, from: 'stasyadiv@gmail.com' }
  sgMail.send(email)
    .then(() => {
      console.log('Email has been sended')
      return true
    })
    .catch(e => console.log(e.message))
}

module.exports = {
  sendEmail
}
