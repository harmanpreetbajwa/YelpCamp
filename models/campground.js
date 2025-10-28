const mongoose = require('mongoose');
const Review = require('./reviews.js');
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
            url: String,
            filename: String
    }
)

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload/', '/upload/w_200/');
})

const CampgroundSchema = new Schema(
    {
        title: {
            type: String
        },
        images: [ ImageSchema ],
        price: {
            type: Number
        },
        description: {
            type: String
        },
        location: {
            type: String
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }]
    }
);

CampgroundSchema.post('findOneAndDelete', async function (doc){
    if (doc){
        await Review.deleteMany({
            _id: {$in: doc.reviews}
        })
    }
});

const Campground =  mongoose.model('Campground' , CampgroundSchema);

module.exports = Campground;

