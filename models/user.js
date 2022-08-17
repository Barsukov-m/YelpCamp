const mongoose = require('mongoose');
const { Schema } = mongoose;
const passport = require('passport-local-mongoose');


const userSchema = new Schema ({
	name: {
		type: String,
		min: [2, 'User name must be at least 2 characters long'],
		max: [100, 'User name must not exceed 100 characters'],
		required: true,
	}
});

// adding 'passport' plugin (sets login & password automatically)
userSchema.plugin(passport);

const User = mongoose.model('User', userSchema);


module.exports = User;
