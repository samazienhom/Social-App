"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successHandler = void 0;
const successHandler = ({ res, status = 200, data = {}, message = "success" }) => {
    return res.status(status).json({ message, data });
};
exports.successHandler = successHandler;
