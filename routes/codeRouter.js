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

router.get('/', codeController.index)
router.get('/login', codeController.login)

module.exports = router
