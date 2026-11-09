import express from 'express'
import {signUpController,signInController,getMeController,verifyEmailController} from './auth.controller'
import { authMiddleware } from './auth.middleware'
const authrouter = express.Router()

authrouter.post('/signup',signUpController)
authrouter.post('/signin',signInController)
authrouter.get('/me',authMiddleware,getMeController)
authrouter.post('/verify-email',verifyEmailController)

export default authrouter