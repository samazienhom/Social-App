import {Router} from 'express';
import { AuthServices } from './auth.services';
import validation from '../../middleware/validation.middleware';
import { confirmEmailSchema, loginSchema, resendOtpSchema, signupSchema } from './auth.validation';
import { auth } from '../../middleware/auth.middleware';
const authRouter=Router();

const authServices=new AuthServices()
authRouter.post('/signup',validation(signupSchema),authServices.signup)
authRouter.patch('/confirm-email',validation(confirmEmailSchema),authServices.confirmEmail)
authRouter.patch('/resend-otp',validation(resendOtpSchema),authServices.resendOtp)
authRouter.post('/login',validation(loginSchema),authServices.login)
authRouter.get('/get-user-profile',auth,authServices.getUserProfile)
export default authRouter