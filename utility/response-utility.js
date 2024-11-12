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
    if (err.name === "TokenExpiredError") {
        this.sendResponse(res, statusCode, "fail", "Token Expire. Please loggin again.");
    }
    else if (err.name === 'JsonWebTokenError') {
        this.sendResponse(res, statusCode, "fail", "Invalid Token. Please loggin again.");
    } 
    else {
        this.sendResponse(res, statusCode, "fail", err.message || "An unexpected error occurred");
    }
};
