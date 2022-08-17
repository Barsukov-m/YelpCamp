const express = require('express');
const users = require('../controllers/users')
const router = express.Router();         // Express router
const passport = require('passport');
const {
	catchAsync,
	checkRedirect,
	validateUser,
} = require('../utils/utilities');       // Utility functions


router.route('/register')
	.get(users.registerForm)
	.post(validateUser, catchAsync(users.register))

router.route('/login')
	.get(checkRedirect, users.loginForm)
	.post(validateUser, checkRedirect, passport.authenticate('local', {
		failureRedirect: '/login',
		failureFlash: true,
	}), users.login)

router.get('/logout', checkRedirect, users.logout);


module.exports = router;
