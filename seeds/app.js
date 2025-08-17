const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const {places, descriptors} = require('./seedHelpers.js');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp').then( () => {
    console.log("Mongo listening at port 27017.");
}).catch( () => {
    console.log('An issue encoutered while connecting to Mongo');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async() => {
    await Campground.deleteMany({});

    for (let i = 0; i < 50; i++){
        const randomCityIndex = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
} 

seedDb().then( () => {
    mongoose.connection.close();
    console.log('MongoDB connection closed !')
});