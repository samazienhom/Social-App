"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTokenException = exports.InvalidCredentialsException = exports.OtpNotValidException = exports.OtpExpiredException = exports.OtpNotFoundException = exports.NotConfirmedException = exports.UserNotFoundException = void 0;
const error_types_1 = require("./error.types");
class UserNotFoundException extends error_types_1.ApplicationError {
    constructor(msg = "User Not Found") {
        super(msg, 404);
    }
}
exports.UserNotFoundException = UserNotFoundException;
class NotConfirmedException extends error_types_1.ApplicationError {
    constructor(msg = "User not verified yet") {
        super(msg, 404);
    }
}
exports.NotConfirmedException = NotConfirmedException;
class OtpNotFoundException extends error_types_1.ApplicationError {
    constructor(msg = "Otp Not Found") {
        super(msg, 404);
    }
}
exports.OtpNotFoundException = OtpNotFoundException;
class OtpExpiredException extends error_types_1.ApplicationError {
    constructor(msg = "Otp Expired") {
        super(msg, 404);
    }
}
exports.OtpExpiredException = OtpExpiredException;
class OtpNotValidException extends error_types_1.ApplicationError {
    constructor(msg = "Otp Not Valid") {
        super(msg, 404);
    }
}
exports.OtpNotValidException = OtpNotValidException;
class InvalidCredentialsException extends error_types_1.ApplicationError {
    constructor(msg = "invalid credentials") {
        super(msg, 404);
    }
}
exports.InvalidCredentialsException = InvalidCredentialsException;
class InvalidTokenException extends error_types_1.ApplicationError {
    constructor(msg = "invalid Token") {
        super(msg, 404);
    }
}
exports.InvalidTokenException = InvalidTokenException;
