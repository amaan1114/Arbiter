import jwt from "jsonwebtoken";
import { config } from "./config";



export const generateAccessToken = (payload: any) => {
    const token = jwt.sign(payload, config.JWT_SECRET as string, {
        expiresIn:'15m'
    })
    return token
}

export const generateRefreshToken = (payload: any) => {
    const token = jwt.sign(payload, config.JWT_SECRET as string, {
        expiresIn:'7d'
    })
    return token
}   


export const verifyToken = (token:string)=>{
    try{
        const decoded = jwt.verify(token, config.JWT_SECRET as string)
        return decoded
    }
    catch(error){
        throw new Error('Invalid token')
    }
}

