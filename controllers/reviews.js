const Review = require('../models/reviews.js');
const Campground = require('../models/campground.js');

module.exports.createReview = async(req, res) => {
    const reviewData = req.body.review;
    reviewData.author = req.user._id;
    const newReview = new Review(reviewData);
    const campground = await Campground.findById(req.params.id);
    campground.reviews.push(newReview);
    await newReview.save();
    await campground.save();
    req.flash('success', 'Successfully created a review.');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req, res) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review.');
    res.redirect(`/campgrounds/${id}`);
}