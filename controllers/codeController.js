/**
 * Module for the code controller.
 *
 * @author Rickard Marjanovic
 * @version 1.0.0
 */

'use strict'

const index = (req, res) => {
  res.render('home/index')
}

const signup = (req, res) => {
  res.render('home/signup')
}

module.exports = {
  index,
  signup
}
