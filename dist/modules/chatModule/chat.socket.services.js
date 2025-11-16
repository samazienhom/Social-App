"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocketServices = void 0;
const gateway_1 = require("../gateway/gateway");
const chat_repo_1 = require("../../DB/Repos/chat.repo");
const user_repo_1 = require("../../DB/Repos/user.repo");
class ChatSocketServices {
    chatModel = new chat_repo_1.ChatRepo();
    userModel = new user_repo_1.UserRepo();
    sendMessage = async (socket, data) => {
        const createdBy = socket.user?._id;
        const { content, sendTo } = data;
        const to = await this.userModel.findById({ id: sendTo });
        if (!to) {
            throw new Error("Recipient not found");
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
        });
        if (!chat) {
            throw new Error("Chat not found");
        }
        await chat.updateOne({
            $push: {
                messages: {
                    content,
                    createdBy
                }
            }
        });
        socket.emit('successMessage', content);
        socket.to(gateway_1.connectedSockets.get(createdBy?.toString()) || []).emit('successMessage', content);
        socket.to(gateway_1.connectedSockets.get(to._id.toString()) || []).emit('newMessage', { content, from: { _id: createdBy } });
    };
}
exports.ChatSocketServices = ChatSocketServices;
