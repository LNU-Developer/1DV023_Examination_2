/**
 * Module for the user controller.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

const userController = {}
const User = require('../models/User')
const moment = require('moment')

/**
 * Displays a list of all users.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
userController.index = async (req, res, next) => {
  try {
    const viewData = {
      users: (await User.find({}))
        .map(user => ({
          id: user._id,
          createdAt: moment(user.createdAt).fromNow(),
          username: user.username
        }))
        .sort((a, b) => a.username - b.username)
    }
    res.render('home/index', { viewData })
  } catch (error) {
    next(error)
  }
}

/**
 * Creates a new user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
userController.create = async (req, res) => {
  try {
    // Create a new user...
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    // ...save the number to the database...
    await user.save()

    // ...and redirect and show a message.
    req.session.flash = { type: 'success', text: 'The user was created successfully.' }
    res.redirect('/')
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    if (error.code === 11000) {
      req.session.flash = { type: 'fail', text: 'User already exist, please try another username' }
    }
    return res.redirect('/signup')
  }
}

module.exports = userController
