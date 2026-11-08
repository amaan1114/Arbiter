import dotenv from "dotenv";
import { CookieOptions } from 'express';

dotenv.config();
export const config = {
    PORT:process.env.PORT,
    NODE_ENV:process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT || "587",
    SMTP_SECURE: process.env.SMTP_SECURE === "true",
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL,
    //Jwt Secret
    JWT_SECRET:process.env.JWT_SECRET 
}



export const corsOptions = {
    origin: config.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}


export const cookieConfig:CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
}