import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails } from "../controllers/user.controller.js";
import authUser, { authorizeRoles } from "../middlewares/auth.middleware.js";
const router=Router()
router.route("/register").post(registerUser)
router.route("/login-user").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(authUser,getCurrentUser)
router.route("/change-password").patch(authUser,changeCurrentPassword)
router.route("/update-user-details").patch(authUser,updateAccountDetails)
router.route("/logout-user").post(authUser,logoutUser)
//==========course routes===========//
import { createCourse, deleteCourse, getAllCourses, getSingleCourse, updateCourse 
} from "../controllers/course.controller.js";
//------public routes-------//
router.route("/getall-courses").get(getAllCourses)
router.route("/:id").get(getSingleCourse)
//======INSTRUCTOR ROUTES======//
router.route("/create_course").post(authorizeRoles("instructor"),createCourse)
router.route("/:id").put(authorizeRoles("instructor"),updateCourse)
//====== INSTRUCTOR OR ADMIN ROUTES=====//
router.route("/delete-course").put(authUser,authorizeRoles("instructor", "admin"),deleteCourse)

export default router