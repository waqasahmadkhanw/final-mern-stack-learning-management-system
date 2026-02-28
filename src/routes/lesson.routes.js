import { Router } from "express";
const router=Router()
// =============================================================
 //            LESSON ROUTES
 // ============================================================
import { createLesson, deleteLesson, getLessonsByCourse, getSingleLesson, updateLesson } from "../controllers/lesson.controller.js";
import { authorizeRoles, authUser } from "../middlewares/auth.middleware.js";
 router.route("/course/:courseId").get(authUser,getLessonsByCourse);
router.route("/create-lesson").post(authUser,authorizeRoles("instructor"),createLesson);
router.route("/:id")
.get(authUser, getSingleLesson)//we get by course id
.put(authUser,authorizeRoles("instructor"),updateLesson )
.delete(authUser,authorizeRoles("instructor"),deleteLesson );
export default router