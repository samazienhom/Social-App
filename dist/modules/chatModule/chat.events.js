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
    joinRoom = async (socket) => {
        socket.on('join_room', ({ roomId }) => {
            this.chatSocketServices.joinRoom(socket, roomId);
        });
    };
    sendGroupMessage = async (socket) => {
        socket.on('sendGroupMessage', (data) => {
            this.chatSocketServices.sendGroupMessage(socket, data);
        });
    };
}
exports.ChatEvents = ChatEvents;
