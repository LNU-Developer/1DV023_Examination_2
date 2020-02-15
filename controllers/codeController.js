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
    const viewData = {
      snippets: (await Snippet.find({}))
        .map(snippet => ({
          id: snippet._id,
          createdAt: moment(snippet.createdAt).fromNow(),
          // username: snippet.username,
          snippet: snippet.snippet
        }))
        .sort((a, b) => a.username - b.username)
    }
    res.render('home/index', { viewData })
  } catch (error) {
    next(error)
  }
}

codeController.create = async (req, res) => {
  try {
    // Create a new snippet...
    const snippet = new Snippet({
      // username: req.body.username,
      snippet: req.body.snippet
    })
    // ...save the snippet to the database...
    await snippet.save()

    // ...and redirect and show a message.
    req.session.flash = { type: 'success', text: 'The snippet was created successfully.' }
    res.redirect('/')
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    req.session.flash = { type: 'fail', text: error }
    return res.redirect('/new')
  }
}

/**
 * Returns a HTML form for creating a new snippet.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
codeController.new = (req, res) => {
  res.render('home/new')
}

codeController.signup = (req, res) => {
  res.render('home/signup')
}

module.exports = codeController
