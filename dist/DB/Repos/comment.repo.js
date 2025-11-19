"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepo = void 0;
const DBRepo_1 = require("../DBRepo");
const comment_model_1 = require("../models/comment.model");
class CommentRepo extends DBRepo_1.DBRepo {
    model;
    constructor(model = comment_model_1.CommentsModel) {
        super(comment_model_1.CommentsModel);
        this.model = model;
    }
}
exports.CommentRepo = CommentRepo;
