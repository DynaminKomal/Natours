const mongoose = require('mongoose');
const User = require('./userModel');


const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true,
        index: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        set: val => Math.round(val * 10) / 10
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a gourp size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a summary']
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a image cover']
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            String,
            default: "Point",
            enum: ["Point"]
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: "Point",
                enum: ["Point"]
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Users'
        }
    ]

}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

tourSchema.index({ price: 1 })
tourSchema.index({ ratingsAverage: 1 })

tourSchema.virtual('reviews', {
    ref: 'Reviews',
    foreignField: 'tour',
    localField: '_id'
})

tourSchema.pre('save', async function (next) {
    const guidesPromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidesPromises)
    next();
})

tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt -password -role'
    })
    next();
})



//virtual property

// tourSchema.virtual('durationWeeks').get(function () {
//     return this.duration / 7;
// })


//DOCUMENT MIDDLEWARE 

// tourSchema.pre('save', function(next){
//     console.log("please wait...");
//     next();
// })

// tourSchema.post('save', function(doc,next){
//     console.log("This data saved in tour colllection",doc);
//     next();
// })


//QUERY MIDDLEWARE

// tourSchema.pre(/^find/, function(next){
//     this.find({
//         secretTour: {$eq: true}
//     })
//     this.start = Date.now();
//     next();
// })


// tourSchema.post(/^find/, function(doc, next){
//     console.log(`Query took ${Date.now() - this.start} milliseconds!`)
//     next();
// })

//AGGREGATION MIDDLEWARE

// tourSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({
//         $match: { secretTour: { $eq: true } }
//     })
//     console.log("AGGREGATION MIDDLEWARE PRE", this);
//     next();
// })


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;