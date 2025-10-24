import { IUser } from "../../modules/userModule/user.types";
import { DBRepo } from "../DBRepo";
import { UserModel } from "../models/user.model";
import { Model, ProjectionType, QueryOptions } from "mongoose";

export class UserRepo extends DBRepo<IUser>{
    constructor(protected override readonly model:Model<IUser>=UserModel){
        super(UserModel)
    }
     findByEmail = async ({
        email,
        projection = {},
        options = {}
    }: {
        email?:string,
        projection?: ProjectionType<IUser>,
        options?: QueryOptions
    }) => {
        const doc = await this.model.findOne({email}, projection, options)
        return doc
    }
}