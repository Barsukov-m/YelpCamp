const User = require('../models/user');  // user model


const register = async (req, res) => {
	const { name, username, password } = req.body;
	const user = new User({ name, username });

	try {
		// create and save a new user instance
		const newUser = await User.register(user, password);
		req.login(newUser, function (err) {
			if (err) return next(err);
			req.flash('success', `Welcome to YelpCamp, ${name}!`);
			res.redirect('/');
		});
	} catch (err) {
		req.flash('error', 'A user with this email already exists.');
		res.redirect('/register');
	}
}

const login = (req, res) => {
	// NOTE: current user is stored under req.user
	req.flash('success', `Welcome back, ${req.user.name}!`);

	// returnTo variable is stored under a user's session
	const redirectUrl = res.locals.returnTo || '/campgrounds';
	delete res.locals.returnTo;

	res.redirect(redirectUrl);
}

const registerForm = (req, res) => {
	res.render('auth/register');
}

const loginForm = (req, res) => {
	res.render('auth/login');
}

const logout = (req, res) => {
	req.logout(function (err) {
		if (err) return next();

		// redirect to the previously visited page
		res.redirect(res.locals && res.locals.returnTo || '/');
	});
}


module.exports = {
	register,
	login,
	registerForm,
	loginForm,
	logout,
}
