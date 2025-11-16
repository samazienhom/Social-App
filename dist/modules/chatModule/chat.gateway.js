"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const chat_events_1 = require("./chat.events");
class ChatGateway {
    chatEvents = new chat_events_1.ChatEvents();
    register = (socket) => {
        console.log('registering chat events for socket:', socket.id);
        this.chatEvents.sendMessage(socket);
    };
}
exports.ChatGateway = ChatGateway;
