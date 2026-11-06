import { Request, Response ,NextFunction} from "express";
import {httpResponse} from "../../utils/httpResponse";
import {signUpService,signInService,getMeService} from "./auth.service"
import { cookieConfig } from "../../utils/config";


export const signUpController = async (req: Request, res: Response,next:NextFunction )=>{
    try{
        const {email,password} = req.body
        const { accessToken, refreshToken } = await signInService(email, password);
        res.cookie('refreshToken', refreshToken, cookieConfig);
        res.cookie('accessToken', accessToken, cookieConfig);
        return httpResponse(true,res,req,201,"User Created Successfully")
    }catch(error){
        next(error)
    }

}

export const signInController = async (req: Request, res: Response, next:NextFunction)=>{
    try{
        const {email,password} = req.body
        const {accessToken,refreshToken} = await signInService(email,password)
        res.cookie('refreshToken', refreshToken, cookieConfig)
        res.cookie('accessToken', accessToken, cookieConfig)
        return httpResponse(true,res,req,200,"User Signed In Successfully")
    }catch(error){
        next(error)
    }
}

export const getMeController = async (req: Request, res: Response, next:NextFunction)=>{
    try{
        const user = await getMeService(req.user)
        return httpResponse(true,res,req,200,"User Data Retrieved Successfully",user)
    }catch(error){
        next(error)
    }
}