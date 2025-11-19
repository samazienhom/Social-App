"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepo = void 0;
const DBRepo_1 = require("../DBRepo");
const post_model_1 = require("../models/post.model");
class PostRepo extends DBRepo_1.DBRepo {
    model;
    constructor(model = post_model_1.PostModel) {
        super(post_model_1.PostModel);
        this.model = model;
    }
}
exports.PostRepo = PostRepo;
