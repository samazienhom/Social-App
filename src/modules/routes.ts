import { Router } from "express";
import authRouter from "./authModule/auth.controller";
import userRouter from "./userModule/user.controller";
const router = Router();
router.use('/auth',authRouter)
router.use('/user',userRouter)
export default router;