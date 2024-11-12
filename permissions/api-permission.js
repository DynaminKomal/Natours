const { sendResponse } = require("../utility/response-utility");

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return sendResponse(res, 403, "You do not permission to perform this action!")
        }
        next();
    };
}