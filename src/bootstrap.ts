import express, { NextFunction, Request, Response } from "express";
import router from "./modules/routes";
import { IError } from "./utils/errors/error.types";
import { DBconnection } from "./DB/config/connectDb";
import { sendEmail } from "./utils/email/send.email";
import { EMAIL_EVENTS, emailEmitter } from "./utils/email/email.events";
const app = express();
const bootstrap = async () => {
    app.use(express.json());
    app.use('/api/v1',router)
    const port=process.env.PORT || 5000;
    await DBconnection()

    app.use((err:IError,req:Request,res:Response,next:NextFunction)=>{
        console.log({err});
        
        res.status(err.statusCode||500).json({
            message:err.message,
            stack:err.stack,
            status:err.statusCode||500
        })
    })
   // emailEmitter.publish(EMAIL_EVENTS.VERIFY_EMAIL,{to:"xxxsama87@gmail.com",subject:"hi",html:"<h1>hi</h1>"})
    app.listen(port,()=>{
        console.log(`Server is running on port ${port}`);
    })
}
export default bootstrap;