"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplyRepo = void 0;
const DBRepo_1 = require("../DBRepo");
const reply_model_1 = require("../models/reply.model");
class ReplyRepo extends DBRepo_1.DBRepo {
    model;
    constructor(model = reply_model_1.ReplyModel) {
        super(reply_model_1.ReplyModel);
        this.model = model;
    }
}
exports.ReplyRepo = ReplyRepo;
