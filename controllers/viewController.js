const Tour = require("../models/tourModel");
const { grasp } = require("../utility/response-utility");
exports.getOverview = grasp(async (req, res, next) => {
    try {
        //Get all tour data 
        const getAllTour = await Tour.find()

        //Build template

        //Render that template using tour data
        res.status(200).render('overview', {
            title: "Exciting tours for adventurous people",
            tours: getAllTour
        });
    } catch (error) {
    }
})

exports.getAllTour = (req, res) => {
    res.status(200).render('tour', {
        title: "Tour"
    });
}

