import { HydratedDocument, model, Schema, Types } from "mongoose";

export interface IMeassage{
    createdBy:Types.ObjectId;
    content:string;
    createdAt:Date;
    updatedAt:Date;
}

const messageSchema=new Schema<IMeassage>({
    createdBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    content:{
        type:String,
        required:true
    },
},{
    timestamps:true
})
export interface IChat{
    //ovo
    participants:Types.ObjectId[];
    messages:IMeassage[];
    

    //ovm
    group?:string;
    groupImage?:string;
    roomId?:string;

    createdBy:Types.ObjectId;
    createdAt:Date;
    updatedAt:Date;
} 

const chatSchema=new Schema<IChat>({
    participants:[{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:true
    }],
    // embed messages as subdocuments
    messages: [messageSchema],
    group:{
        type:String,
        required:false
    },
    groupImage:{
        type:String,
        required:false
    },
    roomId:{
        type:String,
        required:false
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'users',
        required:false
    }
},{
    timestamps:true
})
export type HChatDocument=HydratedDocument<IChat>
export const ChatModel=model<IChat>('chats',chatSchema);
