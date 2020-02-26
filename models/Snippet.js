/**
 * Mongoose model snippets.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create a schema, with customized error messages.
const snippetSchema = new Schema({
  usernameId: {
    type: String,
    required: true
  },
  snippet: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
}, {
  timestamps: true,
  versionKey: false
})

// Create a model using the schema.
const Snippet = mongoose.model('Snippet', snippetSchema)

// Export the model.
module.exports = Snippet
