// Import models
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";

// Import utilities
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


/**
 * ==========================================
 * GET ALL USERS (Admin Only)
 * ==========================================
 */

export const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select("-password");

    return res.status(200).json(
        new ApiResponse(200, users, "All users fetched")
    );
});


/**
 * ==========================================
 * DELETE USER (Admin Only)
 * ==========================================
 */

export const deleteUser = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await user.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "User deleted successfully")
    );
});


/**
 * ==========================================
 * ADMIN ANALYTICS DASHBOARD
 * ==========================================
 */

export const getAnalytics = asyncHandler(async (req, res) => {

    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalUsers,
                totalCourses,
                totalEnrollments
            },
            "Analytics fetched successfully"
        )
    );
});