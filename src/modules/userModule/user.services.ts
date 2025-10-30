import { Request, Response } from "express";
import { UserRepo } from "../../DB/Repos/user.repo";
import { uploadFile } from "../../utils/multer/s3.services";
import { HUserDocument } from "./user.types";
import { successHandler } from "../../utils/successHandler";

export class UserServices{
    private userModel=new UserRepo

    profileImage=async(req:Request,res:Response)=>{
        const file=req.file as Express.Multer.File
        const user=res.locals.user as HUserDocument
        const result=await uploadFile({
            file,
            path:`${user._id}/profileImage`
        })
        return successHandler({res,data:result})
    }
}