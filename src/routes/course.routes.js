import { Router } from "express";
const router=Router()
import { createCourse, deleteCourse, getAllCourses, getInstructorCourses, getSingleCourse,updateCourse 
} from "../controllers/course.controller.js";
import { authorizeRoles, authUser } from "../middlewares/auth.middleware.js";
//------public routes-------//
// note :I do intentially to not show to non login ser to show my courses.therefore i can not do
// router.route("/").get(getAllCourses), this route
router.route("/").get(authUser,getAllCourses)
router.route("/").post(authUser,authorizeRoles("instructor"),createCourse)
router.route("/:id").get(getSingleCourse)
//======INSTRUCTOR ROUTES======//
router.get(
  "/instructor/my-courses",
  authUser,
  authorizeRoles("instructor"),
  getInstructorCourses
);
router.route("/:id").put(authUser,authorizeRoles("instructor"),updateCourse)
//====== INSTRUCTOR OR ADMIN ROUTES=====//
router.route("/:id").delete(authUser,authorizeRoles("instructor","admin"),deleteCourse)
export default router