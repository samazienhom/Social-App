"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBconnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const DBconnection = async () => {
    return await mongoose_1.default.connect(process.env.LOCAL_DB_URI).then(() => {
        console.log("DataBase connected successfully");
    }).catch((err) => {
        console.log("Error while connecting to DataBase", err);
    });
};
exports.DBconnection = DBconnection;
