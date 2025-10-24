"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.resendOtpSchema = exports.confirmEmailSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    email: zod_1.default.email(),
    firstName: zod_1.default.string(),
    lastName: zod_1.default.string(),
    age: zod_1.default.number().optional(),
    phone: zod_1.default.string().optional(),
    password: zod_1.default.string(),
    confirmPassword: zod_1.default.string()
}).superRefine((args, ctx) => {
    if (args.password !== args.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Password don't match",
            path: ["password", "confirmPassword"]
        });
    }
    // if(!args.name.startsWith("admin")){
    //     ctx.addIssue({
    //         code:"custom" ,
    //         message:"Name cannot start with admin",
    //         path:["name"]
    //     })
    // }
});
// .refine((args)=>{
//     return args.password==args.confirmPassword
// },{
//     error:"Password don't match",
//     path:["password","confirmPassword"]
// })
exports.confirmEmailSchema = zod_1.default.object({
    email: zod_1.default.email(),
    otp: zod_1.default.string().length(6)
});
exports.resendOtpSchema = zod_1.default.object({
    email: zod_1.default.email()
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string()
});
