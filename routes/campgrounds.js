const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware.js');
const { getIndex, renderNewForm, showCampgrounds, renderEditForm,
     createCampground, editCampground , deleteCampground} = require('../controllers/campgrounds.js')


router.route('/')
     .get(catchAsync(getIndex))
     .post(isLoggedIn, validateCampground, catchAsync(createCampground));

router.get('/new', isLoggedIn, renderNewForm);

router.route('/:id')
     .get(catchAsync(showCampgrounds))
     .put(isLoggedIn, isAuthor, validateCampground, catchAsync(editCampground))
     .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(renderEditForm));

module.exports = router;