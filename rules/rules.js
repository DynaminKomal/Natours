const ruleFalse = {
    admin: false,
    user: false,
    guide: false
}

const ruleTrue = {
    admin: true,
    guide: true,
    user: true
}

const admin = { ...ruleFalse, admin: true }
const guide = { ...ruleFalse, guide: true }
const user = { ...ruleFalse, user: true }
const admin_guide = { ...ruleFalse, admin: true, guide: true }
const user_guide = { ...ruleFalse, user: true, guide: true }

const rules = {
    // FOR AUTH
    "POST /api/v1/auth/login": ruleTrue,
    "POST /api/v1/auth/signup": ruleTrue,
    "POST /api/v1/auth/forget-password": ruleTrue,
    "PATCH /api/v1/auth/reset-password": ruleTrue, 

    //FOR USER
    "GET /api/v1/users/": admin,
    "PUT /api/v1/users/change-password": ruleTrue,
    "PATCH /api/v1/users/update-profile": ruleTrue,

    //FOR TOUR
    "GET /api/v1/tours/": ruleTrue,
    "POST /api/v1/tours/": admin_guide,

    //FOR REVIEW
    "GET /api/v1/reviews/": ruleTrue,
    "POST /api/v1/reviews/": user_guide,
    
    // For individual (/:id) Tour
    "DELETE /api/v1/tours/:id": admin,
    "PUT /api/v1/tours/:id": admin,
    "GET /api/v1/tours/:id": ruleTrue,
    "PUT /api/v1/tours/:id": admin_guide,
    "DELETE /api/v1/tours/:id": admin,
    
    // For individual (/:id) User
    "DELETE /api/v1/users/:id": admin,
    
    // For individual (/:id) Review
    "PUT /api/v1/reviews/:id": user_guide,
    "POST /api/v1/tours/:tourId/reviews/": user_guide,
    "DELETE /api/v1/reviews/:id": ruleTrue,

    //path for UI
    "GET /tour/:slug": ruleTrue,
};

// Convert paths to regular expressions
const regexRules = Object.entries(rules).map(([path, rule]) => {
    const regexPath = path.replace(/:\w+/g, '([^/]+)'); 
    const finalRegexPath = path.includes('/reset-password') ? `${regexPath}(/[^/]+)?$` : `${regexPath}$`;
    return { regex: new RegExp(`^${finalRegexPath}`), rule };
});

const hasPermission = (path, role) => {
    console.log("Requested path:", path);

    for (const { regex, rule } of regexRules) {
        if (regex.test(path)) {
            if (rule[role] === true) {
                return { allowed: true, message: "Access granted" };
            } else {
                return { allowed: false, message: "Access denied" }; // Role does not have permission
            }
        }
    }

    return { allowed: false, message: "Invalid path" }; // Path not found
};

module.exports = hasPermission;
