import { Router } from "express";
import { loginUser, registerUser } from "../user.controller.js";
const router=Router()
router.route("/register").post(registerUser)
router.route("/login-user").post(loginUser)
export default router