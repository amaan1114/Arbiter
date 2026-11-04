import type { Response,Request } from "express"
export const httpResponse = (success:boolean,res:Response,req:Request,statusCode:number,message:string,data?:any)=>{
    const response = {
        success,
        message,
        trace:{
            method:req.method,
            reqUrl:req.url,
        },
        statusCode:statusCode,
        data
    }

    console.log("HttpResponse :",response)
    
    res.status(statusCode).json({
        message:message,
        data:data
    })

}