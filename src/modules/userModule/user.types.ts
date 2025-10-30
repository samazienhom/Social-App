import { HydratedDocument } from "mongoose"

export interface IUser {
    firstName:string
    lastName:string
    email: string
    password: string
    age:number
    phone:string
    profileImage:string
    covserImages:string[]
    folderId:string
    isConfirmed:boolean
    changedCredentialsAt:Date
    emailOtp:{
        otp:string,
        expiredAt:Date
    }
     passOtp:{
        otp:string,
        expiredAt:Date
    }
}

export type HUserDocument=HydratedDocument<IUser>