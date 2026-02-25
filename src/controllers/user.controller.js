// ===============================================
// AUTH CONTROLLER
// ===============================================

import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import options from "../utils/Options.js";
import generateAccessAndRefreshToken from "./generateAccessAndRefreshToken.controller.js";
; // cookie options
 // helper function

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
  // -------------------------------
  return res.status(200)
    .cookie("accessToken", accessToken,options )
    .cookie("refreshToken", refreshToken,options)
    .json(
      new ApiResponse(200, { user: loggedInUser }, "User logged in successfully")
    );
});

export { registerUser, loginUser };