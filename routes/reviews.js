const express = require('express');
const router = express.Router({mergeParams: true});
const Review = require('../models/reviews.js');
const Campground = require('../models/campground.js');

const catchAsync = require('../utils/catchAsync.js');
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');
const ExpressError = require('../utils/ExpressError.js');

router.post('/', isLoggedIn, validateReview, catchAsync(async(req, res) => {
    const reviewData = req.body.review;
    reviewData.author = req.user._id;
    const newReview = new Review(reviewData);
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Successfully created a review.');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review.');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;