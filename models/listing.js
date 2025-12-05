const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Review = require("./review.js")
const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },

    //we are taking image from user , if user doesnt upload anything , default link will be stored in DB
    image: {
        url: String,
        filename: String
        // type: String,
        // default: "https://images.pexels.com/photos/34106378/pexels-photo-34106378.jpeg",                     
        // set: (v) => v === "" ? "https://images.pexels.com/photos/34106378/pexels-photo-34106378.jpeg" : v
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in : listing.reviews}});
    }
    
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;