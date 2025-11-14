import {Router} from 'express';
import { AuthServices } from './auth.services';
import validation from '../../middleware/validation.middleware';
import { confirmEmailSchema, loginConfirmationSchema, loginSchema, resendOtpSchema, signupSchema, twoStepVerificationSchema } from './auth.validation';
import { auth } from '../../middleware/auth.middleware';
import { StoreInEnum, uploadMulterFile } from '../../utils/multer/multer';
const authRouter=Router();

const authServices=new AuthServices()
authRouter.post('/signup',validation(signupSchema),authServices.signup)
authRouter.patch('/confirm-email',validation(confirmEmailSchema),authServices.confirmEmail)
authRouter.patch('/resend-otp',validation(resendOtpSchema),authServices.resendOtp)
authRouter.post('/login',validation(loginSchema),authServices.login)
authRouter.post('/refresh-token',authServices.refreshToken)
authRouter.get('/get-user-profile',uploadMulterFile({storeIn:StoreInEnum.disk}).single('image'),auth,authServices.getUserProfile)
authRouter.patch('/forget-pass',authServices.forgetPass)
authRouter.patch('/reset-pass',authServices.resetPass)
authRouter.patch('/two-step-verification',auth,authServices.twoStepVerification)
authRouter.patch('/confirm-two-step-verification',validation(twoStepVerificationSchema),authServices.verifyTwoStepVerification)
authRouter.patch('/confirm-login',validation(loginConfirmationSchema),authServices.loginConfirmation)



export default authRouter
