import { Request, Response, NextFunction } from 'express';
import { confirmEmailDTO, loginDTO, resendOtpDTO, signupDTO } from './auth.DTO';
import { UserRepo } from '../../DB/Repos/user.repo';
import { ApplicationError } from '../../utils/errors/error.types';
import { compare, hash } from '../../utils/security/hash';
import { successHandler } from '../../utils/successHandler';
import { otp_tamplate } from '../../utils/email/otp.tamplate';
import { createOtp } from '../../utils/email/createOtp';
import { EMAIL_EVENTS, emailEmitter, EmailEvents } from '../../utils/email/email.events';
import { InvalidCredentialsException, OtpExpiredException, OtpNotFoundException, OtpNotValidException, UserNotFoundException } from '../../utils/errors/errors.exceptions';
import { generateToken } from '../../utils/security/token';
import { HUserDocument, IUser } from '../userModule/user.types';

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

    login=async (req: Request, res: Response): Promise<Response> =>{
        const {
            email,
            password
        }:loginDTO=req.body
      const user=  await this.userModel.findByEmail({email})
      if(!user){
        throw new InvalidCredentialsException()
      }
      const isValidPasswprd=await compare(password,user.password)
      if(!isValidPasswprd){
        throw new InvalidCredentialsException()
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

    getUserProfile=async (req: Request, res: Response)=>{
        const user:HUserDocument=res.locals.user
        user.firstName=user.firstName+" updated"
        await user.save()
        return successHandler({res,data:user})
    }

}
