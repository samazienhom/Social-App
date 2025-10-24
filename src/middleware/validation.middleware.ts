import { NextFunction, Request, Response } from "express"
import { ZodObject } from "zod"


const validation=(schema:ZodObject)=>{
return async(req:Request,res:Response,next:NextFunction)=>{
    const data={
        ...req.body,
        ...req.params,
        ...req.query
    }
    const validationResult=await schema.safeParseAsync(data)
    if(!validationResult.success){
        return res.status(422).json({
            message:"Validation Error",
            errors:JSON.parse(validationResult.error as unknown as string)
        })
    }
    next()
}
}

export default validation