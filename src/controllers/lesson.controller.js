/**
 * =============================================================
 * LESSON CONTROLLER
 * =============================================================
 * Purpose:
 * - Handle CRUD operations for Lessons
 * - Only instructors can create/update/delete
 * - Students can fetch lessons of courses they are enrolled in
 */

import Lesson from "../models/Lesson.js";
import Course from "../models/Course.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";


/**
 * =============================================
 * CREATE LESSON
 * =============================================
 * Access: Instructor only
 * Steps:
 * 1. Validate required fields
 * 2. Verify instructor owns the course
 * 3. Create lesson linked to course
 */
export const createLesson = asyncHandler(async (req, res) => {

    const { title, videoUrl, resourceUrl, duration, course: courseId } = req.body;

    if (!title || !videoUrl || !courseId) {
        throw new ApiError(400, "Title, videoUrl, and course ID are required");
    }

    // Verify instructor owns the course
    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }
    if (course.instructor.toString() !== req.user.id) {
        throw new ApiError(403, "You are not authorized to add lesson to this course");
    }

    const lesson = await Lesson.create({
        title,
        videoUrl,
        resourceUrl,
        duration,
        course: courseId
    });

    return res
        .status(201)
        .json(new ApiResponse(201, lesson, "Lesson created successfully"));
});


/**
 * =============================================
 * GET LESSONS BY COURSE
 * =============================================
 * Access: Student (enrolled) or Instructor
 * Steps:
 * 1. Validate course ID
 * 2. Fetch lessons of the course
 * 3. Populate course info (optional)
 */
export const getLessonsByCourse = asyncHandler(async (req, res) => {

    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    const lessons = await Lesson.find({ course: courseId })
        .sort({ createdAt: 1 });

    return res
        .status(200)
        .json(new ApiResponse(200, lessons, "Lessons fetched successfully"));
});


/**
 * =============================================
 * GET SINGLE LESSON
 * =============================================
 * Access: Student (enrolled) or Instructor
 * Steps:
 * 1. Fetch lesson by ID
 * 2. Return 404 if not found
 */
export const getSingleLesson = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const lesson = await Lesson.findById(id)
        .populate("course", "title instructor");

    if (!lesson) {
        throw new ApiError(404, "Lesson not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, lesson, "Lesson fetched successfully"));
});


/**
 * =============================================
 * UPDATE LESSON
 * =============================================
 * Access: Instructor only
 * Steps:
 * 1. Fetch lesson
 * 2. Verify instructor owns the course
 * 3. Update lesson details
 */
export const updateLesson = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
        throw new ApiError(404, "Lesson not found");
    }

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user.id) {
        throw new ApiError(403, "You are not authorized to update this lesson");
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    });

    return res
        .status(200)
        .json(new ApiResponse(200, updatedLesson, "Lesson updated successfully"));
});


/**
 * =============================================
 * DELETE LESSON
 * =============================================
 * Access: Instructor only
 * Steps:
 * 1. Fetch lesson
 * 2. Verify instructor owns the course
 * 3. Delete lesson
 */
export const deleteLesson = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
        throw new ApiError(404, "Lesson not found");
    }

    const course = await Course.findById(lesson.course);
    if (course.instructor.toString() !== req.user.id) {
        throw new ApiError(403, "You are not authorized to delete this lesson");
    }

    await lesson.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Lesson deleted successfully"));
});