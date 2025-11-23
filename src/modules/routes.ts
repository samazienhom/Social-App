import { Router } from "express";
import authRouter from "./authModule/auth.controller";
import userRouter from "./userModule/user.controller";
import chatRouter from "./chatModule/chat.controller";
import postRouter from "./postModule/post.controller";
import commentRouter from "./commentModule/comment.controller";
const router = Router();
router.use('/auth',authRouter)
router.use('/user',userRouter)
router.use('/chat',chatRouter)
router.use('/post',postRouter)
router.use('/comment',commentRouter)
export default router;