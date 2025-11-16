"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRequestModel = void 0;
const mongoose_1 = require("mongoose");
const friendRequestSchema = new mongoose_1.Schema({
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    acceptedAt: Date
}, {
    timestamps: true
});
exports.friendRequestModel = (0, mongoose_1.model)('friend_requests', friendRequestSchema);
