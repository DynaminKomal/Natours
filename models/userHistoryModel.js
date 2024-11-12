const mongoose = require('mongoose');
const crypto = require('crypto')


const userHistorySchema = new mongoose.Schema({
    userEmail: String,
    passwordResetToken: String,
    passwordResetExpire: Date,
})

userHistorySchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).
        digest('hex');

    this.passwordResetExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const UserHistory = mongoose.model('User-History', userHistorySchema);

module.exports = UserHistory;