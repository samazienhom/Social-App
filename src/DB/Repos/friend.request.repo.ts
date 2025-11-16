import { Model } from "mongoose";
import { DBRepo } from "../DBRepo";
import { friendRequestModel, IFriendRequest } from "../models/friend.request";

export class FrienddRequestRepo extends DBRepo<IFriendRequest>{
    constructor(protected override readonly model:Model<IFriendRequest>=friendRequestModel){
        super(friendRequestModel)
    }
}