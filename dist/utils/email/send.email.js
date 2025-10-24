"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = ({ to, subject, html }) => {
    const transportOptions = {
        host: (process.env.HOST),
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    };
    const transporter = nodemailer_1.default.createTransport(transportOptions);
    const main = async () => {
        const info = await transporter.sendMail({
            from: `Social App<${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
    };
    main().catch((err) => {
        console.log({ err });
    });
};
exports.sendEmail = sendEmail;
