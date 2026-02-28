import { Router } from "express";
const router=Router()
/**
 * ==========================================
 * STUDENT ROUTES
 * ==========================================
 */
import { enrollCourse, getMyCourses, updateProgress } from "../controllers/entrollment.controller.js";
import { authorizeRoles, authUser } from "../middlewares/auth.middleware.js";

router.route("/enroll").post( authUser, authorizeRoles("student"),enrollCourse);
router.route("/my-course").get(authUser,authorizeRoles("student"),getMyCourses);
router.route("/progress/:enrollmentId").put(authUser,authorizeRoles("student"),updateProgress);
export default router