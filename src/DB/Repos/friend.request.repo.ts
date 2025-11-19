import { Model } from "mongoose";
import { DBRepo } from "../DBRepo";
import { FriendRequestModel, IFriendRequest } from "../models/friend.request";

export class FrienddRequestRepo extends DBRepo<IFriendRequest>{
    constructor(protected override readonly model:Model<IFriendRequest>=FriendRequestModel){
        super(FriendRequestModel)
    }
}