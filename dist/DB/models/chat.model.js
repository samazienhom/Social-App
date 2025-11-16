"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModel = void 0;
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    content: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
const chatSchema = new mongoose_1.Schema({
    participants: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }],
    // embed messages as subdocuments
    messages: [messageSchema],
    group: {
        type: String,
        required: false
    },
    groupImage: {
        type: String,
        required: false
    },
    roomId: {
        type: String,
        required: false
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: false
    }
}, {
    timestamps: true
});
exports.ChatModel = (0, mongoose_1.model)('chats', chatSchema);
