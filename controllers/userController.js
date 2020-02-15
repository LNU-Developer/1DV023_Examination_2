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
    // Create a new user...
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
    }
    return res.redirect('/signup')
  }
}

userController.logout = (req, res) => { // TODO: destroy session
  // TODO: redirect to protection layer (check if user is logged in)

}

/**
 * Creates login a user.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 */
userController.login = (req, res) => { // TODO: Create login session
// TODO: redirect to protection layer (check if user is logged in)
}

module.exports = userController
