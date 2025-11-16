"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_services_1 = require("./chat.services");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const chatRouter = (0, express_1.Router)({
    mergeParams: true
});
const chatServices = new chat_services_1.ChatServices();
chatRouter.get('/', auth_middleware_1.auth, chatServices.getChat);
chatRouter.post('/create-group', auth_middleware_1.auth, chatServices.createGroup);
chatRouter.get('/get-group-chat/:groupId', auth_middleware_1.auth, chatServices.getGroupChat);
exports.default = chatRouter;
