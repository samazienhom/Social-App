import { Model } from "mongoose";
import { DBRepo } from "../DBRepo";
import { IReply, ReplyModel } from "../models/reply.model";



export class ReplyRepo extends DBRepo<IReply>{
    constructor(protected override readonly model:Model<IReply>=ReplyModel){
        super(ReplyModel)
    }
}