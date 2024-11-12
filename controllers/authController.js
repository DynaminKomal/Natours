const jwt = require('jsonwebtoken')
const User = require('../models/userModel');
const { grasp, sendResponse, handleError } = require('../utility/response-utility');
const UserHistory = require('../models/userHistoryModel');
const sendEmail = require('../utility/emails');
const crypto = require('crypto')

const getToken = (id) => {
    return jwt.sign({
        id: id
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.signup = grasp(async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        const token = getToken(newUser._id)
        const newData = {
            token: token,
            data: newUser
        }
        sendResponse(res, 201, "success", "A new user created Successfully!", newData)
    } catch (err) {
        handleError(res, err);
    }

})



exports.login = grasp(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return sendResponse(res, 400, "fail", "Please provide email and password!");
    }
    const user = await User.findEmail(email)
    if (!user) {
        return sendResponse(res, 401, "fail", "User not exits.");
    }
    const checkPassword = await user.correctPassword(password, user.password)
    if (!checkPassword) {
        return sendResponse(res, 401, "fail", "Please provide correct password!");
    }
    const token = getToken(user._id)
    const userData = {
        token: token,
        data: user
    }
    sendResponse(res, 200, "success", "You logged in successfully!", userData);
})



exports.forgetPassword = grasp(async (req, res) => {
    try {
        const { email } = req.body;
        // Validate that email is provided
        if (!email) {
            return sendResponse(res, 400, "fail", "email are required.");
        }
        const userExist = await User.findEmail(email)
        if (!userExist) {
            return sendResponse(res, 404, "fail", "User not exist.");
        }

        const userHistory = new UserHistory({ userEmail: email });
        const resetToken = await userHistory.createPasswordResetToken();
        await userHistory.save();
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`
        const message = `Forget Your Password? Submit a PATCH request with new password and passwordConfirm to: ${resetUrl}\n
        If you didn't forget your passwors, please ignore this email.`
        try {
            await sendEmail({
                subject: 'Your password reset token (valid for 10 min)',
                message
            }, res)
            sendResponse(res, 200, "success", "Token sent to email")
        } catch (err) {
            userHistory.passwordResetToken = undefined
            userHistory.passwordResetExpire = undefined
            const error = {
                statusCode: 500,
                message: 'There was an error sending the email. Try again later!'
            }
            await userHistory.save({ validateBeforeSave: false });
            handleError(res, error);
        }
    } catch (err) {
        handleError(res, err);
    }

})


exports.resetPassword = grasp(async (req, res) => {
    try {
        const { password, passwordConfirm } = req.body;
        //Get user based token
        const hashedToken = crypto.createHash('sha256')
            .update(req.params.token).digest('hex');
        //check token exist and token not expired
        const user = await UserHistory.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpire: { $gt: Date.now() }
        })
        if (!user) {
            return sendResponse(res, 400, "fail", "Invalid Token or has expired.")
        }

        // check user exist or not
        const userExist = await User.findEmail(user.userEmail)

        if (!userExist) {
            return sendResponse(res, 401, "fail", "User does not exist.")
        }
        // set new password
        userExist.password = password;
        userExist.passwordConfirm = passwordConfirm;
        await userExist.save()


        const token = getToken(userExist._id)
        const userData = {
            token: token,
            data: user
        }
        sendResponse(res, 200, "success", "You logged in successfully!", userData);


    } catch (err) {
        handleError(res, err);
    }
})