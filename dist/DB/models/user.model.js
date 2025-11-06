"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const hash_1 = require("../../utils/security/hash");
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
//document middleware hooks save
userSchema.pre('save', async function (next) {
    console.log({ doc: this });
    if (this.isModified('password')) {
        this.password = await (0, hash_1.hash)(this.password);
    }
    console.log('pre save');
});
//document middleware hooks update
userSchema.pre('updateOne', { document: true, query: false }, async function (next) {
    console.log(this);
});
//document middleware hooks delete
userSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    console.log(this);
});
//query middleware hooks update
userSchema.pre('updateOne', async function (next) {
    console.log(this);
});
//query middleware hooks delete
userSchema.pre('deleteOne', async function (next) {
    console.log(this);
});
//query middleware hooks findOne
userSchema.pre('findOne', async function (next) {
    this.setQuery({ ...this.getQuery(), firstName: "sama" });
});
//query middleware hooks findoneAndUpdate
userSchema.pre('findOneAndUpdate', async function (next) {
    this.setUpdate({
        ...this.getUpdate(),
        $inc: {
            __v: 1
        }
    });
    console.log(this.getUpdate(), this.getOptions());
});
//model middleware hooks insertMany
userSchema.pre('insertMany', async function (next, docs) {
    console.log(this);
    console.log(docs);
});
exports.UserModel = mongoose_1.models.users || (0, mongoose_1.model)('users', userSchema);
