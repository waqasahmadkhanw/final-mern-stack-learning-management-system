import { Router } from "express";
const router=Router()
/**
 * ==========================================
 * ADMIN ROUTES
 * ==========================================
 */
import { createInstructor, deleteUser, getAllUsers, getAnalytics } from "../controllers/admin.controller.js";
import { authorizeRoles, authUser } from "../middlewares/auth.middleware.js";

router.route("/users").get(authUser,authorizeRoles("admin"),getAllUsers);
router.route("/users/:id").delete(authUser,authorizeRoles("admin"),deleteUser);

router.route("/analytics").get(authUser,authorizeRoles("admin"),getAnalytics);
//=========instructor creation========//
router.route("/create-instructor").post( authUser,authorizeRoles("admin"), createInstructor);
export default router