/**
 * Module for the code controller.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'
const Snippet = require('../models/Snippet')
const codeController = {}
const moment = require('moment')

/**
 * Displays a list of all snippets.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
codeController.index = async (req, res, next) => {
  try {
    const userId = req.session.userId
    const viewData = {
      snippets: (await Snippet.find({}))
        .map(snippet => ({
          id: snippet._id,
          usernameId: snippet.usernameId,
          createdAt: moment(snippet.createdAt).fromNow(),
          snippet: snippet.snippet,
          userId: userId
        }))
        .sort((a, b) => a.createdAt - b.createdAt)
    }
    res.render('snippet/index', { viewData, userId }) // TODO: QUESTION: How to fix better middleware to check on every req if user is logged in so it doesnt need to get pushed into every HBS?
  } catch (error) {
    next(error)
  }
}

codeController.create = async (req, res) => {
  try {
    // Create a new snippet...
    const snippet = new Snippet({
      usernameId: req.session.userId,
      snippet: req.body.snippet
    })
    // ...save the snippet to the database...
    await snippet.save()

    // ...and redirect and show a message.
    req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
    res.redirect('/')
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    req.session.flash = { type: 'fail', text: error.message }
    res.redirect('/new')
  }
}

/**
 * Returns a HTML form for creating a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.new = (req, res) => {
  const userId = req.session.userId
  res.render('snippet/new', { userId })
}

/**
 * Returns a HTML form for signing up.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.signup = (req, res) => {
  const userId = req.session.userId
  res.render('snippet/signup', { userId })
}

/**
 * Returns a HTML form for logging out.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.logout = (req, res) => {
  const userId = req.session.userId
  res.render('snippet/login', { userId })
}

/**
 * Returns a HTML form for logging in.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.login = (req, res) => {
  const userId = req.session.userId
  res.render('snippet/login', { userId })
}

/**
 * Edit a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
codeController.show = async (req, res, next) => {
  try {
    const userId = req.session.userId
    const data = await Snippet.find({ _id: req.params.id })
    if (!data[0]._id) { // If no data found send a 404
      const error = new Error('Not found')
      error.statusCode = 404
      console.log('not found')
      return next(error)
    } else if (data[0].usernameId !== userId) { // If trying to change a userId that user doesn't have access to send 403
      console.log('not auth')
      const error = new Error('Not authorized')
      error.statusCode = 403
      return next(error)
    } else {
      const dataId = req.params.id
      const text = data[0].snippet
      res.render('snippet/edit', { dataId, text, userId })
    }
  } catch (error) {
    next(error)
  }
}

/**
 * Edit a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
codeController.edit = async (req, res, next) => {
  try {
    const userId = req.session.userId
    const data = await Snippet.find({ _id: req.params.id })
    if (!data[0]._id) { // If no data found send a 404
      const error = new Error('Not found')
      error.statusCode = 404
      console.log('not found')
      return next(error)
    } else if (data[0].usernameId !== userId) { // If trying to change a userId that user doesn't have access to send 403
      console.log('not auth')
      const error = new Error('Not authorized')
      error.statusCode = 403
      return next(error)
    } else {
      const result = await Snippet.updateOne({ _id: req.params.id }, { snippet: req.body.snippet })
      if (result.nModified === 1) {
        console.log('success')
        req.session.flash = { type: 'success', text: 'The snippet was updated successfully.' }
      } else {
        req.session.flash = { type: 'fail', text: 'The snippet you tried to update, was removed by another user' }
      }
      res.redirect('/')
    }
  } catch (error) {
    next(error)
  }
}

// TODO: QUESTION, why doesn't my error codes work? throw 403 if user tries to access these without auth (remove redirects to reproduce errors)

/**
 * Delete a snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
codeController.delete = async (req, res, next) => {
  try {
    const userId = req.session.userId
    const data = await Snippet.find({ _id: req.params.id })
    if (!data[0]._id) { // If no data found send a 404
      const error = new Error('Not found')
      error.statusCode = 404
      console.log('not found')
      return next(error)
    } else if (data[0].usernameId !== userId) { // If trying to change a userId that user doesn't have access to send 403
      console.log('not auth')
      const error = new Error('Not authorized')
      error.statusCode = 403
      return next(error)
    } else {
      await Snippet.deleteOne({ _id: req.params.id })
      req.session.flash = { type: 'success', text: 'The snippet was deleted successfully.' }
      res.redirect('/')
    }
  } catch (error) {
    next(error)
  }
}

module.exports = codeController
