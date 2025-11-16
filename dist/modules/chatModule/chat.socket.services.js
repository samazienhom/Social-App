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
    joinRoom = async (socket, roomId) => {
        try {
            const group = await this.chatModel.findOne({
                filter: {
                    roomId,
                    participants: {
                        $in: socket.user?._id
                    },
                    group: {
                        $exists: true
                    }
                }
            });
            if (!group) {
                throw new Error("group not found");
            }
            socket.join(roomId);
            console.log("user joined");
        }
        catch (error) {
            socket.emit('customError', error);
        }
    };
    sendGroupMessage = async (socket, { content, groupId }) => {
        try {
            const user = socket.user;
            const group = await this.chatModel.findOne({
                filter: {
                    _id: groupId,
                    participants: {
                        $in: socket.user?._id
                    },
                    group: {
                        $exists: true
                    }
                }
            });
            if (!group) {
                throw new Error("group not found");
            }
            await group.updateOne({
                $push: {
                    messages: {
                        content,
                        createdBy: user?._id
                    }
                }
            });
            socket.emit('successMessage', content);
            socket.to(gateway_1.connectedSockets.get(user?._id.toString()) || []).emit('successMessage', content);
            socket.to(group.roomId).emit('newMessage', {
                content, from: user, groupId
            });
        }
        catch (error) {
            socket.emit('customError', error);
        }
    };
}
exports.ChatSocketServices = ChatSocketServices;
