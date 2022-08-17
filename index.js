// .env config
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');                        // Express server
const session = require('express-session');                // express sessions
const MongoStore = require('connect-mongo');               // MongoDB sesseions
const passport = require('passport');                      // passport the auth middleware
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');                    // flash messages
const mongoose = require('mongoose');                      // MongoDB ODM
const mongoSanitize = require('express-mongo-sanitize');   // prevent MongoDB Operator Injection
const helmet = require('helmet');                          // secure Express apps by setting various HTTP headers
const path = require('path');
const methodOverride = require('method-override');         // PUT, PATCH, DELETE etc.
const bodyParser = require('body-parser');                 // JSON body parser

const Campground = require('./models/campground');         // Campground model
const User = require('./models/user');                     // User model
const campgroundRoutes = require('./routes/campgrounds');  // campground routes
const reviewRoutes = require('./routes/reviews');          // review routes
const authRoutes = require('./routes/auth');               // authentication routes
const AppError = require('./utils/AppError');              // Custom Error class
const { catchAsync } = require('./utils/utilities');       // catch async errors


// MongoDB session
const mongoDbUrl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/yelpCamp';
const secret = process.env.SECRET || 'D27KBB5*LQn!G4Y9jw45^LELHRHVXTHE2^&$5%aC^9WMty4H&XBuufJ$8&3D'

const sessionOptions = {
	name: 'session',
	secret,
	store: MongoStore.create({
		mongoUrl: mongoDbUrl,
		secret,
		touchAfter: 24 * 3600  // 24 hours
	}),
	resave: false,
	saveUninitialized: false,
	cookie: {
		// expires in a week
		expires: Date.now() + 604800000,
		maxAge: 604800000,
		httpOnly: true,
		// secure: true  // HTTPS
	}
};


// Mongoose setup
mongoose.connect(mongoDbUrl)
	.then(() => console.log('Mongoose connection open'))
	.catch(err => console.log(err))                          // initial connection error

// mongoose error handling
mongoose.connection.on('error', err => console.log(err));


// Express setup
const app = express();
const port = process.env.PORT || 3000;

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));


// Middleware
app.use(session(sessionOptions));                          // express sessions
app.use(express.static(path.join(__dirname, '/public')));  // static assets

// Express Mongoose Sanitize
app.use(mongoSanitize());

// Helmet
app.use(
	helmet({
		contentSecurityPolicy: false,
		crossOriginEmbedderPolicy: false,
	})
);

// form data parser
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// flash
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// session
app.use((req, res, next) => {
	if (!['/', '/img', , '/login', '/register', '/logout'].includes(req.originalUrl))
		req.session.returnTo = req.originalUrl;

	res.locals.home = req.path === '/';
	res.locals.currentUser = req.user;
	res.locals.message = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// logger middleware for debugging purposes
// 'morgan' npm package might be used, alternatively
if (process.env.NODE_ENV !== 'production')
	app.use((req, res, next) => {
		console.log(req.method, req.path);
		next();
	});


// Routes
app.use('/', authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews/', reviewRoutes);


// home page
app.get('/', catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render('home', { campgrounds });
}));

app.post('/search', catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.send(campgrounds);
}));

// 404
app.use((req, res, next) => {
	next(new AppError('Requested Page Not Found', 404));
});

// mongoose error handling
app.use((err, req, res, next) => {
	const { name } = err;
	console.log(err);

	if (name === 'CastError' || name === 'TypeError')
		throw new AppError('Requested Page Not Found', 404);
	else if (name === 'ReferenceError' || name === 'ValidationError')
		throw new AppError('Form Validation Error', 400);
	else if (name === 'SyntaxError')
		throw new AppError();

	next(err);
});

// server error handling
app.use((err, req, res, next) => {
	// 500 - internal server error
	if (!err.status)
		err.status = 500;
	if (!err.name)
		err.name = 'Something Went Wrong'

	if (err.status === 400) {
		req.flash('error', err.message || err.name)
		res.redirect('/campgrounds');
	}

	res.status(err.status);
	res.render('error', { error: err });
});


app.listen(port, () => {
	console.log(`Listening to port ${port}`);
});
