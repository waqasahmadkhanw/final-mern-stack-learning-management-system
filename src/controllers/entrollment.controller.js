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



/**
 * ==========================================
 * GET MY COURSES (Student Dashboard)
 * ==========================================
 */

export const getMyCourses = asyncHandler(async (req, res) => {

    const enrollments = await Enrollment.find({
        student: req.user._id
    })
    .populate({
        path: "course",
        populate: {
            path: "instructor",
            select: "name email"
        }
    });

    return res.status(200).json(
        new ApiResponse(200, enrollments, "My enrolled courses fetched")
    );

});



/**
 * ==========================================
 * UPDATE PROGRESS
 * ==========================================
 */

export const updateProgress = asyncHandler(async (req, res) => {

    const { enrollmentId } = req.params;
    const { progress } = req.body;

    const enrollment = await Enrollment.findById(enrollmentId);

    if (!enrollment) {
        throw new ApiError(404, "Enrollment not found");
    }

    // Ensure student owns this enrollment
    if (enrollment.student.toString() !== req.user._id) {
        throw new ApiError(403, "Not authorized");
    }

    enrollment.progress = progress;

    await enrollment.save();

    return res.status(200).json(
        new ApiResponse(200, enrollment, "Progress updated")
    );

});