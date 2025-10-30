import { Router } from "express";
import { auth } from "../../middleware/auth.middleware";
import { uploadMulterFile } from "../../utils/multer/multer";
import { UserServices } from "./user.services";
const userRouter=Router()

const userServices=new UserServices()
userRouter.patch('/profile-image',auth,uploadMulterFile({}).single('image'),userServices.profileImage)
export default userRouter