"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_repo_1 = require("../../DB/Repos/user.repo");
const s3_services_1 = require("../../utils/multer/s3.services");
const successHandler_1 = require("../../utils/successHandler");
const friend_request_repo_1 = require("../../DB/Repos/friend.request.repo");
const errors_exceptions_1 = require("../../utils/errors/errors.exceptions");
const user_model_1 = require("../../DB/models/user.model");
const post_model_1 = require("../../DB/models/post.model");
const comment_model_1 = require("../../DB/models/comment.model");
const reply_model_1 = require("../../DB/models/reply.model");
class UserServices {
    userModel = new user_repo_1.UserRepo;
    profileImage = async (req, res) => {
        const file = req.file;
        const user = res.locals.user;
        const path = await (0, s3_services_1.uploadFile)({
            file,
            path: `${user._id}/profileImage`
        });
        user.profileImage = path;
        await user.save();
        return (0, successHandler_1.successHandler)({ res, data: path });
    };
    friendRequestModel = new friend_request_repo_1.FrienddRequestRepo;
    sendFriendRequest = async (req, res) => {
        const { to } = req.body;
        const authUser = res.locals.user;
        const from = authUser._id;
        if (to.toString() == from.toString()) {
            throw new Error("You can't send friend request to yourself");
        }
        if (!await this.userModel.findById({
            id: to
        })) {
            throw new errors_exceptions_1.UserNotFoundException();
        }
        const isFriends = await this.friendRequestModel.findOne({
            filter: {
                $or: [
                    { from: from, to: to },
                    { from: to, to: from }
                ]
            }
        });
        if (isFriends) {
            throw new Error("Friend request already sent or you are already friends");
        }
        const friendRequest = await this.friendRequestModel.create({
            doc: {
                from,
                to
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: friendRequest });
    };
    acceptFriendRequest = async (req, res) => {
        const authUser = res.locals.user;
        const { id } = req.params;
        const friendRequest = await this.friendRequestModel.findOne({
            filter: {
                _id: id,
                to: authUser._id,
                acceptedAt: {
                    $exists: false
                }
            }
        });
        if (!friendRequest) {
            throw new Error("Friend request not found");
        }
        await friendRequest.updateOne({
            acceptedAt: new Date()
        });
        this.userModel.findOneAndUpdate({
            filter: {
                _id: friendRequest.to
            },
            update: {
                $addToSet: {
                    friends: friendRequest.from
                }
            }
        });
        this.userModel.findOneAndUpdate({
            filter: {
                _id: friendRequest.from
            },
            update: {
                $addToSet: {
                    friends: authUser._id
                }
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: friendRequest });
    };
    unfriend = async (req, res) => {
        const { friendId } = req.body;
        const friend = await user_model_1.UserModel.findById(friendId);
        const user = res.locals.user;
        if (!user.friends.includes(friendId)) {
            throw new Error("You are not friends");
        }
        await user.updateOne({
            $pull: {
                friends: friend?._id
            }
        });
        await friend?.updateOne({
            $pull: {
                friends: user._id
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    blockUser = async (req, res) => {
        const { blockUserId } = req.body;
        const blockUser = await user_model_1.UserModel.findById(blockUserId);
        const user = res.locals.user;
        if (!blockUser) {
            throw new errors_exceptions_1.UserNotFoundException();
        }
        if (user.blockedUsers.includes(blockUserId)) {
            throw new Error("user already blocked");
        }
        if (user.friends.includes(blockUserId)) {
            await user.updateOne({
                $push: {
                    blockedUsers: blockUser._id
                },
                $pull: {
                    friends: blockUser._id
                }
            });
        }
        await user.updateOne({
            $push: {
                blockedUsers: blockUser._id
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    deleteAccount = async (req, res) => {
        const { userId } = req.params;
        const isExist = await user_model_1.UserModel.findById(userId);
        const user = res.locals.user;
        if (!isExist) {
            throw new errors_exceptions_1.UserNotFoundException();
        }
        if (user._id.toString() != isExist._id.toString()) {
            throw new Error("can not delete someone else's account");
        }
        if (user.posts) {
            const post = await post_model_1.PostModel.find({
                createdBy: user._id
            });
            const userComments = await comment_model_1.CommentsModel.find({
                createdBy: user._id
            });
            const userReplies = await reply_model_1.ReplyModel.find({
                createdBy: user._id
            });
            for (const r of userReplies) {
                await reply_model_1.ReplyModel.deleteOne(r._id);
            }
            for (const c of userComments) {
                const commentReply = await reply_model_1.ReplyModel.find({
                    comment: c._id
                });
                for (const r of commentReply) {
                    await reply_model_1.ReplyModel.deleteOne(r._id);
                }
                await comment_model_1.CommentsModel.deleteOne(c._id);
            }
            for (const p of post) {
                const postComments = await comment_model_1.CommentsModel.find({
                    post: p._id
                });
                for (const c of postComments) {
                    const commentReply = await reply_model_1.ReplyModel.find({
                        comment: c._id
                    });
                    for (const r of commentReply) {
                        await reply_model_1.ReplyModel.deleteOne(r._id);
                    }
                    await comment_model_1.CommentsModel.deleteOne(c._id);
                }
                await post_model_1.PostModel.deleteOne(p._id);
            }
        }
        await user_model_1.UserModel.deleteOne(user._id);
        return (0, successHandler_1.successHandler)({ res });
    };
}
exports.UserServices = UserServices;
