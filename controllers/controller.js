const HTTP_CODES = require('../helpers/httpCodes')
const HTTP_ERROR = require('../helpers/httpError')
const { Contact } = require('../models/contact')

const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contact.find({})
    res.status(HTTP_CODES.OK).json({
      status: 'success',
      code: 200,
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const result = await Contact.findOne({ _id: contactId })

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
  } catch (error) {
    next(error)
  }
}

const addNewContact = async (req, res, next) => {
  try {
    const result = await Contact.create(req.body)
    res.status(HTTP_CODES.CREATED).json({
      status: 'success',
      code: 201,
      data: {
        result
      }
    })
  } catch (error) {
    next(error)
  }
}

const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params
    const result = await Contact.deleteOne({ _id: contactId })
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
  } catch (error) {
    next(error)
  }
}

const updateContactById = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error)
  }
}

const updateStatusContact = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error)
  }
}

module.exports = { getAllContacts, getContactById, addNewContact, deleteContactById, updateContactById, updateStatusContact }
