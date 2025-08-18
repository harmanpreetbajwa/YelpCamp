const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');

app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}));

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then( () => {
    console.log("Mongo listening at port 27017.");
}).catch( () => {
    console.log('An issue encoutered while connecting to Mongo');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async(req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds: allCampgrounds});
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async(req, res) => {
    const { id } = req.params; 
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', {campground});
});

app.post('/campgrounds', async (req, res) => {
    const campData = req.body.campground;
    const newcamp = new Campground(campData);
    const { _id } = await newcamp.save();
    res.redirect(`/campgrounds/${_id}`);
});

app.listen(8080, () => {
    console.log('Listening at port 8080.')
});