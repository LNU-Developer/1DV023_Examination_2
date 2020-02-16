/**
 * The starting point of the application.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

require('dotenv').config()

const express = require('express')
const hbs = require('express-hbs')
const { join } = require('path')
const logger = require('morgan')
const createError = require('http-errors')
const mongoose = require('./configs/mongoose.js')
const session = require('express-session')
const app = express()

// Connect to the database.
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})

// Register own helper for if
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this)
    default:
      return options.inverse(this)
  }
})

// View engine.
app.engine('hbs', hbs.express4({
  defaultLayout: join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: join(__dirname, 'views', 'partials')
}))

app.set('view engine', 'hbs')
app.set('views', join(__dirname, 'views'))

// Request logger.
app.use(logger('dev'))

// Serve static files.
app.use(express.static(join(__dirname, 'public')))

// Parse application/x-www-form-urlencoded.
app.use(express.urlencoded({ extended: true }))

const sessionOptions = {
  name: 'Login session',
  secret: 'Supersecret hash code',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax'
  }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions))

// Middleware to be executed before the routes.
app.use((req, res, next) => {
  // Flash messages - survives only a round trip.
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

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
