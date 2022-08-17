const express = require('express');
const router = express.Router();                           // Express router
const multer = require('multer');                          // multipart/form-data parser
const campgrounds = require('../controllers/campgrounds')  // campgrounds controller
const { storage } = require('../cloudinary');              // cloudinary config
const upload = multer({ storage });                        // multer upload destination
const {
	catchAsync,
	validateCampground,
	requireLogin,
	verifyCampAuthor,
} = require('../utils/utilities');                         // Utility functions


router.get('/new', requireLogin, campgrounds.newForm);
router.get('/:id/edit', requireLogin, verifyCampAuthor, catchAsync(campgrounds.editForm));

router.route('/')
	.get(campgrounds.index)
	.post(requireLogin, upload.array('images'), validateCampground, catchAsync(campgrounds.createNew))

router.route('/:id')
	.get(catchAsync(campgrounds.showOne))
	.put(requireLogin, upload.array('images'), verifyCampAuthor, validateCampground, catchAsync(campgrounds.updateOne))
	.delete(requireLogin, verifyCampAuthor, catchAsync(campgrounds.deleteOne))


module.exports = router;
