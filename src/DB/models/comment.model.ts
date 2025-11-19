import { HydratedDocument, model, Schema, Types } from "mongoose";


export interface IComment{
    createdBy:Types.ObjectId
    content:string
    post:Types.ObjectId
    reply:Types.ObjectId[]
    createdAt:Date
    updatedAt:Date
    deletedAt:Date
    isFrozen:boolean
}

const commentSchema=new Schema<IComment>({
    createdBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },
    content:{
        type:String,
        required:true
    },
    post:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"posts"   
    },
    reply:{
        type:[Schema.Types.ObjectId],
        ref:"reply"
    },
    deletedAt:{
        type:Date
    },
    isFrozen:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
export type HCommentsDocument=HydratedDocument<IComment>
export const CommentsModel=model<IComment>("comments",commentSchema)