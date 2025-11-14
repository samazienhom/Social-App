import { Request, Response, NextFunction } from 'express';
import { confirmEmailDTO, loginConfirmationDTO, loginDTO, resendOtpDTO, signupDTO, twoStepVerificationDTO } from './auth.DTO';
import { UserRepo } from '../../DB/Repos/user.repo';
import { ApplicationError } from '../../utils/errors/error.types';
import { compare, hash } from '../../utils/security/hash';
import { successHandler } from '../../utils/successHandler';
import { otp_tamplate } from '../../utils/email/otp.tamplate';
import { createOtp } from '../../utils/email/createOtp';
import { EMAIL_EVENTS, emailEmitter, EmailEvents } from '../../utils/email/email.events';
import { InvalidCredentialsException, NotConfirmedException, OtpExpiredException, OtpNotFoundException, OtpNotValidException, UserNotFoundException } from '../../utils/errors/errors.exceptions';
import { generateToken } from '../../utils/security/token';
import { HUserDocument, IUser } from '../userModule/user.types';
import { decodeToken, tokenTypesEnum } from '../../middleware/auth.middleware';
import { en, th } from 'zod/v4/locales';
import { string } from 'zod';

export class AuthServices {
    private userModel = new UserRepo
    signup = async (req: Request, res: Response): Promise<Response> => {
        const {
            email,
            firstName,
            lastName,
            age,
            phone,
            password
        }: signupDTO = req.body
        const isEmailExist = await this.userModel.findByEmail({ email })
        if (isEmailExist) {
            throw new ApplicationError("email already exist", 400)
        }
        const otp = createOtp()
        const user = await this.userModel.create({
            doc: {
                email,
                firstName,
                lastName,
                age: age as number,
                phone: phone as string,
                password: await hash(password),
                emailOtp: {
                    otp: await hash(otp),
                    expiredAt: new Date(Date.now() + 30 * 1000)
                }
            }
        })
        const html = otp_tamplate({
            otp: otp,
            name: `${user.firstName} ${user.lastName}`,
            subject: "verify email"
        })
        emailEmitter.publish(EMAIL_EVENTS.VERIFY_EMAIL, {
            to: email,
            subject: "verify email",
            html
        })
        return successHandler({ res, data: user })

    }
    confirmEmail = async (req: Request, res: Response): Promise<Response> => {
        const {
            email,
            otp
        }: confirmEmailDTO = req.body
        const user = await this.userModel.findByEmail({ email })
        if (!user) {
            throw new UserNotFoundException()
        }
        if (user.isConfirmed) {
            throw new ApplicationError("email already verified", 400)
        }
        if (!user.emailOtp.otp) {
            throw new OtpNotFoundException()
        }
        const isExpired = user.emailOtp.expiredAt < new Date(Date.now())
        if (isExpired) {
            throw new OtpExpiredException()
        }
        const isValidOtp = await compare(otp, user.emailOtp.otp)
        if (!isValidOtp) {
            throw new OtpNotValidException
        }
        await user.updateOne({
            $unset: {
                emailOtp: ""
            },
            isConfirmed: true
        })
        return successHandler({ res })
    }
    resendOtp = async (req: Request, res: Response): Promise<Response> => {
        const { email }: resendOtpDTO = req.body
        const user = await this.userModel.findByEmail({ email })
        if (!user) {
            throw new UserNotFoundException()
        }
        if (user.isConfirmed) {
            throw new ApplicationError("email already verified", 400)
        }
        const isExpired = user.emailOtp.expiredAt < new Date(Date.now())
        if (!isExpired) {
            throw new ApplicationError("use the last otp", 400)
        }
        const otp = createOtp()
        const html = otp_tamplate({
            otp: otp,
            name: `${user.firstName} ${user.lastName}`,
            subject: "verify email"
        })
        emailEmitter.publish(EMAIL_EVENTS.VERIFY_EMAIL, {
            to: email,
            subject: "verify email",
            html
        })
        await user.updateOne({
            $set: {
                emailOtp: {
                    otp: await hash(otp),
                    expiredAt: new Date(Date.now() + 30 * 1000)
                }
            }
        })

        return successHandler({ res })
    }

    login = async (req: Request, res: Response): Promise<Response> => {
        const {
            email,
            password
        }: loginDTO = req.body
        const user = await this.userModel.findByEmail({ email })
    
        if (!user) {
            console.log("1");
            
            throw new InvalidCredentialsException()
        }
        const isValidPasswprd = compare(password, user.password)
        
        if (!isValidPasswprd) {
            throw new InvalidCredentialsException()
        }
        if(user.twoStepVerification){
            if(user.twoStepVerification.enabled){
                const otp=createOtp()
                const html=otp_tamplate({
                otp:otp,
                name:`${user.firstName} ${user.lastName}`,
                subject:"2 step login"
            })
            emailEmitter.publish(EMAIL_EVENTS.TWO_STEP_VERIFICATION,{
                to:email,
                subject:"2 step login",
                html
            })
            await user.updateOne({
                loginConfirmation:{
                    otp:await hash(otp),
                    expiredAt:new Date(Date.now()+30*1000)
                }
            })
            return successHandler({res})
            }
           
        }
       
        
        const accessToken = generateToken({
            payload: {
                _id: user._id
            },
            signature: process.env.ACCESS_SIGNATURE as string,
            options: {
                expiresIn: "1 H"
            }
        })
        const refreshToken = generateToken({
            payload: {
                _id: user._id
            },
            signature: process.env.REFRESH_SIGNATURE as string,
            options: {
                expiresIn: "7D"
            }
        })
        return successHandler({
            res, data: {
                accessToken,
                refreshToken
            }
        })
    }

    loginConfirmation=async(req:Request,res:Response){
        const {email,otp}=req.body
        const user =await this.userModel.findByEmail({email})
        if(!user){
            throw new UserNotFoundException()
        }
        if(!user.loginConfirmation){
            throw new OtpNotFoundException()
        }
        if(user.loginConfirmation.expiredAt < new Date(Date.now())){
            throw new OtpExpiredException()
        }
        if(!await compare(otp,user.loginConfirmation.otp)){
            throw new OtpNotValidException()
        }
        const accessToken=generateToken({
            payload:{
                _id:user._id
            },
            signature:process.env.ACCESS_SIGNATURE as string,
            options:{
                expiresIn:"1 H"
            }
        })
        const refreshToken=generateToken({
            payload:{
                _id:user._id
            },
            signature:process.env.REFRESH_SIGNATURE as string,
            options:{
                expiresIn:"7 D"
            }
        })
        return successHandler({res,data:{
            accessToken,
            refreshToken
        }})
    }

    refreshToken = async (req: Request, res: Response): Promise<Response> => {
        const {
            authorization
        } = req.headers
        const user = await decodeToken({ authorization: authorization as string, tokenTypes: tokenTypesEnum.REFRESH })
        const accessToken = generateToken({
            payload: {
                _id: user._id
            },
            signature: process.env.ACCESS_SIGNATURE as string,
            options: {
                expiresIn: "1 H"
            }
        })
        return successHandler({ res, data: { accessToken } })
    }

    getUserProfile = async (req: Request, res: Response) => {
        const user: HUserDocument = res.locals.user
        // user.firstName=user.firstName+" updated"

        console.log({file:req.file});
        
        await user.save()
        return successHandler({ res, data: user })
    }

    forgetPass = async (req: Request, res: Response) => {
        const { email } = req.body
        const user = await this.userModel.findByEmail({ email })
        if (!user) {
            throw new UserNotFoundException("email not found")
        }
        if (!user.isConfirmed) {
            throw new NotConfirmedException
        }
        const otp = createOtp()
        const subject = "Forget paasword"
        const html = otp_tamplate({
            otp: otp,
            name: `${user.firstName} ${user.lastName}`,
            subject: subject
        })
        emailEmitter.publish(EMAIL_EVENTS.RESET_PASSWORD, {
            to: email,
            subject,
            html
        })
        await user.updateOne({
            passOtp: {
                otp: await hash(otp),
                expiredAt: new Date(Date.now() + 30 * 1000)
            }
        })
    }
    resetPass = async (req: Request, res: Response) => {
        const { email, otp, password } = req.body
        const user = await this.userModel.findByEmail({ email })
        if (!user) {
            throw new UserNotFoundException("email not found")
        }
        if (!user.isConfirmed) {
            throw new NotConfirmedException
        }
        const isExpired = user.passOtp.expiredAt < new Date(Date.now())
        if (isExpired) {
            throw new OtpExpiredException()
        }
        const isValidOtp = await compare(otp, user.passOtp.otp)
        if (!isValidOtp) {
            throw new OtpNotValidException
        }
        if (!user.passOtp) {
            throw new ApplicationError("use forget password first", 404)
        }
        await user.updateOne({
            $unset: {
                passOtp: ""
            },
            password: await hash(password)
        })
        successHandler({ res })
    }
    twoStepVerification = async (req: Request, res: Response) => {
        const otp=createOtp()
        const user :HUserDocument=res.locals.user
        const html= otp_tamplate({
            otp: otp,
            name: user.firstName+" "+user.lastName,
            subject:"Two step verification code"
        })
        emailEmitter.publish(EMAIL_EVENTS.TWO_STEP_VERIFICATION,{
            to:user.email,
            subject:"Two step verification code",
            html
        })
        await user.updateOne({
            twoStepVerification:{
                enabled:false,
                otp:await hash(otp),
                expiredAt:new Date(Date.now()+5*60*1000)
            }
        })

        return successHandler({res})
    }
    verifyTwoStepVerification = async (req: Request, res: Response) => {
        
        const {email,code}=req.body
        const user =await this.userModel.findByEmail({email})
        if(!user){
            throw new UserNotFoundException()
        }
        if(!user.twoStepVerification.otp){
            throw new OtpNotFoundException()
        }
        if(user.twoStepVerification.expiredAt<new Date(Date.now())){
            throw new OtpExpiredException()
        }
        if(!(await compare(code,user.twoStepVerification.otp))){
            throw new OtpNotValidException()
        }
        await user.updateOne({
            $set:{
                "twoStepVerification.enabled":true
            },
            $unset:{
                "twoStepVerification.otp":"",
                "twoStepVerification.expiredAt":""
            }
        })
        return successHandler({res})
    }
}