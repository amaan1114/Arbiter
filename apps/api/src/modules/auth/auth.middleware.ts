import { Request, Response, NextFunction } from 'express';
import {verifyToken} from '../../utils/jwtToken'
import HttpError from '../../utils/httpError'

export const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    try{
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            return new HttpError(401,'Access token not found')
        }
        const decoded = verifyToken(accessToken)
        req.user = decoded;
        next()
    }catch(error){
        next(error)
    }
}