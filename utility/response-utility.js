// Global error handler
exports.grasp = (cb) => {
    return (req, res, next) => {
        cb(req, res, next).catch((err) => {
            this.handleError(res, err);
        });
    };
};

// Utility function to send responses
exports.sendResponse = (res, statusCode, status, message, data = null) => {
    res.status(statusCode).json({
        status,
        message,
        length: data === null ? 0 : data.length,
        data,
    });
};

// Centralized error handler
exports.handleError = (res, err) => {
    const statusCode = err.statusCode || 400;

    // Check the environment and adjust error response accordingly
    if (process.env.NODE_ENV === 'production') {
        // In production, don't expose internal error details
        if (err.name === "TokenExpiredError") {
            this.sendResponse(res, statusCode, "fail", "Token Expired. Please log in again.");
        } else if (err.name === 'JsonWebTokenError') {
            this.sendResponse(res, statusCode, "fail", "Invalid Token. Please log in again.");
        } else {
            this.sendResponse(res, statusCode, "fail", "An unexpected error occurred.");
        }
    } else {
        // In development, provide more detailed error information for debugging
        if (err.name === "TokenExpiredError") {
            this.sendResponse(res, statusCode, "fail", `Token Expired. Please log in again. Details: ${err.message}`);
        } else if (err.name === 'JsonWebTokenError') {
            this.sendResponse(res, statusCode, "fail", `Invalid Token. Please log in again. Details: ${err.message}`);
        } else {
            this.sendResponse(res, statusCode, "fail", `An unexpected error occurred. Details: ${err.message}`);
        }
    }
};
