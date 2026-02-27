/**
 * =============================================
 * LESSON SCHEMA
 * =============================================
 * Purpose:
 * - Store lessons for each course
 * - Maintain course → lessons 1:N relationship
 */

import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
{
    // Lesson title
    title: {
        type: String,
        required: [true, "Lesson title is required"],
        trim: true
    },
//later i will handle
    // videoUrl: {
    //     type: String,
    //     required: [true, "Lesson video URL is required"]
    // },

    // resourceUrl: {
    //     type: String,
    //     default: ""
    // },

    // Lesson duration in minutes
    duration: {
        type: Number,
        default: 0
    },

    /**
     * Course Reference
     * Connects lesson → Course
     */
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course reference is required"]
    }

},
{
    timestamps: true // createdAt, updatedAt
});

export const Lesson= mongoose.model("Lesson", lessonSchema);