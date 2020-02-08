/**
 * The starting point of the application.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

const express = require('express')
const hbs = require('express-hbs')
const { join } = require('path')
const logger = require('morgan')
const createError = require('http-errors')

const app = express()

// View engine.
app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default')
}))
app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

// Request logger.
app.use(logger('dev'))

// Serve static files.
app.use(express.static(join(__dirname, 'public')))

// Parse application/x-www-form-urlencoded.
app.use(express.urlencoded({ extended: true }))

// Routes.
app.use('/', require('./routes/codeRouter'))
app.use('*', (req, res, next) => next(createError(404)))

// Error handler.
app.use((err, req, res, next) => {
  // 404 Not Found.
  if (err.status === 404) {
    return res
      .status(404)
      .sendFile(join(__dirname, 'views', 'errors', '404.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(join(__dirname, 'views', 'errors', '500.html'))
  }

  // Development only
  // Providing detailed error in development.

  // Render the error page.
  res
    .status(err.status || 500)
    .render('errors/error', { err })
})

// Listen to port
app.listen(3000, () => console.log('Server running at http://localhost:3000'))
