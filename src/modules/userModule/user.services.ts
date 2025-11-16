import { Request, Response } from "express";
import { UserRepo } from "../../DB/Repos/user.repo";
import { uploadFile } from "../../utils/multer/s3.services";
import { HUserDocument } from "./user.types";
import { successHandler } from "../../utils/successHandler";
import { th } from "zod/v4/locales";
import { FrienddRequestRepo } from "../../DB/Repos/friend.request.repo";
import { UserNotFoundException } from "../../utils/errors/errors.exceptions";

export class UserServices{
    private userModel=new UserRepo

    profileImage=async(req:Request,res:Response)=>{
        const file=req.file as Express.Multer.File
        const user=res.locals.user as HUserDocument
        const path=await uploadFile({
            file,
            path:`${user._id}/profileImage`
        })
        user.profileImage=path as string
        await user.save( )
        return successHandler({res,data:path})
    }
    private friendRequestModel=new FrienddRequestRepo
    sendFriendRequest=async(req:Request,res:Response)=>{
        const {to}=req.body
        const authUser:HUserDocument=res.locals.user 
        const from=authUser._id
        if(to.toString()==from.toString()){
            throw new Error("You can't send friend request to yourself")
        }
        if(!await this.userModel.findById({
            id:to
        })){
            throw new UserNotFoundException()
        }
        const isFriends= await this.friendRequestModel.findOne({
           filter:{
             $or:[
                {from:from,to:to},
                {from:to,to:from}
            ]
           }
        })
        if(isFriends){
            throw new Error("Friend request already sent or you are already friends")
        }
        const friendRequest=await this.friendRequestModel.create({
            doc:{
                from,
                to
            }
        })
        return successHandler({res,data:friendRequest})
    }

    acceptFriendRequest=async(req:Request,res:Response)=>{
        const authUser:HUserDocument=res.locals.user 
        const {id}=req.params as {id:string}
        const friendRequest=await this.friendRequestModel.findOne({
             filter:{
                _id:id,
                to:authUser._id,
                acceptedAt:{
                    $exists:false
                }
            }
        })
        if(!friendRequest){
            throw new Error("Friend request not found")
        }
        await friendRequest.updateOne({
            acceptedAt:new Date()
        })
       this.userModel.findOneAndUpdate({
            filter:{
                _id:friendRequest.to },
            update:{
                $addToSet:{
                    friends:friendRequest.from 
                }
            }
        })
        this.userModel.findOneAndUpdate({
            filter:{
                _id:friendRequest.from },
            update:{
                $addToSet:{
                    friends:authUser._id 
                }
            }
        })
        return successHandler({res,data:friendRequest})
    }
}
