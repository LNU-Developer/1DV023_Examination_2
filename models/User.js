/**
 * Mongoose model users.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create a schema, with customized error messages.
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    maxlength: [10, 'Please enter a shorter username (max 10 letters)'],
    minlength: [3, 'Please enter a longer username (min 3 letters)'],
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: [7, 'Please enter a longer password (min 7 letters)']
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
const User = mongoose.model('User', userSchema)

// Export the model.
module.exports = User
