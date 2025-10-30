import { ApplicationError } from "./error.types";

export class UserNotFoundException extends ApplicationError{
    constructor(msg:string="User Not Found"){
        super(msg,404)
    }
}
export class NotConfirmedException extends ApplicationError{
    constructor(msg:string="User not verified yet"){
        super(msg,404)
    }
}
export class OtpNotFoundException extends ApplicationError{
    constructor(msg:string="Otp Not Found"){
        super(msg,404)
    }
}
export class OtpExpiredException extends ApplicationError{
    constructor(msg:string="Otp Expired"){
        super(msg,404)
    }
}
export class OtpNotValidException extends ApplicationError{
    constructor(msg:string="Otp Not Valid"){
        super(msg,404)
    }
}
export class InvalidCredentialsException extends ApplicationError{
    constructor(msg:string="invalid credentials"){
        super(msg,404)
    }
}
export class InvalidTokenException extends ApplicationError{
    constructor(msg:string="invalid Token"){
        super(msg,404)
    }
}