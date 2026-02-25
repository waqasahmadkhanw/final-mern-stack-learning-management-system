import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails } from "../user.controller.js";
import authUser from "../../middlewares/auth.middleware.js";
const router=Router()
router.route("/register").post(registerUser)
router.route("/login-user").post(loginUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(authUser,getCurrentUser)
router.route("/change-password").patch(authUser,changeCurrentPassword)
router.route("/update-user-details").patch(authUser,updateAccountDetails)
router.route("/logout-user").post(authUser,logoutUser)
export default router