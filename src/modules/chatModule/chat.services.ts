import { Request, Response } from "express";
import { ChatRepo } from "../../DB/Repos/chat.repo";
import { HUserDocument } from "../userModule/user.types";
import { UserRepo } from "../../DB/Repos/user.repo";
import { successHandler } from "../../utils/successHandler";
import { Types } from "mongoose";
import { nanoid } from "nanoid";


export class ChatServices {
    private chatModel = new ChatRepo()
    private userModel = new UserRepo()

    getChat = async (req: Request, res: Response) => {
        const authUser: HUserDocument = res.locals.user
        const { id } = req.params as { id: string }
        const friend = await this.userModel.findById({ id })
        if (!friend) {
            throw new Error("Friend not found")
        }
        let chat = await this.chatModel.findOne({
            filter: {
                group: {
                    $exists: false
                },
                participants: {
                    $all: [authUser._id, friend._id],
                    $size: 2
                }
            },
            options: {
                populate: [{
                    path: 'participants',
                    select: 'firstName lastName profileImage'
                }]
            }
        })
        if (!chat) {
            chat = await this.chatModel.create({
                doc: {
                    participants: [authUser._id, friend._id]
                }
            })
            chat = await chat.populate([{
                path: 'participants',
            }])
        }
    
        return successHandler({ res, data: chat })
    }

    createGroup=async(req:Request,res:Response)=>{
        const {group,participants}:{
            group:string,
            participants:Types.ObjectId[]
        }=req.body
        const user=res.locals.user as HUserDocument
        const dbParticipants=await this.userModel.find({
            filter:{
                _id:{
                    $in:participants
                }
            }
        })
        if(dbParticipants.length!=participants.length){
            throw new Error("Some participants not found")
        }
        const roomId=nanoid(10)
        const newGroup=await this.chatModel.create({
            doc:{
                group,
                participants: [user._id, ...participants],
                createdBy: user._id,
                roomId
            }
        })
        return successHandler({ res, data: newGroup })
    }

    getGroupChat=async(req:Request,res:Response)=>{
        const {groupId}=req.params as {groupId:string}
        const user=res.locals.user as HUserDocument
        const chat=await this.chatModel.findOne({
            filter:{
                group:{
                    $exists:true
                },
                _id:groupId,
                participants:{
                    $in:user._id
                }
            },
            options:{
                populate:[{
                    path:"messages.createdBy"
                }]
            }
        })
        return successHandler({
            res,
            data:{chat}
        })
    }

}
