const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./citiesDB');
const titles = require('./titlesDB');


mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
	.then(() => console.log('Mongoose connection open'))
	.catch(err => console.log(err))


const images = [
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046557/YelpCamp/Demo/camp-0001_yuucn3.jpg',
		attr: 'Photo by Tommy Lisbin on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046557/YelpCamp/Demo/camp-0002_ozextp.jpg',
		attr: 'Photo by everett mcintire on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046557/YelpCamp/Demo/camp-0003_apfgdo.jpg',
		attr: 'Photo by kilarov zaneit on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046558/YelpCamp/Demo/camp-0004_inguee.jpg',
		attr: 'Photo by Blake Wisz on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046558/YelpCamp/Demo/camp-0005_xxyoao.jpg',
		attr: 'Photo by Scott Goodwill on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046558/YelpCamp/Demo/camp-0006_e2m4ir.jpg',
		attr: 'Photo by Rishabh Pandoh on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046558/YelpCamp/Demo/camp-0007_lwqom3.jpg',
		attr: 'Photo by Daan Weijers on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046558/YelpCamp/Demo/camp-0008_mbsey1.jpg',
		attr: 'Photo by Chris Holder on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046558/YelpCamp/Demo/camp-0009_plxeyn.jpg',
		attr: 'Photo by Tim Foster on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046557/YelpCamp/Demo/camp-000a_jjkgfv.jpg',
		attr: 'Photo by Zach Betten on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046557/YelpCamp/Demo/camp-000b_lidrwb.jpg',
		attr: 'Photo by Christopher Jolly on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046557/YelpCamp/Demo/camp-000c_penmau.jpg',
		attr: 'Photo by Brian Yurasits on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046557/YelpCamp/Demo/camp-000d_glbfwa.jpg',
		attr: 'Photo by Peter Vanosdall on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046557/YelpCamp/Demo/camp-000e_wxsezq.jpg',
		attr: 'Photo by Daniel Nainggolan on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046556/YelpCamp/Demo/camp-000f_njitje.jpg',
		attr: 'Photo by Jonathan Forage on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046559/YelpCamp/Demo/camp-0015_xg3elq.jpg',
		attr: 'Photo by Pars Sahin on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046559/YelpCamp/Demo/camp-0013_rctmue.jpg',
		attr: 'Photo by Ben Duchac on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046558/YelpCamp/Demo/camp-0010_zxxhcp.jpg',
		attr: 'Photo by Jordan Heinrichs on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046559/YelpCamp/Demo/camp-0011_cfjdo9.jpg',
		attr: 'Photo by Tommy Lisbin on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046559/YelpCamp/Demo/camp-0012_crpmuq.jpg',
		attr: 'Photo by Paul Hermann on Unsplash'
	},
	{
		src: 'https://res.cloudinary.com/barsukov-m-yelpcamp/image/upload/v1659046559/YelpCamp/Demo/camp-0014_xxj6iz.jpg',
		attr: 'Photo by Elijah Austin on Unsplash'
	},
];


const addSeeds = async () => {
	// delete all the campgrounds first
	await Campground.deleteMany({})
		.then(() => console.log('All object were successfully deleted.'))
		.catch(err => console.log(err))

	// add 50 random cities to the list
	for (let i of images) {
		// select a random city from the array
		const randCity = cities[Math.floor(Math.random()*cities.length)];

		// select a random place title
		const descName = titles.descriptors[Math.floor(Math.random()*titles.descriptors.length)];
		const placeName = titles.places[Math.floor(Math.random()*titles.places.length)];

		const camp = new Campground({
			title: `${descName} ${placeName}`,
			location: randCity.city,
			geometry: {
				type: 'Point',
				coordinates: [
					randCity.lon,
					randCity.lat
				]
			},
			price: Math.round(Math.random()*10),
			images: [
				{
					path: i.src,
					filename: i.src.split('v1659046559')[1]
				}
			],
			author: '63a8341e71fac3d4da68a7fc',
			description: i.attr,
			date: new Date()
		});

		await camp.save()
			.then(() => console.log('A new campground was added.'))
			.catch(err => console.log(err))
	}

	console.log('Done!');
}

addSeeds();
