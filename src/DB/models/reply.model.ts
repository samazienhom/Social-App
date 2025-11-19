import { HydratedDocument, model, Schema, Types } from "mongoose";


export interface IReply{
    createdBy:Types.ObjectId,
    content:string,
    comment:Types.ObjectId,
    createdAt:Date,
    updatedAt:Date
}
const reolySchema=new Schema<IReply>({
    createdBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"users"  
    },
    content:{
        type:String,
        required:true
    },
    comment:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"comments"
    }
},{
    timestamps:true
})
export type HReplyDocumnet=HydratedDocument<IReply>
export const ReplyModel=model<IReply>("reply",reolySchema)