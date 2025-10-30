"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number
    },
    phone: {
        type: String
    },
    profileImage: {
        type: String
    },
    covserImages: {
        type: [String]
    },
    folderId: String,
    isConfirmed: {
        type: Boolean,
        default: false
    },
    changedCredentialsAt: Date,
    emailOtp: {
        otp: String,
        expiredAt: Date
    },
    passOtp: {
        otp: String,
        expiredAt: Date
    }
}, {
    timestamps: true
});
exports.UserModel = mongoose_1.models.users || (0, mongoose_1.model)('users', userSchema);
