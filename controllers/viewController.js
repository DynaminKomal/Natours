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

exports.getTour = grasp(async (req, res) => {
    try {
        const { slug } = req.params;
        const formattedName = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        const getTour = await Tour.findOne({ name: formattedName }).populate("reviews")
        res.status(200).render('tour', {
            title: `${getTour.name} tour`,
            tour: getTour
        });
    } catch (error) {
    }
})



exports.login = grasp(async (req, res) => {
    try {
        const { email, password } = req.body;

        res.status(200).render('login', {
            title: "Login",
        });
    } catch (error) {
    }
})

