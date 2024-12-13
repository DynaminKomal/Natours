const Tour = require('../models/tourModel');
const apiFeature = require('../utility/api-features');
const { sendResponse, handleError, grasp } = require('../utility/response-utility')
const factory = require('./handlerFactory')
const cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Check for required data
exports.checkDataExists = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return sendResponse(res, 400, "fail", "All fields (name and price) must be provided!");
    }
    next();
};

// Get all tours
exports.getAllTours = factory.getAllData(Tour)

// Get a single tour by ID
exports.getTour = factory.getOne(Tour, "reviews")

// Create a new tour
exports.createTour = factory.create(Tour)

// Delete a tour
exports.deleteTour = factory.deleteOne(Tour)

// Update a tour
exports.updateTour = factory.updateOne(Tour)


exports.uploadFile = grasp(async (req, res) => {
    try {
        const files = req.files.imageCover;
        const filesUrl = [];
        const filesArray = Array.isArray(files) ? files : [files];

        const uploadPromises = filesArray.map(file => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload(file.tempFilePath, {
                    folder: "Tour",
                    public_id: file.name
                }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.url);
                    }
                });
            });
        });

        const uploadedUrls = await Promise.all(uploadPromises);

        res.status(200).json({
            data: uploadedUrls.length > 0 ? uploadedUrls : "no data"
        });

    } catch (error) {
        handleError(res, error);
    }
});



// aggregation pipeline
exports.getTourStats = grasp(async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: {
                    ratingsAverage: {
                        $gte: 4.5
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgRatings: {
                        $avg: '$ratingsAverage'
                    },
                    avgPrice: {
                        $avg: "$price"
                    },
                    minPrice: {
                        $min: '$price'
                    },
                    maxPrice: {
                        $max: '$price'
                    }
                }
            }
        ])


        if (!stats.length) {
            return sendResponse(res, 404, "fail", "Tour not found");
        }

        sendResponse(res, 200, "success", "Tour retrieved successfully!", stats);

    } catch (error) {
        handleError(res, err);
    }
})



// aggregation pipeline
exports.getMonthlyPlan = grasp(async (req, res) => {
    try {

        const year = req.query.year;
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        $month: '$startDates'
                    },
                    numTourStart: {
                        $sum: 1
                    },
                    tours: { $push: '$name' }
                }
            },
            {
                $addFields: {
                    month: '$_id'
                }
            },
            {
                $project: {
                    _id: 0
                }
            }
        ])


        if (!plan.length) {
            return sendResponse(res, 404, "fail", "Tour not found");
        }

        sendResponse(res, 200, "success", "Tour retrieved successfully!", plan);

    } catch (error) {
        handleError(res, err);
    }
})