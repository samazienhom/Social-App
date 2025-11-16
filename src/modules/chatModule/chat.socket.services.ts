import { da } from "zod/v4/locales";
import { AuthSocket } from "../gateway/gateway";
import { ChatRepo } from "../../DB/Repos/chat.repo";
import { UserRepo } from "../../DB/Repos/user.repo";

export class ChatSocketServices {
    private readonly chatModel = new ChatRepo();
    private readonly userModel = new UserRepo();
    sendMessage=async(socket:AuthSocket,data:{
        content:string,
        sendTo:string
    })=>{
        const createdBy = socket.user?._id
        const { content, sendTo } = data
        console.log('sendMessage called by:', createdBy, 'to:', sendTo, 'content:', content)
        const to = await this.userModel.findById({ id: sendTo })
        if(!to){
            throw new Error("Recipient not found")
        }
        const chat = await this.chatModel.findOne({
            filter: {
                group: {
                    $exists: false
                },
                participants: {
                    $all: [createdBy, to._id],
                }
            }
        })
        console.log('found chat:', chat?._id)
        if(!chat){
            throw new Error("Chat not found")
        }
        const res = await chat.updateOne({
            $push: {
                messages: {
                    content,
                    createdBy
                }
            }
        })
        socket.emit('successMessage',content)
    }
    }
    