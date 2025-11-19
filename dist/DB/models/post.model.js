"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostModel = void 0;
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    comments: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "comments"
    },
    likesCount: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "users"
    },
    shareCount: {
        type: Number,
        default: 0
    },
    isFrozen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
exports.PostModel = (0, mongoose_1.model)("posts", postSchema);
