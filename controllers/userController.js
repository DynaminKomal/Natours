const User = require('../models/userModel');
const { grasp, sendResponse, handleError } = require('../utility/response-utility');
const factory = require('./handlerFactory')



exports.getAllUsers = factory.getAllData(User)



exports.updatePassword = grasp(async (req, res) => {
    try {
        const { id } = req.user;
        const { currentPassword, newPassword, passwordConfirm } = req.body;

        // Validate that id and password are provided
        if (!id || !currentPassword || !newPassword || !passwordConfirm) {
            return sendResponse(res, 400, "fail", "ID and password are required.");
        }


        const userExist = await User.findById(id);

        if (!userExist) {
            return sendResponse(res, 401, "fail", "User does not exist.");
        }

        const checkPassword = await userExist.correctPassword(currentPassword, userExist.password)

        if (!checkPassword) {
            return sendResponse(res, 400, "fail", "Current passowrd is incorrect.");
        }

        userExist.password = newPassword;
        userExist.passwordConfirm = passwordConfirm;
        await userExist.save();

        return sendResponse(res, 200, "success", "User password changed");
    } catch (err) {
        handleError(res, err);
    }
});


exports.updateProfile = grasp(async (req, res) => {
    const { name, photo } = req.body;

    // Check for unexpected fields
    const allowedFields = ['name'];
    const receivedFields = Object.keys(req.body);
    const invalidFields = receivedFields.filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        return sendResponse(res, 400, "fail", `Invalid fields: ${invalidFields.join(', ')}. Only update name and photo`);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, photo }, {
        new: true,
        runValidators: true,
    })

    if (!updatedUser) {
        return sendResponse(res, 404, "fail", "User not found.");
    }

    sendResponse(res, 200, "success", "Update your profile", updatedUser)

})


exports.deleteUser = factory.deleteOne(User)


