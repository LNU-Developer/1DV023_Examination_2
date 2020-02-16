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
    res.render('snippet/index', { viewData, userId })
  } catch (error) {
    next(error)
  }
}

codeController.create = async (req, res) => { // TODO: redirect if not logged in
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

// TODO: create cases for edit and delete
// TODO: throw 403 if user tries to access these without auth

module.exports = codeController
