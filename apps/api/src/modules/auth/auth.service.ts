import httpError from "../../utils/httpError";
import bcrypt from "bcryptjs"
import {generateAccessToken,generateRefreshToken} from "../../utils/jwtToken"
import {getUserByEmail,createUser} from "./auth.repo"

export const signInService = async (email: string, password: string) : Promise<{ accessToken: string; refreshToken: string; }> => {
    const user = await getUserByEmail(email)
    if(!user){
        throw new httpError(404,'User not found')
    }
    if(!bcrypt.compareSync(password, user.password)){
        throw new httpError(401,'Invalid password')
    }
    if(user.isVerified === false){
        throw new httpError(403,'User not verified')
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
    const accessToken = generateAccessToken({id:newUser.id,email:newUser.email})
    const refreshToken = generateRefreshToken({id:newUser.id})
    return {accessToken,refreshToken}

}

export const getMeService = (user: any) => {
    return {
        id: user.id,
        email: user.email
    }
}