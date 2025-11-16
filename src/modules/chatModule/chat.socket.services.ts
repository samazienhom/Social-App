import { da } from "zod/v4/locales";
import { AuthSocket, connectedSockets } from "../gateway/gateway";
import { ChatRepo } from "../../DB/Repos/chat.repo";
import { UserRepo } from "../../DB/Repos/user.repo";
import { connect } from "node:http2";

export class ChatSocketServices {
    private readonly chatModel = new ChatRepo();
    private readonly userModel = new UserRepo();


    sendMessage=async(socket:AuthSocket,data:{
        content:string,
        sendTo:string
    })=>{
        const createdBy = socket.user?._id
        const { content, sendTo } = data
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
        if(!chat){
            throw new Error("Chat not found")
        }
        await chat.updateOne({
            $push: {
                messages: {
                    content,
                    createdBy
                }
            }
        })
        socket.emit('successMessage',content)
        socket.to(connectedSockets.get(createdBy?.toString() as string)||[]).emit('successMessage',content)
        socket.to(connectedSockets.get(to._id.toString() as string)||[]).emit('newMessage',{content,from:{_id:createdBy}})
    }
    }
    