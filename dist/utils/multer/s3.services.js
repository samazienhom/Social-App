"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const multer_1 = require("./multer");
const fs_1 = require("fs");
const s3_cofig_1 = require("./s3.cofig");
const uploadFile = async ({ storeIn = multer_1.StoreInEnum.memory, bucket = process.env.BUCKET, ACL = 'private', path = "general", file }) => {
    const command = new client_s3_1.PutObjectCommand({
        Bucket: bucket,
        ACL,
        Key: `${process.env.APPLICATION_NAME}/${path}/${file.originalname}`,
        Body: storeIn == multer_1.StoreInEnum.memory ? file.buffer : (0, fs_1.createReadStream)(file.path),
        ContentType: file.mimetype
    });
    await (0, s3_cofig_1.s3)().send(command);
    return command.input.Key;
};
exports.uploadFile = uploadFile;
