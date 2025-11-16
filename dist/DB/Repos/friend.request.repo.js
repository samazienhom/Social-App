"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrienddRequestRepo = void 0;
const DBRepo_1 = require("../DBRepo");
const friend_request_1 = require("../models/friend.request");
class FrienddRequestRepo extends DBRepo_1.DBRepo {
    model;
    constructor(model = friend_request_1.friendRequestModel) {
        super(friend_request_1.friendRequestModel);
        this.model = model;
    }
}
exports.FrienddRequestRepo = FrienddRequestRepo;
