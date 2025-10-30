"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = exports.StoreInEnum = void 0;
const multer_1 = __importDefault(require("multer"));
var StoreInEnum;
(function (StoreInEnum) {
    StoreInEnum["memory"] = "memory";
    StoreInEnum["disk"] = "disk";
})(StoreInEnum || (exports.StoreInEnum = StoreInEnum = {}));
const uploadFile = ({ storeIn = StoreInEnum.memory }) => {
    const storage = storeIn == StoreInEnum.memory ? multer_1.default.memoryStorage() : multer_1.default.diskStorage({});
    return (0, multer_1.default)({ storage });
};
exports.uploadFile = uploadFile;
