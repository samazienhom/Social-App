"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_services_1 = require("./auth.services");
const validation_middleware_1 = __importDefault(require("../../middleware/validation.middleware"));
const auth_validation_1 = require("./auth.validation");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const authRouter = (0, express_1.Router)();
const authServices = new auth_services_1.AuthServices();
authRouter.post('/signup', (0, validation_middleware_1.default)(auth_validation_1.signupSchema), authServices.signup);
authRouter.patch('/confirm-email', (0, validation_middleware_1.default)(auth_validation_1.confirmEmailSchema), authServices.confirmEmail);
authRouter.patch('/resend-otp', (0, validation_middleware_1.default)(auth_validation_1.resendOtpSchema), authServices.resendOtp);
authRouter.post('/login', (0, validation_middleware_1.default)(auth_validation_1.loginSchema), authServices.login);
authRouter.get('/get-user-profile', auth_middleware_1.auth, authServices.getUserProfile);
exports.default = authRouter;
