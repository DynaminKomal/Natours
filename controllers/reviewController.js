const Review = require("../models/reviewModel");
const factory = require('./handlerFactory');



exports.getAllReview = factory.getAllData(Review)

exports.createReview = factory.create(Review)

exports.updateReview = factory.updateOne(Review)

exports.deleteReview = factory.deleteOne(Review)
