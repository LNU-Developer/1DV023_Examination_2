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

// Get home
router.get('/', codeController.index)

// Get signup page and create new user
router.get('/signup', codeController.signup)
router.post('/signup/create', userController.create)

// Get new snippet page and create new snippet
router.get('/new', codeController.new)
router.post('/new', codeController.new)

router.post('/new/snippet', codeController.create)

router.get('/logout', userController.logout)

router.get('/login', codeController.login)
router.post('/login', userController.login)

// Edit/Delete snippet.
router.post('/:id', codeController.show)
router.get('/:id', codeController.show) // TODO: QUESTION: Should there be a get on this request as well?
router.post('/:id/edit', codeController.edit)
router.post('/:id/delete', codeController.delete)

module.exports = router
