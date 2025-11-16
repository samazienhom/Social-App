import { AuthSocket } from "../gateway/gateway";
import { ChatSocketServices } from "./chat.socket.services";


export class ChatEvents{
    private readonly chatSocketServices=new ChatSocketServices() 
    sendMessage=async(socket:AuthSocket)=>{
        socket.on("sendMessage",(data)=>{
            this.chatSocketServices.sendMessage(socket,data)
           
        })
    }
    joinRoom=async(socket:AuthSocket)=>{
        socket.on('join_room',({roomId})=>{
            this.chatSocketServices.joinRoom(socket,roomId)
        })
    }
    sendGroupMessage=async(socket:AuthSocket)=>{
        socket.on('sendGroupMessage',(data)=>{
            this.chatSocketServices.sendGroupMessage(socket,data)
        })
    }
}
