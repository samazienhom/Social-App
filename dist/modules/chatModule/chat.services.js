"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatServices = void 0;
const chat_repo_1 = require("../../DB/Repos/chat.repo");
const user_repo_1 = require("../../DB/Repos/user.repo");
const successHandler_1 = require("../../utils/successHandler");
class ChatServices {
    chatModel = new chat_repo_1.ChatRepo();
    userModel = new user_repo_1.UserRepo();
    getChat = async (req, res) => {
        const authUser = res.locals.user;
        const { id } = req.params;
        const friend = await this.userModel.findById({ id });
        if (!friend) {
            throw new Error("Friend not found");
        }
        let chat = await this.chatModel.findOne({
            filter: {
                group: {
                    $exists: false
                },
                participants: {
                    $all: [authUser._id, friend._id],
                    $size: 2
                }
            },
            options: {
                populate: [{
                        path: 'participants',
                        select: 'firstName lastName profileImage'
                    }]
            }
        });
        if (!chat) {
            chat = await this.chatModel.create({
                doc: {
                    participants: [authUser._id, friend._id]
                }
            });
            chat = await chat.populate([{
                    path: 'participants',
                }]);
        }
        return (0, successHandler_1.successHandler)({ res, data: chat });
    };
}
exports.ChatServices = ChatServices;
