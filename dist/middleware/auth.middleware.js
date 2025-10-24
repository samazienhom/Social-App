"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.decodeToken = exports.tokenTypesEnum = void 0;
const errors_exceptions_1 = require("../utils/errors/errors.exceptions");
const token_1 = require("../utils/security/token");
const user_repo_1 = require("../DB/Repos/user.repo");
var tokenTypesEnum;
(function (tokenTypesEnum) {
    tokenTypesEnum["ACCESS"] = "access";
    tokenTypesEnum["REFRESH"] = "refresh";
})(tokenTypesEnum || (exports.tokenTypesEnum = tokenTypesEnum = {}));
const userModel = new user_repo_1.UserRepo();
const decodeToken = async ({ authorization, tokenTypes }) => {
    if (!authorization) {
        throw new errors_exceptions_1.InvalidTokenException();
    }
    if (!authorization.startsWith(process.env.BEARER)) {
        throw new errors_exceptions_1.InvalidTokenException();
    }
    // console.log({authorization:authorization.split(" ")[1]});
    const token = authorization.split(" ")[1];
    const payload = (0, token_1.verifyToken)({
        token,
        signature: tokenTypes == tokenTypesEnum.ACCESS ?
            process.env.ACCESS_SIGNATURE
            : process.env.REFRESH_SIGNATURE
    });
    //console.log({payload});
    const user = await userModel.findById({ id: payload._id });
    if (!user) {
        throw new errors_exceptions_1.InvalidTokenException();
    }
    if (!user.isConfirmed) {
        throw new errors_exceptions_1.InvalidTokenException();
    }
    return user;
};
exports.decodeToken = decodeToken;
const auth = async (req, res, next) => {
    const data = await (0, exports.decodeToken)({
        authorization: req.headers.authorization,
        tokenTypes: tokenTypesEnum.ACCESS
    });
    res.locals.user = data;
    return next();
};
exports.auth = auth;
