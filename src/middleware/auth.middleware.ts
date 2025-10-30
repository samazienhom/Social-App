import { JwtPayload } from "jsonwebtoken"
import { InvalidTokenException, UserNotFoundException } from "../utils/errors/errors.exceptions"
import { verifyToken } from "../utils/security/token"
import { UserModel } from "../DB/models/user.model"
import { UserRepo } from "../DB/Repos/user.repo"
import { NextFunction, Request, Response } from "express"
import { IUser } from "../modules/userModule/user.types"

export enum tokenTypesEnum {
    ACCESS = "access",
    REFRESH = "refresh"
}
const userModel=new UserRepo()
export const decodeToken = async ({
    authorization,
    tokenTypes
}: {
    authorization: string,
    tokenTypes?: tokenTypesEnum
}) => {
    if (!authorization) {
        throw new InvalidTokenException()
    }
    if (!authorization.startsWith(process.env.BEARER as string)) {
        throw new InvalidTokenException()
    }
   // console.log({authorization:authorization.split(" ")[1]});
    
    const token:string = authorization.split(" ")[1] as string
    const payload: JwtPayload = verifyToken({
        token,
        signature: tokenTypes == tokenTypesEnum.ACCESS ?
            process.env.ACCESS_SIGNATURE as string
            : process.env.REFRESH_SIGNATURE as string
    })
    //console.log({payload});
    const user=await userModel.findById({id:payload._id})   
    if(!user){
        throw new InvalidTokenException()
    }
    if(!user.isConfirmed){
        throw new InvalidTokenException()
    }
    return user
}
export const auth=async(req:Request,res:Response,next:NextFunction)=>{
  const data=await decodeToken({
            authorization:req.headers.authorization as string,
            tokenTypes:tokenTypesEnum.ACCESS
        })
    res.locals.user=data
        return next()
}