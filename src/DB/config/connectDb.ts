import mongoose from "mongoose";
export const DBconnection=async()=>{
    return await mongoose.connect(process.env.LOCAL_DB_URI as string).then(()=>{
        console.log("DataBase connected successfully");
    }).catch((err)=>{
        console.log("Error while connecting to DataBase",err);
    });
}