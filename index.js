const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError.js');
const campgroundRouter = require('./routes/campgrounds.js');
const reviewRouter = require('./routes/reviews.js');

app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.json());
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then( () => {
    console.log("Mongo listening at port 27017.");
}).catch( () => {
    console.log('An issue encoutered while connecting to Mongo');
});

app.get('/', (req, res) => {
    res.render('home');
});

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('404! Not Found.',  404));
});

app.use((err, req, res, next)=> {
    const {statusCode = 500} = err;
    if (!err.message) err.message = 'OOPS! Something went wrong.';
    res.status(statusCode).render('error', { err });
});

app.listen(8080, () => {
    console.log('Listening at port 8080.');
});