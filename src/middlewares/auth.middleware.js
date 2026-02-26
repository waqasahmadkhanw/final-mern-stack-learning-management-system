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
//admin
// ==========================================
// ROLE AUTHORIZATION MIDDLEWARE
// ==========================================

// WHAT: Allow only specific roles
// WHY: Reusable for admin, instructor, etc.
// HOW: Pass allowed roles as arguments

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    if (!req.user) {
      throw new ApiError(401,"Unauthorized")
    }

    if (!allowedRoles.includes(req.user.role)) {
     throw new ApiError(401,"Access is denied")
    }

    next();
  };
};
export default authUser