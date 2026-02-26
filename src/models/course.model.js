import mongoose from "mongoose"
import { Schema } from "mongoose"

const courseSchema=new Schema({
title: {
        type: String,
        required: true,
        trim: true
    },

    // Course Description
    description: {
        type: String,
        required: true
    },

    // Course Category
    category: {
        type: String,
        required: true
    },

    // Course Price (0 = Free course)
    price: {
        type: Number,
        default: 0
    },

    // Course Thumbnail Image later addting
    // thumbnail: {
    //     type: String,
    //     default: ""
    // },

    /**
     * Instructor Reference
     * Linking Course → User collection
     */
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps:true})
export const Course=mongoose.model("Course",courseSchema)