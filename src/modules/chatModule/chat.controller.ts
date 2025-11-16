import { Router } from "express";
import { ChatServices } from "./chat.services";
import { auth } from "../../middleware/auth.middleware";

const chatRouter=Router({
    mergeParams:true
})
const chatServices = new ChatServices()

chatRouter.get('/',auth, chatServices.getChat)
chatRouter.post('/create-group',auth, chatServices.createGroup)
chatRouter.get('/get-group-chat/:groupId',auth,chatServices.getGroupChat)

export default chatRouter