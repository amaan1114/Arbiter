import  express  from "express";
import { httpResponse } from "./utils/httpResponse";
import { config, corsOptions } from "./utils/config";
import { globalErrorHandler } from "./middlewares/GlobalErrorHandler";
import helmet from "helmet";
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(helmet())

app.get('/health',(req,res)=>{
    return httpResponse(true,res,req,200,"Server is Health")
})



app.use(globalErrorHandler)

export default app