import { Request, Response } from "express";
import { CommentRepo } from "../../DB/Repos/comment.repo";
import { PostRepo } from "../../DB/Repos/post.repo";
import { UserModel } from "../../DB/models/user.model";
import { UserRepo } from "../../DB/Repos/user.repo";
import { UserNotFoundException } from "../../utils/errors/errors.exceptions";
import { successHandler } from "../../utils/successHandler";
import { HUserDocument } from "../userModule/user.types";
import { PostModel } from "../../DB/models/post.model";
import { CommentsModel } from "../../DB/models/comment.model";
import { ReplyRepo } from "../../DB/Repos/reply.repo";
import { ReplyModel } from "../../DB/models/reply.model";
export class CommenrServices {

    private readonly postModel = new PostRepo
    private readonly commentsModel = new CommentRepo
    private readonly userModel = new UserRepo
    private readonly replyModel = new ReplyRepo
    //create comment
    createComment = async (req: Request, res: Response) => {
        const { content, id } = req.body as { content: string, id: string }
        const post = await this.postModel.findById({ id })
        const user = res.locals.user as HUserDocument
        if (!post) {
            throw new Error("Post Not Found");
        }
        const comment = await this.commentsModel.create({
            doc: {
                content,
                post: post._id,
                createdBy: user._id
            }
        })
        await post.updateOne({
            $push: {
                comments: comment._id
            }
        })
        return successHandler({ res })
    }

    //freeze comment
    freezeComment = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const comment = await this.commentsModel.findById({ id })
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        if (comment.isFrozen) {
            throw new Error("Comment Already Frozen");
        }
        await comment.updateOne({
            isFrozen: true
        })
        return successHandler({ res })
    }

    //delete comment
    deleteComment = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const comment = await this.commentsModel.findById({ id })
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        const post = await PostModel.findById(comment.post)
        if (comment.isFrozen) {
            throw new Error("Your comment is frozen,try again later");
        }
        if (comment.reply) {
            const replies = await comment.populate({
                path: 'reply',
                select: '_id'
            })
            for (const r of replies.reply) {
                await ReplyModel.findByIdAndDelete(r._id)
            }
        }

        await comment.deleteOne({ comment })
        await post?.updateOne({
            $pull: {
                comments: comment._id
            }
        })
        return successHandler({ res })
    }
    //updateComment
    updateComment = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const { newContent } = req.body
        const comment = await this.commentsModel.findById({ id })
        const user = res.locals.user as HUserDocument
        if (!comment) {
            throw new Error("Comment Not Found");
        }
        if (!user) {
            throw new Error("can not edit someone else's comment");

        }
        if(comment.isFrozen){
            throw new Error("your comment is frozen right now");
            
        }
        await comment.updateOne({
            content: newContent
        })
        return successHandler({ res })
    }
    //get comment by id
    getCommentById = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const comment = await this.commentsModel.findById({ id })
        if (!comment) {
            throw new Error("Comment not found");
        }
        return successHandler({ res, data: comment })
    }

    //create reply
    createReply = async (req: Request, res: Response) => {
        const { commentId, content } = req.body
        const comment = await CommentsModel.findById(commentId)
        const user = res.locals.user as HUserDocument
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
        })
        await comment.updateOne({
            $push: {
                reply: reply._id
            }
        })
        return successHandler({ res })
    }

    //get comment with reply
    getCommentWithReply = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const comment = await this.commentsModel.findById({ id })
        if (!comment) {
            throw new Error("Comment not found");
        }
        const result = await comment.populate({
            path: 'reply',
            select: "content"
        })
        return successHandler({ res, data: result })
    }
}