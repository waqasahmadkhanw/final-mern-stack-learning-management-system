// ===============================================
// AUTH CONTROLLER
// ===============================================

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import options from "../utils/Options.js";// cookie options
 // helper function
import generateAccessAndRefreshToken from "./generateAccessAndRefreshToken.controller.js";
import jwt from "jsonwebtoken"; 

// ===============================================
// REGISTER USER
// ===============================================
const registerUser = asyncHandler(async (req, res) => {
  // -------------------------------
  // STEP 1: Get data from req.body
  // -------------------------------
  const { name, email, password } = req.body;

  // -------------------------------
  // STEP 2: Validate fields
  // -------------------------------
  if ([name, email, password].some(field => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  // optional: Validate email format
//   const emailRegex = /\S+@\S+\.\S+/;
//   if (!emailRegex.test(email)) {
//     throw new ApiError(400, "Invalid email format");
//   }

  // -------------------------------
  // STEP 3: Check if user already exists
  // -------------------------------
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists. Please login.");
  }

  // -------------------------------
  // STEP 4: Create user in DB
  // -------------------------------
  const user = await User.create({ name, email, password });

  if (!user) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  // -------------------------------
  // STEP 5: Remove sensitive fields
  // -------------------------------
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  // -------------------------------
  // STEP 6: Send response
  // -------------------------------
  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});

// ===============================================
// LOGIN USER
// ===============================================
const loginUser = asyncHandler(async (req, res) => {
  // -------------------------------
  // STEP 1: Get data from req.body
  // -------------------------------
  const { email, password } = req.body;
  console.log("email..".req.body)

  // -------------------------------
  // STEP 2: Validate fields
  // -------------------------------
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // -------------------------------
  // STEP 3: Find user in DB (include password)
  // -------------------------------
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // -------------------------------
  // STEP 4: Check password
  // -------------------------------
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // -------------------------------
  // STEP 5: Generate tokens
  // -------------------------------
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  // Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // -------------------------------
  // STEP 6: Remove sensitive fields
  // -------------------------------
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  // -------------------------------
  // STEP 7: Send response with cookies

  return res.status(200)
    .cookie("accessToken", accessToken,options )
    .cookie("refreshToken", refreshToken,options)
    .json(
      new ApiResponse(200, { user: loggedInUser }, "User logged in successfully")
    );
});
//// ===============================================
// LOGOUT USER
// ===============================================
const logoutUser=asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(req.user?._id,{
  $unset:{
    refreshToken:1
  }
},{new:true})
return res.status(200)
.clearCookie("refreshToken",options)
.clearCookie("accessToken",options)
.json(
  new ApiResponse(200,{},"User logout successfully")
)
})

//// ===============================================
// REFRESH ACCESS TOKEN
// ===============================================
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})
//// ===============================================
// CHANGE CURRENT PASSWORRD
// ===============================================
const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body
// if(!oldPassword&&!newPassword){
//   throw new ApiError(401,"All fields are required")
// }
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
})
//// ===============================================
// GET CURRENT USER
// ===============================================

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})
//// ===============================================
// UPDATE  USER DETAILS
// ===============================================
const updateAccountDetails = asyncHandler(async(req, res) => {
    const {name,email} = req.body

    if (!name || !email) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name:name,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
});
export { registerUser, loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails};