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

router.get('/', codeController.index)
router.get('/signup', codeController.signup)

router.get('/new', codeController.new)
router.post('/new', codeController.new)

router.post('/new/snippet', codeController.create)

router.post('/login/create', userController.create)
router.post('logout', userController.logout)
router.post('login', userController.login)

module.exports = router
