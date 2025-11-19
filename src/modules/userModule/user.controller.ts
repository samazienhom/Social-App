import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { uploadMulterFile } from "../../utils/multer/multer";
import { UserServices } from "./user.services";
const userRouter=Router()

const userServices=new UserServices()
userRouter.patch('/profile-image',auth,uploadMulterFile({}).single('image'),userServices.profileImage)
userRouter.patch('/send-friend-request',auth,userServices.sendFriendRequest)
userRouter.patch('/accept-friend-request/:id',auth,userServices.acceptFriendRequest)
userRouter.patch('/unfriend',auth,userServices.unfriend)
userRouter.patch('/block',auth,userServices.blockUser)
userRouter.delete('/delete-account/:userId',auth,userServices.deleteAccount)
export default userRouter