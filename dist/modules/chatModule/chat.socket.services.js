"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSocketServices = void 0;
const chat_repo_1 = require("../../DB/Repos/chat.repo");
const user_repo_1 = require("../../DB/Repos/user.repo");
class ChatSocketServices {
    chatModel = new chat_repo_1.ChatRepo();
    userModel = new user_repo_1.UserRepo();
    sendMessage = async (socket, data) => {
        const createdBy = socket.user?._id;
        const { content, sendTo } = data;
        console.log('sendMessage called by:', createdBy, 'to:', sendTo, 'content:', content);
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
        console.log('found chat:', chat?._id);
        if (!chat) {
            throw new Error("Chat not found");
        }
        const res = await chat.updateOne({
            $push: {
                messages: {
                    content,
                    createdBy
                }
            }
        });
        socket.emit('successMessage', content);
    };
}
exports.ChatSocketServices = ChatSocketServices;
