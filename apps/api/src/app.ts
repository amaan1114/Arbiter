import  express  from "express";
import { httpResponse } from "./utils/httpResponse";
import { config, corsOptions } from "./utils/config";
import { globalErrorHandler } from "./middlewares/GlobalErrorHandler";
import problemRouter from "./modules/problems/problem.route";
import authRouter from "./modules/auth/auth.route";
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

app.use('/api/v1/problems', problemRouter)
app.use('/api/v1/auth', authRouter)
export default app