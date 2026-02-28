// Import models
import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";


// Import utilities

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * ==========================================
 * ENROLL IN COURSE (Student Only)
 * ==========================================
 */

export const enrollCourse = asyncHandler(async (req, res) => {

    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Check duplicate enrollment
    const alreadyEnrolled = await Enrollment.findOne({
        student: req.user._id,
        course: courseId
    });

    if (alreadyEnrolled) {
        throw new ApiError(400, "Already enrolled in this course");
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
        student: req.user._id,
        course: courseId
    });

    return res.status(201).json(
        new ApiResponse(201, enrollment, "Enrolled successfully")
    );

});
 // ==========================================
 // GET MY COURSES (Student Dashboard)
 // ==========================================
 // Purpose:
 // - Only logged-in students can access
 // - Validate req.user existence
 // - Return empty array safely
export const getMyCourses = asyncHandler(async (req, res) => {

    // STEP 1: Check if user exists
    if (!req.user) {
        throw new ApiError(401, "Unauthorized access");
    }

    // STEP 2: Ensure role is student
    // (Extra protection - even if middleware fails)
    if (req.user.role !== "student") {
        throw new ApiError(403, "Only students can access enrolled courses");
    }

    // STEP 3: Fetch enrollments
    const enrollments = await Enrollment.find({
        student: req.user._id   // use _id not id
    })
    .populate({
        path: "course",
        populate: {
            path: "instructor",
            select: "name email"
        }
    })
    .sort({ createdAt: -1 });

    // STEP 4: Handle no enrollments case
    if (!enrollments || enrollments.length === 0) {
        return res.status(200).json(
            new ApiResponse(200, [], "You are not enrolled in any courses yet")
        );
    }

    // STEP 5: Return response
    return res.status(200).json(
        new ApiResponse(200, enrollments, "My enrolled courses fetched successfully")
    );
});



 //==========================================
 // UPDATE PROGRESS
 //==========================================
 

export const updateProgress = asyncHandler(async (req, res) => {

    const { enrollmentId } = req.params;
    const { progress } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
        throw new ApiError(404, "Enrollment not found");
    }

    // Ensure student owns this enrollment
    if (enrollment.student.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized");
    }

    enrollment.progress = progress;

    await enrollment.save();

    return res.status(200).json(
        new ApiResponse(200, enrollment, "Progress updated")
    );

});