import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { CommenrServices } from "./comment.services";

const commentRouter=Router()
const commentServices=new CommenrServices()


commentRouter.post("/create-comment",auth,commentServices.createComment)
commentRouter.patch('/freeze-comment/:id',commentServices.freezeComment)
commentRouter.delete('/delete-comment/:id',auth,commentServices.deleteComment)
commentRouter.patch('/update-comment/:id',auth,commentServices.updateComment)
commentRouter.get("/get-comment-by-id/:id",commentServices.getCommentById)


commentRouter.post('/create-reply',auth,commentServices.createReply)
commentRouter.get('/comment-with-replies/:id',commentServices.getCommentWithReply)

export default commentRouter