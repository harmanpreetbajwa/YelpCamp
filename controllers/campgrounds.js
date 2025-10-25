const Campground = require('../models/campground.js');

module.exports.getIndex = async(req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds: allCampgrounds});
}


module.exports.renderNewForm = (req, res) => { 
    res.render('campgrounds/new');
}

module.exports.showCampgrounds = async(req, res) => {
    const { id } = req.params; 
    const campground = await Campground.findById(id).populate(
        {
            path: 'reviews',
            populate: { path: 'author'}
        }).populate('author');
    if (!campground){
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground){
        req.flash('error', 'Cannot find that campground.');
        return res.redirect('/capgrounds');
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.createCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campData = req.body.campground;
    campData.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campData.author = req.user._id;
    const newcamp = new Campground(campData);
    const { _id } = await newcamp.save();
    req.flash('success', 'Successfully created a campground.');
    res.redirect(`/campgrounds/${_id}`);
}

module.exports.editCampground = async (req, res) => {
    const { id } = req.params;
    const campData = req.body.campground;
    await Campground.findByIdAndUpdate(id, campData, {new: true});
    req.flash('success', 'Successfully updated a campground.');
    return res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted a campground.');
    res.redirect(`/campgrounds`);
}