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
            author: '68ead7611b1e24af0a217902',
            location: `${cities[randomCityIndex].city}, ${cities[randomCityIndex].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Proin id elementum nunc. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed aliquam in orci at posuere. Etiam nec neque nunc. Pellentesque ac leo posuere, condimentum arcu et, tincidunt enim. Nullam vestibulum augue lectus, sit amet sodales quam interdum et. Mauris sagittis mauris id hendrerit vulputate. Etiam facilisis purus egestas, sagittis sem ut, pharetra velit. Maecenas feugiat ligula vitae ligula vestibulum, nec lacinia ex euismod. Fusce sed magna nisi. Proin quis erat in odio consequat aliquam. Aliquam massa ipsum, ullamcorper ac dapibus vel, cursus placerat arcu. Praesent scelerisque ornare lorem in ultrices. Nunc eu auctor ligula.',
            price: (Math.random() * 300).toFixed(2),
            images: [
                    {
                        url: 'https://res.cloudinary.com/do9ijldl2/image/upload/v1761440138/YelpCamp/zzqs3i8jygale80p2jqk.jpg',
                        filename: 'YelpCamp/zzqs3i8jygale80p2jqk',
                    }
                    ],
        });
        await camp.save();
    }
} 

seedDb().then( () => {
    mongoose.connection.close();
    console.log('MongoDB connection closed !')
});