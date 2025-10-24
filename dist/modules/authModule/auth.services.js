"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const user_repo_1 = require("../../DB/Repos/user.repo");
const error_types_1 = require("../../utils/errors/error.types");
const hash_1 = require("../../utils/security/hash");
const successHandler_1 = require("../../utils/successHandler");
const otp_tamplate_1 = require("../../utils/email/otp.tamplate");
const createOtp_1 = require("../../utils/email/createOtp");
const email_events_1 = require("../../utils/email/email.events");
const errors_exceptions_1 = require("../../utils/errors/errors.exceptions");
const token_1 = require("../../utils/security/token");
class AuthServices {
    userModel = new user_repo_1.UserRepo;
    signup = async (req, res) => {
        const { email, firstName, lastName, age, phone, password } = req.body;
        const isEmailExist = await this.userModel.findByEmail({ email });
        if (isEmailExist) {
            throw new error_types_1.ApplicationError("email already exist", 400);
        }
        const otp = (0, createOtp_1.createOtp)();
        const user = await this.userModel.create({
            doc: {
                email,
                firstName,
                lastName,
                age: age,
                phone: phone,
                password: await (0, hash_1.hash)(password),
                emailOtp: {
                    otp: await (0, hash_1.hash)(otp),
                    expiredAt: new Date(Date.now() + 30 * 1000)
                }
            }
        });
        const html = (0, otp_tamplate_1.otp_tamplate)({
            otp: otp,
            name: `${user.firstName} ${user.lastName}`,
            subject: "verify email"
        });
        email_events_1.emailEmitter.publish(email_events_1.EMAIL_EVENTS.VERIFY_EMAIL, {
            to: email,
            subject: "verify email",
            html
        });
        return (0, successHandler_1.successHandler)({ res, data: user });
    };
    confirmEmail = async (req, res) => {
        const { email, otp } = req.body;
        const user = await this.userModel.findByEmail({ email });
        if (!user) {
            throw new errors_exceptions_1.UserNotFoundException();
        }
        if (user.isConfirmed) {
            throw new error_types_1.ApplicationError("email already verified", 400);
        }
        if (!user.emailOtp.otp) {
            throw new errors_exceptions_1.OtpNotFoundException();
        }
        const isExpired = user.emailOtp.expiredAt < new Date(Date.now());
        if (isExpired) {
            throw new errors_exceptions_1.OtpExpiredException();
        }
        const isValidOtp = await (0, hash_1.compare)(otp, user.emailOtp.otp);
        if (!isValidOtp) {
            throw new errors_exceptions_1.OtpNotValidException;
        }
        await user.updateOne({
            $unset: {
                emailOtp: ""
            },
            isConfirmed: true
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    resendOtp = async (req, res) => {
        const { email } = req.body;
        const user = await this.userModel.findByEmail({ email });
        if (!user) {
            throw new errors_exceptions_1.UserNotFoundException();
        }
        if (user.isConfirmed) {
            throw new error_types_1.ApplicationError("email already verified", 400);
        }
        const isExpired = user.emailOtp.expiredAt < new Date(Date.now());
        if (!isExpired) {
            throw new error_types_1.ApplicationError("use the last otp", 400);
        }
        const otp = (0, createOtp_1.createOtp)();
        const html = (0, otp_tamplate_1.otp_tamplate)({
            otp: otp,
            name: `${user.firstName} ${user.lastName}`,
            subject: "verify email"
        });
        email_events_1.emailEmitter.publish(email_events_1.EMAIL_EVENTS.VERIFY_EMAIL, {
            to: email,
            subject: "verify email",
            html
        });
        await user.updateOne({
            $set: {
                emailOtp: {
                    otp: await (0, hash_1.hash)(otp),
                    expiredAt: new Date(Date.now() + 30 * 1000)
                }
            }
        });
        return (0, successHandler_1.successHandler)({ res });
    };
    login = async (req, res) => {
        const { email, password } = req.body;
        const user = await this.userModel.findByEmail({ email });
        if (!user) {
            throw new errors_exceptions_1.InvalidCredentialsException();
        }
        const isValidPasswprd = await (0, hash_1.compare)(password, user.password);
        if (!isValidPasswprd) {
            throw new errors_exceptions_1.InvalidCredentialsException();
        }
        const accessToken = (0, token_1.generateToken)({
            payload: {
                _id: user._id
            },
            signature: process.env.ACCESS_SIGNATURE,
            options: {
                expiresIn: "1 H"
            }
        });
        const refreshToken = (0, token_1.generateToken)({
            payload: {
                _id: user._id
            },
            signature: process.env.REFRESH_SIGNATURE,
            options: {
                expiresIn: "7 D"
            }
        });
        return (0, successHandler_1.successHandler)({ res, data: {
                accessToken,
                refreshToken
            } });
    };
    getUserProfile = async (req, res) => {
        const user = res.locals.user;
        user.firstName = user.firstName + " updated";
        await user.save();
        return (0, successHandler_1.successHandler)({ res, data: user });
    };
}
exports.AuthServices = AuthServices;
