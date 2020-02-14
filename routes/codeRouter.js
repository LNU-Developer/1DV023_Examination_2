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

router.get('/', userController.index)
router.get('/signup', codeController.signup)

router.post('/login/create', userController.create)

module.exports = router
