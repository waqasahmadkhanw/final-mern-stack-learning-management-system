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
router.route("/create-course").post(authorizeRoles("instructor"),createCourse)
router.route("/:id").put(authorizeRoles("instructor"),updateCourse)
//====== INSTRUCTOR OR ADMIN ROUTES=====//
router.route("/delete-course").put(authUser,authorizeRoles("instructor","admin"),deleteCourse)

// =============================================================
 //            LESSON ROUTES
 // ============================================================
import { createLesson, deleteLesson, getLessonsByCourse, getSingleLesson, updateLesson } from "../controllers/lesson.controller.js";
 router
  .route("/course/:courseId")
  .get(authUser, getLessonsByCourse);


/**
 * ==========================================
 * CREATE LESSON
 * POST /api/lessons
 * ==========================================
 */
router
  .route("/")
  .post(
    authUser,
    authorizeRoles("instructor"),
    createLesson
  );


/**
 * ==========================================
 * GET SINGLE LESSON
 * PUT LESSON
 * DELETE LESSON
 * /api/lessons/:id
 * ==========================================
 */
router
  .route("/:id")
  .get(authUser, getSingleLesson)
  .put(
    authUser,
    authorizeRoles("instructor"),
    updateLesson
  )
  .delete(
    authUser,
    authorizeRoles("instructor"),
    deleteLesson
  );
/**
 * ==========================================
 * STUDENT ROUTES
 * ==========================================
 */
import { enrollCourse, getMyCourses, updateProgress } from "../controllers/entrollment.controller.js";

router.route("/enroll").post( authUser, authorizeRoles("student"),enrollCourse);
router.route("/my-courses").get(authUser,authorizeRoles("student"),getMyCourses);
router.route("/progress/:enrollmentId").put(authUser,authorizeRoles("student"),updateProgress);

/**
 * ==========================================
 * ADMIN ROUTES
 * ==========================================
 */
import { createInstructor, deleteUser, getAllUsers, getAnalytics } from "../controllers/admin.controller.js";

router.route("/users").get(authUser,authorizeRoles("admin"),getAllUsers);
router.route("/users/:id").delete(authUser,authorizeRoles("admin"),deleteUser);

router.route("/analytics").get(authUser,authorizeRoles("admin"),getAnalytics);
//=========instructor creation========//
router.route("/create-instructor").post( authUser,authorizeRoles("admin"), createInstructor);

export default router