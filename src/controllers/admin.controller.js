// Import models

import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

// Import utilities
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
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

/**
 * ==========================================
 * CREATE INSTRUCTOR (Admin Only)
 * ==========================================
 */
export const createInstructor = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;
    console.log("here is password",password)

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const instructor = await User.create({
        name,
        email,
        password,
        role: "instructor"
    });

    return res.status(201).json(
        new ApiResponse(201, instructor, "Instructor created successfully")
    );

});