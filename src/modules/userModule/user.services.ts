import { Request, Response } from "express";
import { UserRepo } from "../../DB/Repos/user.repo";
import { uploadFile } from "../../utils/multer/s3.services";
import { HUserDocument } from "./user.types";
import { successHandler } from "../../utils/successHandler";
import { th } from "zod/v4/locales";
import { FrienddRequestRepo } from "../../DB/Repos/friend.request.repo";
import { UserNotFoundException } from "../../utils/errors/errors.exceptions";
import { UserModel } from "../../DB/models/user.model";
import { PostModel } from "../../DB/models/post.model";
import { CommentsModel } from "../../DB/models/comment.model";
import { ReplyModel } from "../../DB/models/reply.model";

export class UserServices {
    private userModel = new UserRepo

    profileImage = async (req: Request, res: Response) => {
        const file = req.file as Express.Multer.File
        const user = res.locals.user as HUserDocument
        const path = await uploadFile({
            file,
            path: `${user._id}/profileImage`
        })
        user.profileImage = path as string
        await user.save()
        return successHandler({ res, data: path })
    }
    private friendRequestModel = new FrienddRequestRepo
    sendFriendRequest = async (req: Request, res: Response) => {
        const { to } = req.body
        const authUser: HUserDocument = res.locals.user
        const from = authUser._id
        if (to.toString() == from.toString()) {
            throw new Error("You can't send friend request to yourself")
        }
        if (!await this.userModel.findById({
            id: to
        })) {
            throw new UserNotFoundException()
        }
        const isFriends = await this.friendRequestModel.findOne({
            filter: {
                $or: [
                    { from: from, to: to },
                    { from: to, to: from }
                ]
            }
        })
        if (isFriends) {
            throw new Error("Friend request already sent or you are already friends")
        }
        const friendRequest = await this.friendRequestModel.create({
            doc: {
                from,
                to
            }
        })
        return successHandler({ res, data: friendRequest })
    }

    acceptFriendRequest = async (req: Request, res: Response) => {
        const authUser: HUserDocument = res.locals.user
        const { id } = req.params as { id: string }
        const friendRequest = await this.friendRequestModel.findOne({
            filter: {
                _id: id,
                to: authUser._id,
                acceptedAt: {
                    $exists: false
                }
            }
        })
        if (!friendRequest) {
            throw new Error("Friend request not found")
        }
        await friendRequest.updateOne({
            acceptedAt: new Date()
        })
        this.userModel.findOneAndUpdate({
            filter: {
                _id: friendRequest.to
            },
            update: {
                $addToSet: {
                    friends: friendRequest.from
                }
            }
        })
        this.userModel.findOneAndUpdate({
            filter: {
                _id: friendRequest.from
            },
            update: {
                $addToSet: {
                    friends: authUser._id
                }
            }
        })
        return successHandler({ res, data: friendRequest })
    }

    unfriend = async (req: Request, res: Response) => {
        const { friendId } = req.body
        const friend = await UserModel.findById(friendId)
        const user = res.locals.user as HUserDocument
        if (!user.friends.includes(friendId)) {
            throw new Error("You are not friends");
        }
        await user.updateOne({
            $pull: {
                friends: friend?._id
            }
        })
        await friend?.updateOne({
            $pull: {
                friends: user._id
            }
        })
        return successHandler({ res })
    }

    blockUser = async (req: Request, res: Response) => {
        const { blockUserId } = req.body
        const blockUser = await UserModel.findById(blockUserId)
        const user = res.locals.user as HUserDocument
        if (!blockUser) {
            throw new UserNotFoundException()
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
            })
        }
        await user.updateOne({
            $push: {
                blockedUsers: blockUser._id
            }
        })
        return successHandler({ res })
    }

    deleteAccount = async (req: Request, res: Response) => {
        const { userId } = req.params
        const isExist=await UserModel.findById(userId)
       const user=res.locals.user as HUserDocument
       if(!isExist){
        throw new UserNotFoundException()
       }
       if(user._id.toString()!=isExist._id.toString()){
        throw new Error("can not delete someone else's account");
       }
        if (user.posts) {
            const post = await PostModel.find({
                createdBy: user._id
            })
            const userComments = await CommentsModel.find({
                createdBy: user._id
            })
            const userReplies = await ReplyModel.find({
                createdBy: user._id
            })

            for (const r of userReplies) {
                await ReplyModel.deleteOne(r._id)
            }
            for (const c of userComments) {
                const commentReply = await ReplyModel.find({
                    comment: c._id
                })
                for (const r of commentReply) {
                    await ReplyModel.deleteOne(r._id)
                }
                await CommentsModel.deleteOne(c._id)
            }
            for (const p of post) {
                const postComments = await CommentsModel.find({
                    post: p._id
                })
                for (const c of postComments) {
                    const commentReply = await ReplyModel.find({
                        comment: c._id
                    })
                    for (const r of commentReply) {
                        await ReplyModel.deleteOne(r._id)
                    }
                    await CommentsModel.deleteOne(c._id)
                }
                await PostModel.deleteOne(p._id)
            }

        }
        await UserModel.deleteOne(user._id)
        return successHandler({res})
    }

}
