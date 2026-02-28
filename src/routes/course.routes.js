import { Router } from "express";
const router=Router()
import { createCourse, deleteCourse, getAllCourses, getSingleCourse,updateCourse 
} from "../controllers/course.controller.js";
import { authorizeRoles, authUser } from "../middlewares/auth.middleware.js";
//------public routes-------//
router.route("/getall-courses").get(authUser,getAllCourses)
router.route("/create-course").post(authUser,authorizeRoles("instructor"),createCourse)
router.route("/:id").get(getSingleCourse)
//======INSTRUCTOR ROUTES======//
router.route("/:id").put(authUser,authorizeRoles("instructor"),updateCourse)
//====== INSTRUCTOR OR ADMIN ROUTES=====//
router.route("/:id").delete(authUser,authorizeRoles("instructor","admin"),deleteCourse)
export default router