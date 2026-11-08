import httpError from "../../utils/httpError";
import bcrypt from "bcryptjs"
import {generateAccessToken,generateRefreshToken,verifyToken} from "../../utils/jwtToken"
import {getUserByEmail,createUser,setUserVerified} from "./auth.repo"
import {sendEmail} from "../../utils/sendEmail"

export const signInService = async (email: string, password: string) : Promise<{ accessToken: string; refreshToken: string; }> => {
    const user = await getUserByEmail(email)
    if(!user){
        throw new httpError(404,'User not found')
    }
    if(!bcrypt.compareSync(password, user.password)){
        throw new httpError(401,'Invalid password')
    }
    if(user.isVerified === false){
        const verificationToken = generateAccessToken({email:user.email})
        await sendEmail(user.email, verificationToken)
        throw new httpError(403,'User not verified a verification email has been sent to your email address')

    }
    const accessToken = generateAccessToken({id:user.id,email:user.email})
    const refreshToken = generateRefreshToken({id:user.id})
    return {accessToken,refreshToken}
}


export const signUpService = async (email: string, password: string) => {
    const user = await getUserByEmail(email)
    if(user){
        throw new httpError(409,'User already exists')
    }
    const hashedPassword = bcrypt.hashSync(password, 10)
    const newUser = await createUser(email, hashedPassword)
    const verificationToken = generateAccessToken({email:newUser.email})
    await sendEmail(newUser.email, verificationToken)
    return {verificationToken}

}

export const getMeService = (user: any) => {
    return {
        id: user.id,
        email: user.email
    }
}

export const verifyEmailService = async(token:string)=>{
    // Implementation for verifying email
    const decoded = verifyToken(token)
    if(typeof decoded === "string" || typeof decoded.email !== "string"){
        throw new httpError(400,'Invalid token')
    }
    await setUserVerified(decoded.email)



}