import { Request, Response } from "express";

import { PostRepo } from "../../DB/Repos/post.repo";
import { UserModel } from "../../DB/models/user.model";

import { UserNotFoundException } from "../../utils/errors/errors.exceptions";
import { successHandler } from "../../utils/successHandler";
import { HUserDocument } from "../userModule/user.types";

import { PostModel } from "../../DB/models/post.model";
import { CommentsModel } from "../../DB/models/comment.model";

import { ReplyModel } from "../../DB/models/reply.model";

import { EMAIL_EVENTS, emailEmitter } from "../../utils/email/email.events";
import { tagged_template } from "../../utils/email/tag_tamplate";

export class PostServices {
    private readonly postModel = new PostRepo


    //create post
    createPost = async (req: Request, res: Response) => {
        const {
            content
        } = req.body
        const user = res.locals.user as HUserDocument
        const post = await this.postModel.create({
            doc: {
                createdBy: user._id,
                content,
            }
        })
        await user.updateOne({
            $push: {
                posts: post._id
            }
        })
        return successHandler({ res })
    }
    //freeze post
    freezePost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const post = await this.postModel.findById({ id })
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (post.isFrozen) {
            throw new Error("Post already frozen");
        }
        await post.updateOne({
            isFrozen: true
        })
        return successHandler({ res })
    }

    //delete post
    deletePost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const post = await this.postModel.findById({ id })
        const user = res.locals.user as HUserDocument
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
            })
            for (const c of postComment.comments) {
                const replies=await ReplyModel.find({
                    comment:c._id
                })
                for(const r of replies){
                    await ReplyModel.deleteOne(r._id)
                }
                await CommentsModel.findByIdAndDelete(c._id)
           }

        }
        await PostModel.deleteOne({
            _id: post._id
        })
        await user.updateOne({
            $pull: {
                posts: post._id
            }
        })
        await user.save()
        return successHandler({ res })
    }

    //update post
    updatePost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const { newContent } = req.body
        const post = await this.postModel.findById({ id })
        const user = res.locals.user as HUserDocument
        if (!post) {
            throw new Error("Post Not Found");
        }
        if (post.createdBy.toString() != user._id.toString()) {
            throw new Error("Can not edit somone else's post");
        }
        if(post.isFrozen){
            throw new Error("post is frozen");
            
        }
        await post.updateOne({
            content: newContent
        })
        return successHandler({ res })
    }
    //get post by id
    getPost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const post = await this.postModel.findById({ id })
        if (!post) {
            throw new Error("Post Not Found");
        }
        return successHandler({ res, data: post })
    }
    //like unlike
    likeAndUnlikePost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const post = await this.postModel.findById({ id })
        const user = res.locals.user as HUserDocument
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

            })
            return successHandler({ res, data: "unliked" })
        }
        await post.updateOne({
            $inc: {
                likesCount: 1
            },
            $push: {
                likedBy: user._id
            }

        })
        return successHandler({ res, data: "liked" })
    }
    likePostasync = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const post = await this.postModel.findById({ id })
        const user = res.locals.user as HUserDocument
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

        })
        return successHandler({ res, data: "liked" })

    }
    unlikePost = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const post = await this.postModel.findById({ id })
        const user = res.locals.user as HUserDocument
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

        })
        return successHandler({ res, data: "unliked" })
    }


    //send email tags 
    sendTags=async(req:Request,res:Response)=>{
        const user=res.locals.user as HUserDocument
        const  {to}=req.body 
        const tagedUser=await UserModel.findById(to)
        if(!tagedUser){
            throw new UserNotFoundException()
        }
        const html=tagged_template({
            name:tagedUser.firstName,
            author:user.firstName,
            subject:`${user.firstName +' '+user.lastName} tagged you`
        })
        emailEmitter.publish(EMAIL_EVENTS.TAG,{
            to:tagedUser.email,
            subject:`${user.firstName +' '+user.lastName} tagged you`,
            html
        })
        return successHandler({res})
    }

   
}
