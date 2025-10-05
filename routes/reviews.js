const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/reviews.js');
const Campground = require('../models/campground.js');

const catchAsync = require('../utils/catchAsync.js');
const { reviewSchema } = require('../schemas');
const ExpressError = require('../utils/ExpressError.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body || {});
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.post('/', validateReview, catchAsync(async(req, res) => {
    const reviewData = req.body.review;
    const newReview = new Review(reviewData);
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Successfully created a review.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review.');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;