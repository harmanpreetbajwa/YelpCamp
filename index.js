const express = require('express');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground.js');
const methodOverride = require('method-override');

app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'))

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

app.get('/campgrounds/:id/edit', async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', {campground});
});

app.post('/campgrounds', async (req, res, next) => {
    try{
        const campData = req.body.campground;
        const newcamp = new Campground(campData);
        const { _id } = await newcamp.save();
        res.redirect(`/campgrounds/${_id}`);
    }catch(e){
        next(e);
    }
    
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campData = req.body.campground;
    const updatedCamp = await Campground.findByIdAndUpdate(id, campData, {new: true});
    res.redirect(`/campgrounds/${id}`);
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
});

app.use((req, res) => {
    res.status(404).send('NOT FOUND!');
});

app.use((err, req, res, next)=> {
    res.send(`Oops! Something went wrong.`)
})

app.listen(8080, () => {
    console.log('Listening at port 8080.')
});