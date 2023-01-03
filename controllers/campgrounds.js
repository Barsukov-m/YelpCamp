const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const accessToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken });
const Campground = require('../models/campground');  // Campground model
const { calculatePostTime } = require('../utils/utilities');


const newForm = (req, res) => {
	res.render('campgrounds/new');
}

const createNew = async (req, res) => {
	const { body: data, files } = req;

	// forward geocoding
	const mapboxRes = await geocoder.forwardGeocode({
		query: data.location,
		limit: 1
	}).send();

	const mapboxData = mapboxRes.body.features[0];

	// no city found
	if (!mapboxData) {
		req.flash('error', 'No city with this name found. Try again');
		return res.redirect('/campgrounds/new');
	}

	if (!req.user)
		return next(new AppError('Authentication Error', 401));

	data.author = req.user;

	const camp = new Campground(data);
	camp.images = files.map(f => ({ path: f.path, filename: f.filename }))

	// GeoJSON coordinates
	camp.geometry = mapboxData.geometry;

	await camp.save();

	req.flash('success', 'A new campground was added.');
	res.redirect(`/campgrounds/${camp._id}`);
}

const index = async (req, res) => {
	try {
		const { search } = req.query;
		const searchRegex = new RegExp(`.*${search}.*`, 'i');
		let camps = null;

		// if search query is passed
		if (search) {
			camps = await Campground.find({ title: searchRegex });

			// if no campgrounds found, try search for location
			if (!camps.length) {
				camps = await Campground.find({ location: searchRegex });
			}
		} else {
			camps = await Campground.find({});
		}

		res.render('campgrounds/index', { camps, search });
	} catch (err) {
		req.flash('error', 'Incorrect input');
		return res.redirect('/');
	}
}

const showOne = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id)
		.populate({
			path: 'reviews',
			populate: 'author'
		})
		.populate('author');

	if (!camp) {
		req.flash('error', 'Campground with this ID was not found.');
		res.redirect('/');
	} else {
		const postTime = calculatePostTime(camp.date);
		res.render('campgrounds/show', { camp, postTime });
	}
}

const editForm = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findById(id)
	res.render('campgrounds/edit', { camp });
}

const updateOne = async (req, res) => {
	const { id } = req.params;
	const { title, location, price, description } = req.body;
	const camp = await Campground.findByIdAndUpdate(id, { title, location, price, description }, { runValidators: true });

	// forward geocoding
	const mapboxRes = await geocoder.forwardGeocode({
		query: location,
		limit: 1
	}).send();

	const mapboxData = mapboxRes.body.features[0];

	// no city found
	if (!mapboxData) {
		req.flash('error', 'No city with this name found. Try again');
		return res.redirect(`/campgrounds/${id}/edit`);
	}

	// delete all of the campground files
	if (req.files.length) {
		camp.images.forEach(file => {
			cloudinary.uploader.destroy(file.filename);
		});

		// add new images
		camp.images = req.files.map(f => ({ path: f.path, filename: f.filename }))
	}

	// GeoJSON coordinates
	camp.geometry = mapboxData.geometry;

	await camp.save();

	req.flash('success', `Your campground was updated.`);
	res.redirect(`/campgrounds/${id}`);
}

const deleteOne = async (req, res) => {
	const { id } = req.params;
	const camp = await Campground.findByIdAndDelete(id)

	// delete all of the campground files
	if (camp.images.length)
		camp.images.forEach(file => {
			cloudinary.uploader.destroy(file.filename);
		});

	req.flash('success', `Your campground was deleted.`);
	res.redirect('/campgrounds');
}


module.exports = {
	newForm,
	createNew,
	index,
	showOne,
	editForm,
	updateOne,
	deleteOne,
}
