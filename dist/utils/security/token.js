"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = ({ payload = {}, signature, options = {} }) => {
    return jsonwebtoken_1.default.sign(payload, signature, { expiresIn: "1 D" });
};
exports.generateToken = generateToken;
const verifyToken = ({ token, signature }) => {
    const payload = jsonwebtoken_1.default.verify(token, signature);
    return payload;
};
exports.verifyToken = verifyToken;
