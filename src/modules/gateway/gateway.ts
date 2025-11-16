import { Server as HttpServer } from "node:http";
import { Server, Socket } from "socket.io";
import { decodeToken, tokenTypesEnum } from "../../middleware/auth.middleware";
import { HydratedDocument } from "mongoose";
import { IUser } from "../userModule/user.types";
import { ca } from "zod/v4/locales";
import { ChatGateway } from "../chatModule/chat.gateway";

export interface AuthSocket extends Socket {
    user?: HydratedDocument<IUser>
}

export const initialize = (httpServer: HttpServer) => {
    const chatGateway = new ChatGateway()
    const io = new Server(httpServer, {
        cors: {
            origin: "*"
        }
    })

    io.use(async (socket: AuthSocket, next) => {
        try {
            const user = await decodeToken({ authorization: socket.handshake.auth.authorization as string, tokenTypes: tokenTypesEnum.ACCESS })
            socket.user = user
            console.log('socket auth success for user:', user?._id)
            next()
        }
        catch (err) {
            console.log(socket.handshake);
             
            console.log('socket auth failed', err)
            next(new Error("unauthorized"))
        }
    })

    io.on("connection", (socket: AuthSocket) => {
        console.log('socket connected:', socket.id, 'user:', socket.user?._id)
        chatGateway.register(socket)
    })

}