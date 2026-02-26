// Import mongoose
import mongoose from "mongoose";

/**
 * ==========================================
 * ENROLLMENT SCHEMA
 * ==========================================
 * This schema links:
 * Student (User)
 * Course
 * 
 * Core LMS logic:
 * One student can enroll in many courses
 * One course can have many students
 */

const enrollmentSchema = new mongoose.Schema(
{
    // Reference to Student (User collection)
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Reference to Course
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },

    // Track learning progress (0–100%)
    progress: {
        type: Number,
        default: 0
    },

    // Enrollment date
    enrolledAt: {
        type: Date,
        default: Date.now
    }

},
{ timestamps: true }
);


/**
 * ==========================================
 * PREVENT DUPLICATE ENROLLMENT
 * ==========================================
 * A student cannot enroll in same course twice
 */
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });


export default mongoose.model("Enrollment", enrollmentSchema);