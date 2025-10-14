const express = require('express');
const router = express.Router();
const flash = require('connect-flash');
const Campground = require('../models/campground.js');

const catchAsync = require('../utils/catchAsync.js');
const { campgroundSchema} = require('../schemas');
const ExpressError = require('../utils/ExpressError.js');
const {isLoggedIn} = require('../middleware.js');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body || {});
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', catchAsync(async(req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds: allCampgrounds});
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params; 
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground){
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));


router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campData = req.body.campground;
    const newcamp = new Campground(campData);
    const { _id } = await newcamp.save();
    req.flash('success', 'Successfully created a campground.');
    res.redirect(`/campgrounds/${_id}`);

}));

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campData = req.body.campground;
    await Campground.findByIdAndUpdate(id, campData, {new: true});
    req.flash('success', 'Successfully updated a campground.');
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground.');
    res.redirect(`/campgrounds`);
}));

module.exports = router;