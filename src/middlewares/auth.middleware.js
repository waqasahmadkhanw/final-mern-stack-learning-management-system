import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

    const authUser=async(req,_,next)=>{
    try {
        const token= req.cookies.accessToken||req.header("Authorization").replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Invalid credentials!")
        }
        const verifyToken=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)
        if(!verifyToken){
            throw new ApiError(401,"Inavalid verification")
        }
        const user=await User.findOne(verifyToken?._id)
        if(!user){
            throw new ApiError(401,"User not found with token")
        }
        req.user=user
        next()
    } catch (error) {
    throw new ApiError(401,error?.message||"Invalid access")
        
    }
    }

export default authUser