"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const user_repo_1 = require("../../DB/Repos/user.repo");
const s3_services_1 = require("../../utils/multer/s3.services");
const successHandler_1 = require("../../utils/successHandler");
class UserServices {
    userModel = new user_repo_1.UserRepo;
    profileImage = async (req, res) => {
        const file = req.file;
        const user = res.locals.user;
        const path = await (0, s3_services_1.uploadFile)({
            file,
            path: `${user._id}/profileImage`
        });
        user.profileImage = path;
        await user.save();
        return (0, successHandler_1.successHandler)({ res, data: path });
    };
}
exports.UserServices = UserServices;
