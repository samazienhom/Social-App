import { Request, Response } from "express";
import { ChatRepo } from "../../DB/Repos/chat.repo";
import { HUserDocument } from "../userModule/user.types";
import { UserRepo } from "../../DB/Repos/user.repo";
import { successHandler } from "../../utils/successHandler";


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


}
