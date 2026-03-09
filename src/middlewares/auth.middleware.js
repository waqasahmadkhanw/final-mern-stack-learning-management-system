// import { User } from "../models/user.model.js"
// import { ApiError } from "../utils/ApiError.js"
// import jwt from "jsonwebtoken"

//     const authUser=async(req,_,next)=>{
//     try {
//         const token= req.cookies.accessToken||req.header("Authorization").replace("Bearer ","")
//         if(!token){
//             throw new ApiError(401,"Invalid credentials!")
//         }
//         const verifyToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
//         if(!verifyToken){
//             throw new ApiError(401,"Inavalid verification")
//         }
//         const user=await User.findById(verifyToken?._id)
//         if(!user){
//             throw new ApiError(401,"User not found with token")
//         }
//         req.user=user
//         next()
//     } catch (error) {
//     throw new ApiError(401,error?.message||"Invalid access")
        
//     }
//     }
    
// // ==========================================
// // ROLE AUTHORIZATION MIDDLEWARE
// // ==========================================

// // WHAT: Allow only specific roles
// // WHY: Reusable for admin, instructor, etc.
// // HOW: Pass allowed roles as arguments

// const authorizeRoles = (...allowedRoles) => {
//   return (req,_, next) => {

//     if (!req.user) {
//       throw new ApiError(401,"Unauthorized")
//     }

//     if (!allowedRoles.includes(req.user.role)) {
//      throw new ApiError(401,"Access is denied")
//     }

//     next();
//   };
// };
// export {authUser,authorizeRoles}
//---my prevoius code has  some mitakes-- //

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

const authUser = async (req, _, next) => {
  try {

    // Get token from cookie or Authorization header
    let token =
      req.cookies?.accessToken ||
      (req.header("Authorization") &&
        req.header("Authorization").replace("Bearer ", ""));

    if (!token) {
      throw new ApiError(401, "Invalid credentials!");
    }

    // Verify token
    const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!verifyToken) {
      throw new ApiError(401, "Invalid verification");
    }

    // Find user
    const user = await User.findById(verifyToken?._id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found with token");
    }

    // Attach user to request
    req.user = user;

    next();

  } catch (error) {
    next(new ApiError(401, error?.message || "Invalid access"));
  }
};


// ==========================================
// ROLE AUTHORIZATION MIDDLEWARE
// ==========================================

const authorizeRoles = (...allowedRoles) => {
  return (req, _, next) => {

    if (!req.user) {
      return next(new ApiError(401, "Unauthorized"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, "Access is denied"));
    }

    next();
  };
};

export { authUser, authorizeRoles };
