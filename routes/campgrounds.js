const express = require('express');
const router = express.Router();
const Campground = require('../models/campground.js');

const catchAsync = require('../utils/catchAsync.js');
const { campgroundSchema} = require('../schemas');
const ExpressError = require('../utils/ExpressError.js');

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

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params; 
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
}));


router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campData = req.body.campground;
    const newcamp = new Campground(campData);
    const { _id } = await newcamp.save();
    res.redirect(`/campgrounds/${_id}`);

}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campData = req.body.campground;
    await Campground.findByIdAndUpdate(id, campData, {new: true});
    res.redirect(`/campgrounds/${id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

module.exports = router;