import { CreateOptions, Model, ProjectionType, QueryOptions, RootFilterQuery, Types } from "mongoose";
import { IUser } from "../modules/userModule/user.types";
import { UserModel } from "./models/user.model";


export abstract class DBRepo <T>{
    constructor(protected readonly model: Model<T>) { }
    find = async ({
        filter = {},
        projection = {},
        options = {}
    }: {
        filter?: RootFilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions
    }) => {
        const docs = await this.model.find(filter, projection, options)
        return docs
    }
     findOne = async ({
        filter = {},
        projection = {},
        options = {}
    }: {
        filter?: RootFilterQuery<T>,
        projection?: ProjectionType<T>,
        options?: QueryOptions
    }) => {
        const doc = await this.model.findOne(filter, projection, options)
        return doc
    }
     findById = async ({
        id ,
        projection = {},
        options = {}
    }: {
        id?:Types.ObjectId|string,
        projection?: ProjectionType<T>,
        options?: QueryOptions
    }) => {
        const doc = await this.model.findById(id, projection, options)
        return doc
    }
    create=async({doc}:{
        doc:Partial<T>
    })=>{
        const createdDoc=await this.model.create(doc)
        return createdDoc
    }
}