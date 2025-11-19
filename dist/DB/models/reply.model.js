"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyModel = void 0;
const mongoose_1 = require("mongoose");
const reolySchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    content: {
        type: String,
        required: true
    },
    comment: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "comments"
    }
}, {
    timestamps: true
});
exports.ReplyModel = (0, mongoose_1.model)("reply", reolySchema);
