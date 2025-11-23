"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommenrServices = void 0;
const comment_repo_1 = require("../../DB/Repos/comment.repo");
const post_repo_1 = require("../../DB/Repos/post.repo");
const user_repo_1 = require("../../DB/Repos/user.repo");
const successHandler_1 = require("../../utils/successHandler");
const post_model_1 = require("../../DB/models/post.model");
const comment_model_1 = require("../../DB/models/comment.model");
const reply_repo_1 = require("../../DB/Repos/reply.repo");
const reply_model_1 = require("../../DB/models/reply.model");
class CommenrServices {
    postModel = new post_repo_1.PostRepo;
    commentsModel = new comment_repo_1.CommentRepo;
    userModel = new user_repo_1.UserRepo;
    replyModel = new reply_repo_1.ReplyRepo;
    //create comment
    createComment = async (req, res) => {
        const { content, id } = req.body;
        const post = await this.postModel.findById({ id });
        const user = res.locals.user;
        if (!post) {
            throw new Error("Post Not Found");
        }
        const comment = await this.commentsModel.create({
            doc: {
                content,
                post: post._id,
                createdBy: user._id
            }
        });
        await post.updateOne({
            $push: {
                comments: comment._id
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    //freeze comment
    freezeComment = async (req, res) => {
        const { id } = req.params;
        const comment = await this.commentsModel.findById({ id });
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        if (comment.isFrozen) {
            throw new Error("Comment Already Frozen");
        }
        await comment.updateOne({
            isFrozen: true
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    //delete comment
    deleteComment = async (req, res) => {
        const { id } = req.params;
        const comment = await this.commentsModel.findById({ id });
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        const post = await post_model_1.PostModel.findById(comment.post);
        if (comment.isFrozen) {
            throw new Error("Your comment is frozen,try again later");
        }
        if (comment.reply) {
            const replies = await comment.populate({
                path: 'reply',
                select: '_id'
            });
            for (const r of replies.reply) {
                await reply_model_1.ReplyModel.findByIdAndDelete(r._id);
            }
        }
        await comment.deleteOne({ comment });
        await post?.updateOne({
            $pull: {
                comments: comment._id
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    //updateComment
    updateComment = async (req, res) => {
        const { id } = req.params;
        const { newContent } = req.body;
        const comment = await this.commentsModel.findById({ id });
        const user = res.locals.user;
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        if (!user) {
            throw new Error("can not edit someone else's comment");
        }
        if (comment.isFrozen) {
            throw new Error("your comment is frozen right now");
        }
        await comment.updateOne({
            content: newContent
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    //get comment by id
    getCommentById = async (req, res) => {
        const { id } = req.params;
        const comment = await this.commentsModel.findById({ id });
        if (!comment) {
            throw new Error("Comment not found");
        }
        return (0, successHandler_1.successHandler)({ res, data: comment });
    };
    //create reply
    createReply = async (req, res) => {
        const { commentId, content } = req.body;
        const comment = await comment_model_1.CommentsModel.findById(commentId);
        const user = res.locals.user;
        if (!comment) {
            throw new Error("Comment not found");
        }
        if (comment.isFrozen) {
            throw new Error("This comment is frozen,try again later");
        }
        const reply = await this.replyModel.create({
            doc: {
                comment: comment._id,
                content,
                createdBy: user._id,
            }
        });
        await comment.updateOne({
            $push: {
                reply: reply._id
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    //get comment with reply
    getCommentWithReply = async (req, res) => {
        const { id } = req.params;
        const comment = await this.commentsModel.findById({ id });
        if (!comment) {
            throw new Error("Comment not found");
        }
        const result = await comment.populate({
            path: 'reply',
            select: "content"
        });
        return (0, successHandler_1.successHandler)({ res, data: result });
    };
}
exports.CommenrServices = CommenrServices;
