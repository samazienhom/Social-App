"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsModel = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    content: {
        type: String,
        required: true
    },
    post: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "posts"
    },
    reply: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "reply"
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true
});
exports.commentsModel = (0, mongoose_1.model)("comments", commentSchema);
