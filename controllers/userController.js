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
    // Create a new user...   //TODO:Validate input to see that it contains both user and password
    const user = new User({
      username: req.body.username,
      password: req.body.password // TODO: hash password
    })
    // ...save the number to the database...
    await user.save()
    const data = await User.find({ username: req.body.username })

    // Save the user ID of the logged in user to session
    req.session.userId = data[0]._id
    // ...and redirect and show a message.
    req.session.flash = { type: 'success', text: 'The user was created successfully, you are logged in.' }
    res.redirect('/')
  } catch (error) {
    // If an error, or validation error, occurred, view the form and an error message.
    if (error.code === 11000) {
      req.session.flash = { type: 'fail', text: 'User already exist, please try another username' }
    } else {
      req.session.flash = { type: 'fail', text: error.message }
    }
    return res.redirect('/signup')
  }
}

userController.logout = (req, res) => {
  // TODO: redirect to protection layer (check if user is logged in)
  req.session.destroy(() => {
    req.session.flash = { type: 'success', text: 'Logout successful' }
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
// TODO: redirect to protection layer (check if user is logged in)
  try {
    const data = await User.find({ username: req.body.username })
    if (data[0].password === req.body.password) {
      req.session.userId = data[0]._id
      req.session.flash = { type: 'success', text: 'Login successful' }
      res.redirect('/')
    } else {
      req.session.flash = { type: 'fail', text: 'Username and/or password was incorrect' }
      res.redirect('/login')
    }
  } catch (error) {
  // If an error, or validation error, occurred, view the form and an error message.
    req.session.flash = { type: 'fail', text: error.message } // TODO: QUESTION, how does this go to a error code? instead?
    return res.redirect('/login')
  }
}

module.exports = userController
