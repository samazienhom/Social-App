"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const socket_io_1 = require("socket.io");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const chat_gateway_1 = require("../chatModule/chat.gateway");
const initialize = (httpServer) => {
    const chatGateway = new chat_gateway_1.ChatGateway();
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: "*"
        }
    });
    io.use(async (socket, next) => {
        try {
            const user = await (0, auth_middleware_1.decodeToken)({ authorization: socket.handshake.auth.authorization });
            socket.user = user;
            console.log('socket auth success for user:', user?._id);
            next();
        }
        catch (err) {
            console.log('socket auth failed', err);
            next(new Error("unauthorized"));
        }
    });
    io.on("connection", (socket) => {
        console.log('socket connected:', socket.id, 'user:', socket.user?._id);
        chatGateway.register(socket);
    });
};
exports.initialize = initialize;
