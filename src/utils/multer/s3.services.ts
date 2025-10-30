import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3"
import { StoreInEnum } from "./multer"
import { createReadStream } from 'fs'
import { s3 } from "./s3.cofig"


export const uploadFile = async ({
    storeIn = StoreInEnum.memory,
    bucket = process.env.BUCKET,
    ACL = 'private',
    path = "general",
    file
}: {
    storeIn?: StoreInEnum,
    bucket?: string,
    ACL?: ObjectCannedACL,
    path?: string,
    file: Express.Multer.File
}) => {

    const command = new PutObjectCommand({
        Bucket: bucket,
        ACL,
        Key:`${process.env.APPLICATION_NAME}/${path}/${file.originalname}`,
        Body:
            storeIn == StoreInEnum.memory ? file.buffer : createReadStream(file.path),
        ContentType:file.mimetype
    })
    await s3().send(command)
    return command.input.Key
}