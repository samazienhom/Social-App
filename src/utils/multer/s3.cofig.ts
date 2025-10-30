import { S3Client } from "@aws-sdk/client-s3";

export const s3=()=>{
    return new S3Client({
        region:process.env.REGION as string,
        credentials:{
            accessKeyId:process.env.ACCESS_KEY_ID as string,
            secretAccessKey:process.env.SECRET_ACCESS_KEY as string
        }
    })
}