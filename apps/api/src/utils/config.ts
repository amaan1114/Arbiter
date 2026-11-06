import dotenv from "dotenv";
import { CookieOptions } from 'express';

dotenv.config();
export const config = {
    PORT:process.env.PORT,
    NODE_ENV:process.env.NODE_ENV,
    //Jwt Secret
    JWT_SECRET:process.env.JWT_SECRET 
}



export const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}


export const cookieConfig:CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
}