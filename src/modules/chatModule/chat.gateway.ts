import { AuthSocket } from "../gateway/gateway";
import { ChatEvents } from "./chat.events";


export class ChatGateway {
    private readonly chatEvents = new ChatEvents()
    register=(socket:AuthSocket)=>{
        // console.log('registering chat events for socket:', socket.id)
        this.chatEvents.sendMessage(socket)
    }
}