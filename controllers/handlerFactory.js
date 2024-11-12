const apiFeature = require("../utility/api-features");
const { grasp, sendResponse, handleError } = require("../utility/response-utility");

exports.deleteOne = Model => grasp(async (req, res) => {
    try {
        const { id } = req.params;
        const doc = await Model.findByIdAndDelete(id);

        if (!doc) {
            return sendResponse(res, 404, "fail", `${Model.modelName} not found`);
        }

        sendResponse(res, 200, "success", `${Model.modelName} deleted successfully!`);
    } catch (err) {
        handleError(res, err);
    }
});


exports.getAllData = Model => grasp(async (req, res) => {
    try {
        const features = new apiFeature(Model.find(), req.query)
            .filter()
            .sort()
            .limit()
            .pagination()

        // Fetch the data
        const getTourData = await features.query;
        sendResponse(res, 200, "success", "Data successfully fetched!", getTourData);
    } catch (err) {
        handleError(res, err);
    }
})


exports.create = Model => grasp(async (req, res) => {
    try {
        if (!req.body.tour) {
            req.body.tour = req.params.tourId
        }
        if (!req.body.user) {
            req.body.user = req.user.id
        }
        const newData = await Model.create(req.body);
        sendResponse(res, 200, "success", `${Model.modelName} save successfully.`, newData);
    } catch (err) {
        handleError(res, err);
    }
})

exports.updateOne = Model => grasp(async (req, res) => {
    try {
        const { id } = req.params;
        const getDataFromBody = req.body;
        const updatedData = await Model.findByIdAndUpdate(id, getDataFromBody, {
            new: true,
            runValidators: true,
        });

        if (!updatedData) {
            return sendResponse(res, 404, "fail", `${Model.modelName} not found`);
        }

        sendResponse(res, 200, "success", `${Model.modelName} updated successfully.`, updatedData);
    } catch (err) {
        handleError(res, err);
    }
});


exports.getOne = (Model, populateOption) => grasp(async (req, res) => {
    try {
        const { id } = req.params;
        let query = Model.findById(id)

        if (populateOption) {
            query.populate(populateOption);
        }
        const finData = await query;

        if (!finData) {
            return sendResponse(res, 404, "fail", `${Model.modelName} not found`);
        }

        sendResponse(res, 200, "success", "Data successfully fetched!", finData);
    } catch (err) {
        handleError(res, err);
    }
});


