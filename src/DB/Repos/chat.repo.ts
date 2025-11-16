import { Model } from "mongoose";
import { DBRepo } from "../DBRepo";
import { ChatModel, IChat } from "../models/chat.model";


export class ChatRepo extends DBRepo<IChat>{
    constructor(protected override readonly model:Model<IChat>=ChatModel){
        super(ChatModel)
    }
}