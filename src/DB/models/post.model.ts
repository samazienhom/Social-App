import { HydratedDocument, model, Schema, Types } from "mongoose";



export interface IPost{
    createdBy:Types.ObjectId,
    content:string,
    image:string,
    likesCount:number,
    likedBy:Types.ObjectId[]
    comments:Types.ObjectId[],
    shareCount:number
    createdAt:Date,
    updatedAt:Date,
    isFrozen:Boolean
}
const postSchema=new Schema<IPost>({
    createdBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"users"
    },
    content:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:false
    },
    comments:{
        type:[Schema.Types.ObjectId],
        ref:"comments"
    },
    likesCount:{
        type:Number,
        default:0
    },
    likedBy:{
        type:[Schema.Types.ObjectId],
        ref:"users"
    },
    shareCount:{
        type:Number,
        default:0
    },
    isFrozen:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
export type HPostDocument=HydratedDocument<IPost>
export const PostModel=model<IPost>("posts",postSchema)
