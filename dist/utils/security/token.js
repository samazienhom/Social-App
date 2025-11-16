"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = ({ payload = {}, secret, options = {} }) => {
    console.log("SECRET USED ON SIGN:", secret);
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
exports.generateToken = generateToken;
const verifyToken = ({ token, secret }) => {
    console.log("SECRET USED ON VERIFY:", secret);
    const payload = jsonwebtoken_1.default.verify(token, secret);
    return payload;
};
exports.verifyToken = verifyToken;
