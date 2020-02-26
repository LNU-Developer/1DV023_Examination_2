/**
 * Module for the user controller.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

const userController = {}
const User = require('../models/User')

/**
 * Creates a new user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
userController.create = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      throw new Error('Both fields needs to be entered')
    }

    const user = new User({
      username: req.body.username.toLowerCase(),
      password: req.body.password
    })
    // ...save the number to the database...
    await user.save()
    const data = await User.find({ username: req.body.username })

    // Save the user ID of the logged in user to session

    req.session.userId = data[0]._id
    // ...and redirect and show a message.
    req.session.flash = {
      type: 'success',
      text: 'The user was created successfully, you are logged in.'
    }
    res.redirect('/')
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    if (error.code === 11000) {
      req.session.flash = {
        type: 'danger',
        text: 'User already exist, please try another username'
      }
    } else {
      req.session.flash = {
        type: 'danger',
        text: error.message
      }
    }
    return res.redirect('/signup')
  }
}

userController.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/')
  })
}

/**
 * Login a user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
userController.login = async (req, res) => {
  try {
    const user = await User.authenticate(req.body.username.toLowerCase(), req.body.password)
    req.session.userId = user._id
    req.session.flash = { type: 'success', text: 'Login successful' }
    res.redirect('/')
  } catch (error) {
  // If an error, or validation error, occurred, view the form and an error message.
    req.session.flash = {
      type: 'danger',
      text: error.message
    }
    return res.redirect('/login')
  }
}

module.exports = userController
