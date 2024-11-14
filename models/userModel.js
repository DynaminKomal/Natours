const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        trim: true,
        index: true,
        lowercase: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'A user must have email'],
        validate: [validator.isEmail, 'Please Provide valid email']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'admin'],
        default: 'user',
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 8
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please provide confirm password'],
        minlength: 8,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Password and Confirm password are not matched! "
        }
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next()
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changePassword = async function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changeTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changeTimestamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    crypto.createHash('sha256').update(resetToken).digest('hex');
}

userSchema.statics.findEmail = function (email) {
    return this.findOne({ email })
}

const User = mongoose.model('Users', userSchema);

module.exports = User;