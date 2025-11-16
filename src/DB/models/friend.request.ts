import { model, Schema, Types } from "mongoose";

export interface IFriendRequest {
    from: Types.ObjectId
    to: Types.ObjectId;   
    acceptedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}


const friendRequestSchema= new Schema<IFriendRequest>({
    from: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    acceptedAt: Date
}, {
    timestamps: true
})


export const friendRequestModel=model<IFriendRequest>('friend_requests',friendRequestSchema);