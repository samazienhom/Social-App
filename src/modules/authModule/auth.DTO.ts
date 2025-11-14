// export interface SignupDTO{
//     name:string;
//     email:string;
//     password:string;
// }

import z from "zod";
import { confirmEmailSchema, loginConfirmationSchema, loginSchema, resendOtpSchema, signupSchema, twoStepVerificationSchema } from "./auth.validation";

export type signupDTO=z.infer<typeof signupSchema>;
export type confirmEmailDTO=z.infer<typeof confirmEmailSchema>
export type resendOtpDTO=z.infer<typeof resendOtpSchema>
export type loginDTO=z.infer<typeof loginSchema>
export type twoStepVerificationDTO=z.infer<typeof twoStepVerificationSchema>
export type loginConfirmationDTO=z.infer<typeof loginConfirmationSchema>