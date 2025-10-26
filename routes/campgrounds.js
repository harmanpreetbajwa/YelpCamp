const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware.js');
const { getIndex, renderNewForm, showCampgrounds, renderEditForm,
     createCampground, editCampground , deleteCampground} = require('../controllers/campgrounds.js')
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
     .get(catchAsync(getIndex))
     .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(createCampground));

router.get('/new', isLoggedIn, renderNewForm);

router.route('/:id')
     .get(catchAsync(showCampgrounds))
     .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(editCampground))
     .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm));

module.exports = router;