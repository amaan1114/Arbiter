import express from 'express'
import {signUpController,signInController,getMeController,verifyEmailController} from './auth.controller'
export const authrouter = express.Router()

authrouter.post('/signup',signUpController)
authrouter.post('/signin',signInController)
authrouter.get('/me',getMeController)
authrouter.post('/verify-email',verifyEmailController)

