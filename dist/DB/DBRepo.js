"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBRepo = void 0;
class DBRepo {
    model;
    constructor(model) {
        this.model = model;
    }
    find = async ({ filter = {}, projection = {}, options = {} }) => {
        const docs = await this.model.find(filter, projection, options);
        return docs;
    };
    findOne = async ({ filter = {}, projection = {}, options = {} }) => {
        const doc = await this.model.findOne(filter, projection, options);
        return doc;
    };
    findById = async ({ id, projection = {}, options = {} }) => {
        const doc = await this.model.findById(id, projection, options);
        return doc;
    };
    create = async ({ doc }) => {
        const createdDoc = await this.model.create(doc);
        return createdDoc;
    };
    findOneAndDelete = async ({ id, options = {} }) => {
        const doc = await this.model.findOneAndDelete({ _id: id }, options);
        return doc;
    };
    findOneAndUpdate = async ({ id, update, options = {} }) => {
        const doc = await this.model.findOneAndUpdate({ _id: id }, update, options);
        return doc;
    };
    inserMany = async ({ docs }) => {
        const createdDocs = await this.model.insertMany(docs);
        return createdDocs;
    };
}
exports.DBRepo = DBRepo;
