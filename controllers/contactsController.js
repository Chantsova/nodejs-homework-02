const HTTP_CODES = require('../helpers/httpCodes')
const HTTP_ERROR = require('../helpers/httpError')
const { Contact } = require('../models/contact')

const getAllContacts = async(req, res) => {
  const { _id } = req.user
  const { page = 1, limit = 10 } = req.query
  const skip = (page - 1) * limit

  const contacts = await Contact.find({ owner: _id }, '', { skip, limit: Number(limit) })
    .populate('owner', '_id name email')

  res.status(HTTP_CODES.OK).json({
    status: 'success',
    code: 200,
    data: {
      result: contacts
    }
  })
}

const getContactById = async(req, res) => {
  const { contactId } = req.params
  const result = await Contact.findById({ _id: contactId })

  if (!result) {
    throw new HTTP_ERROR(HTTP_CODES, `Contact with id=${contactId} not found`)
  }

  res.status(HTTP_CODES.OK).json({
    status: 'success',
    code: 200,
    data: {
      result
    }
  })
}

const addNewContact = async(req, res) => {
  const { _id } = req.user
  const result = await Contact.create({ ...req.body, owner: _id })
  res.status(HTTP_CODES.CREATED).json({
    status: 'success',
    code: 201,
    data: {
      result
    }
  })
}

const deleteContactById = async(req, res) => {
  const { contactId } = req.params
  const result = await Contact.findByIdAndRemove({ _id: contactId })
  if (!result) {
    throw new HTTP_ERROR(HTTP_CODES, `Contact with id=${contactId} not found`)
  }
  res.status(HTTP_CODES.OK).json({
    status: 'success',
    code: 200,
    message: 'Contact deleted',
    data: {
      result
    }
  })
}

const updateContactById = async(req, res) => {
  const { contactId } = req.params
  const result = await Contact.findByIdAndUpdate({ _id: contactId }, req.body, { new: true })
  if (!result) {
    throw new HTTP_ERROR(HTTP_CODES, `Contact with id=${contactId} not found`)
  }
  res.status(HTTP_CODES.OK).json({
    status: 'success',
    code: 200,
    data: {
      result
    }
  })
}

const updateStatusContact = async(req, res) => {
  const { contactId } = req.params
  const { favorite } = req.body
  const result = await Contact.findByIdAndUpdate({ _id: contactId }, { favorite }, { new: true })
  if (!result) {
    throw new HTTP_ERROR(HTTP_CODES, `Contact with id=${contactId} not found`)
  }
  res.status(HTTP_CODES.OK).json({
    status: 'success',
    code: 200,
    data: {
      result
    }
  })
}

module.exports = { getAllContacts, getContactById, addNewContact, deleteContactById, updateContactById, updateStatusContact }
