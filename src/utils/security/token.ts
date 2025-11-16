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

    return jwt.sign(payload,secret,options)
}

export const verifyToken=({
    token,
    secret
}:{
token:string,
secret:string
}):JwtPayload=>{
    const payload=jwt.verify(token,secret) as JwtPayload
    return payload
}