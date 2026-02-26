
/**
 * =============================================
 * CREATE COURSE (Instructor Only)
 * =============================================
 * Purpose:
 * - Allow instructor to create new course
 * - Instructor ID comes from auth middleware (req.user)
 * - Uses asyncHandler for centralized error handling
 * - Uses ApiResponse for consistent response format
 */

import { Course } from "../models/course.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const createCourse = asyncHandler(async (req, res) => {

    // Destructure validated data from request body
    const { title, description, category, price } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
        throw new ApiError(400, "Title, description and category are required");
    }

    // Create course linked to logged-in instructor
    const course = await Course.create({
        title,
        description,
        category,
        price,
        instructor: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponse(201, course, "Course created successfully"));
});
/**
 * =============================================
 * GET ALL COURSES
 * =============================================
 * Purpose:
 * - Public route
 * - Fetch all courses
 * - Populate instructor basic info
 */

export const getAllCourses = asyncHandler(async (req, res) => {

    const courses = await Course.find()
        .populate("instructor", "name email")
        .sort({ createdAt: -1 }); // newest first

    return res
        .status(200)
        .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});
/**
 * =============================================
 * GET SINGLE COURSE
 * =============================================
 * Purpose:
 * - Fetch one course by ID
 * - Return 404 if not found
 */

export const getSingleCourse = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const course = await Course.findById(id)
        .populate("instructor", "name email");

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, course, "Course fetched successfully"));
});
/**
 * =============================================
 * UPDATE COURSE
 * =============================================
 * Purpose:
 * - Only course owner (instructor) can update
 * - Prevent unauthorized updates
 */

export const updateCourse = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id) {
        throw new ApiError(403, "Not authorized to update this course");
    }

    const updatedCourse = await Course.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCourse, "Course updated successfully"));
});
/**
 * =============================================
 * DELETE COURSE
 * =============================================
 * Purpose:
 * - Instructor can delete own course
 * - Admin can delete any course
 */

export const deleteCourse = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const course = await Course.findById(id);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Allow if owner OR admin
    if (
        course.instructor.toString() !== req.user._id &&
        req.user.role !== "admin"
    ) {
        throw new ApiError(403, "Not authorized to delete this course");
    }

    await course.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Course deleted successfully"));
});