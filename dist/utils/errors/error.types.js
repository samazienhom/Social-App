"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationError = void 0;
class ApplicationError extends Error {
    statusCode;
    constructor(message, statusCode, opt) {
        super(message, opt);
        this.statusCode = statusCode;
    }
}
exports.ApplicationError = ApplicationError;
