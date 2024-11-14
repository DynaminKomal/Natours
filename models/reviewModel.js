const Tour = require('./tourModel')
const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review can not be empty'],
        trim: true,
        index: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Review must belongs to a tour.'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: [true, 'Review must belongs to a user.'],
    }
}, {
    autoIndex: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name -guides'
    // }).populate({
    //     path: 'user',
    //     select: 'name'
    // })

    this.populate({
        path: 'user',
        select: 'name photo'
    })
    next();
})


reviewSchema.statics.calRatingAverage = async function (tourId) {

    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: "$tour",
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ])
    if (stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        })
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        })
    }
};



reviewSchema.post('save', function () {
    this.constructor.calRatingAverage(this.tour)
})

reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
})
reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calRatingAverage(this.r.tour);
})


const Reviews = mongoose.model('Reviews', reviewSchema);

module.exports = Reviews;