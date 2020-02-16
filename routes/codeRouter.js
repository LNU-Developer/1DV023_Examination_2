/**
 * Module for the home routes.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const codeController = require('../controllers/codeController')
const userController = require('../controllers/userController')

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    req.session.flash = { type: 'fail', text: 'You need to be logged in to do this action.' }
    res.redirect('/login')
  } else {
    next()
  }
}

const redirectSnippet = (req, res, next) => {
  if (req.session.userId) {
    req.session.flash = { type: 'fail', text: 'You are already logged in.' }
    res.redirect('/')
  } else {
    next()
  }
}

// Get home
router.get('/', codeController.index)

// Get signup page and create new user
router.get('/signup', redirectSnippet, codeController.signup)
router.post('/signup/create', redirectSnippet, userController.create)

// Get new snippet page and create new snippet
router.get('/new', redirectLogin, codeController.new)
router.post('/new', redirectLogin, codeController.new)

router.post('/new/snippet', redirectLogin, codeController.create)

router.get('/logout', redirectLogin, userController.logout)

router.get('/login', redirectSnippet, codeController.login)
router.post('/login', redirectSnippet, userController.login)

// Edit/Delete snippet.
router.post('/:id', redirectLogin, codeController.show)
router.get('/:id', redirectLogin, codeController.show) // TODO: QUESTION: Should there be a get on this request as well?
router.post('/:id/edit', redirectLogin, codeController.edit)
router.post('/:id/delete', redirectLogin, codeController.delete)

module.exports = router
