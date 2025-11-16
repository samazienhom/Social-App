"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEvents = void 0;
const chat_socket_services_1 = require("./chat.socket.services");
class ChatEvents {
    chatSocketServices = new chat_socket_services_1.ChatSocketServices();
    sendMessage = async (socket) => {
        socket.on("sendMessage", (data) => {
            this.chatSocketServices.sendMessage(socket, data);
        });
    };
}
exports.ChatEvents = ChatEvents;
