import { Model } from "mongoose";
import { DBRepo } from "../DBRepo";
import { CommentsModel, IComment } from "../models/comment.model";



export class CommentRepo extends DBRepo<IComment>{
    constructor(protected override readonly model:Model<IComment>=CommentsModel){
        super(CommentsModel)
    }
}