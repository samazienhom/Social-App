import { Model } from "mongoose";
import { DBRepo } from "../DBRepo";
import { IPost, PostModel } from "../models/post.model";



export class PostRepo extends DBRepo<IPost>{
    constructor(protected override readonly model:Model<IPost>=PostModel){
        super(PostModel)
    }
}