
import { model, models, Schema } from "mongoose";
import { IUser } from "../../modules/userModule/user.types";

const userSchema=new Schema<IUser>({
    firstName:{
        type:String,
        required:true
    },


    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
     },
     age:{
           type:Number
     },
     phone:{  
         type:String
     },
     profileImage:{
        type:String
     },
     covserImages:{
        type:[String]
     },
     folderId:String,
     isConfirmed:{
        type:Boolean,
        default:false
     },
     changedCredentialsAt:Date,
     emailOtp:{
        otp:String,
        expiredAt:Date
     }

},{
    timestamps:true
})

export const UserModel=models.users || model<IUser>('users',userSchema)