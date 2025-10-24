import bcrypt from 'bcrypt';

export const hash=async(plainText:string):Promise<string>=>bcrypt.hash(plainText,10)

export const compare=async(plainText:string,hash:string):Promise<boolean>=>bcrypt.compare(plainText,hash)