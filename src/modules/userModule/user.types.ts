import { HydratedDocument, Types } from "mongoose"

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
    twoStepVerification:{
        enabled:boolean,
        otp:string,
        expiredAt:Date
    }
    loginConfirmation:{
        otp:string,
        expiredAt:Date
    }
    friends:[Types.ObjectId]
}

export type HUserDocument=HydratedDocument<IUser>