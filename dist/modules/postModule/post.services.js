"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostServices = void 0;
const post_repo_1 = require("../../DB/Repos/post.repo");
const user_model_1 = require("../../DB/models/user.model");
const errors_exceptions_1 = require("../../utils/errors/errors.exceptions");
const successHandler_1 = require("../../utils/successHandler");
const post_model_1 = require("../../DB/models/post.model");
const comment_model_1 = require("../../DB/models/comment.model");
const reply_model_1 = require("../../DB/models/reply.model");
const email_events_1 = require("../../utils/email/email.events");
const tag_tamplate_1 = require("../../utils/email/tag_tamplate");
class PostServices {
    postModel = new post_repo_1.PostRepo;
    //create post
    createPost = async (req, res) => {
        const { content } = req.body;
        const user = res.locals.user;
        const post = await this.postModel.create({
            doc: {
                createdBy: user._id,
                content,
            }
        });
        await user.updateOne({
            $push: {
                posts: post._id
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    //freeze post
    freezePost = async (req, res) => {
        const { id } = req.params;
        const post = await this.postModel.findById({ id });
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (post.isFrozen) {
            throw new Error("Post already frozen");
        }
        await post.updateOne({
            isFrozen: true
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    //delete post
    deletePost = async (req, res) => {
        const { id } = req.params;
        const post = await this.postModel.findById({ id });
        const user = res.locals.user;
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (user._id.toString() != post.createdBy.toString()) {
            throw new Error("Can't Delete Someone Else's Post");
        }
        if (post.isFrozen) {
            throw new Error("your post is frozen,try again later");
        }
        if (post?.comments) {
            const postComment = await post.populate({
                path: 'comments',
                select: '_id'
            });
            for (const c of postComment.comments) {
                const replies = await reply_model_1.ReplyModel.find({
                    comment: c._id
                });
                for (const r of replies) {
                    await reply_model_1.ReplyModel.deleteOne(r._id);
                }
                await comment_model_1.CommentsModel.findByIdAndDelete(c._id);
            }
        }
        await post_model_1.PostModel.deleteOne({
            _id: post._id
        });
        await user.updateOne({
            $pull: {
                posts: post._id
            }
        });
        await user.save();
        return (0, successHandler_1.successHandler)({ res });
    };
    //update post
    updatePost = async (req, res) => {
        const { id } = req.params;
        const { newContent } = req.body;
        const post = await this.postModel.findById({ id });
        const user = res.locals.user;
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (post.createdBy.toString() != user._id.toString()) {
            throw new Error("Can not edit somone else's post");
        }
        if (post.isFrozen) {
            throw new Error("post is frozen");
        }
        await post.updateOne({
            content: newContent
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    //get post by id
    getPost = async (req, res) => {
        const { id } = req.params;
        const post = await this.postModel.findById({ id });
        if (!post) {
            throw new Error("Post Not Found");
        }
        return (0, successHandler_1.successHandler)({ res, data: post });
    };
    //like unlike
    likeAndUnlikePost = async (req, res) => {
        const { id } = req.params;
        const post = await this.postModel.findById({ id });
        const user = res.locals.user;
        if (!post) {
            throw new Error("Post Not found");
        }
        if (post.isFrozen) {
            throw new Error("Can't do any actions on this post");
        }
        if (post.likedBy.includes(user._id)) {
            await post.updateOne({
                $inc: {
                    likesCount: -1
                },
                $pull: {
                    likedBy: user._id
                }
            });
            return (0, successHandler_1.successHandler)({ res, data: "unliked" });
        }
        await post.updateOne({
            $inc: {
                likesCount: 1
            },
            $push: {
                likedBy: user._id
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: "liked" });
    };
    likePostasync = async (req, res) => {
        const { id } = req.params;
        const post = await this.postModel.findById({ id });
        const user = res.locals.user;
        if (!post) {
            throw new Error("Post Not found");
        }
        if (post.isFrozen) {
            throw new Error("Can't do any actions on this post");
        }
        if (post.likedBy.includes(user._id)) {
            throw new Error("You Already liked the post");
        }
        await post.updateOne({
            $inc: {
                likesCount: 1
            },
            $push: {
                likedBy: user._id
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: "liked" });
    };
    unlikePost = async (req, res) => {
        const { id } = req.params;
        const post = await this.postModel.findById({ id });
        const user = res.locals.user;
        if (!post) {
            throw new Error("Post Not found");
        }
        if (post.isFrozen) {
            throw new Error("Can't do any actions on this post");
        }
        if (!post.likedBy.includes(user._id)) {
            throw new Error("you did not like this post");
        }
        await post.updateOne({
            $inc: {
                likesCount: -1
            },
            $pull: {
                likedBy: user._id
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: "unliked" });
    };
    //send email tags 
    sendTags = async (req, res) => {
        const user = res.locals.user;
        const { to } = req.body;
        const tagedUser = await user_model_1.UserModel.findById(to);
        if (!tagedUser) {
            throw new errors_exceptions_1.UserNotFoundException();
        }
        const html = (0, tag_tamplate_1.tagged_template)({
            name: tagedUser.firstName,
            author: user.firstName,
            subject: `${user.firstName + ' ' + user.lastName} tagged you`
        });
        email_events_1.emailEmitter.publish(email_events_1.EMAIL_EVENTS.TAG, {
            to: tagedUser.email,
            subject: `${user.firstName + ' ' + user.lastName} tagged you`,
            html
        });
        return (0, successHandler_1.successHandler)({ res });
    };
}
exports.PostServices = PostServices;
