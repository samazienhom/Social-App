import jwt, { JwtPayload } from 'jsonwebtoken'
export const generateToken=({
    payload={},
    secret,
    options={}
    
}:{
    payload:any,
    secret:string,
    options?:jwt.SignOptions
})=>{
    console.log("SECRET USED ON SIGN:", secret);
    return jwt.sign(payload,secret,options)
}

export const verifyToken=({
    token,
    secret
}:{
token:string,
secret:string
}):JwtPayload=>{
    console.log("SECRET USED ON VERIFY:", secret);
    const payload=jwt.verify(token,secret) as JwtPayload
    return payload
}