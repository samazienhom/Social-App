import z, { email } from 'zod';
import { ar } from 'zod/v4/locales';


export const signupSchema=z.object({
    email:z.email(),
    firstName:z.string(),
    lastName:z.string(),
    age:z.number().optional(),
    phone:z.string().optional(),
    password:z.string(),
    confirmPassword:z.string()
}).superRefine((args,ctx)=>{
    if(args.password!==args.confirmPassword){
    
        ctx.addIssue({
            code:"custom" ,
            message:"Password don't match",
            path:["password","confirmPassword"]
        })
    }
    // if(!args.name.startsWith("admin")){
    //     ctx.addIssue({
    //         code:"custom" ,
    //         message:"Name cannot start with admin",
    //         path:["name"]
    //     })
    // }
})
// .refine((args)=>{
//     return args.password==args.confirmPassword
// },{
//     error:"Password don't match",
//     path:["password","confirmPassword"]
// })

export const confirmEmailSchema=z.object({
    email:z.email(),
    otp:z.string().length(6)
})
export const resendOtpSchema=z.object({
    email:z.email()
})
export const loginSchema=z.object({
    email:z.email(),
        password:z.string()
})