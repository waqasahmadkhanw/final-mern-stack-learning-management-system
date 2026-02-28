import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
const app=express()
// WHAT: Configure CORS middleware
// WHY: Allow frontend to communicate with backend securely, including cookies
// HOW: Restrict origin to environment variable and enable credentials
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
// WHAT: Parse URL-encoded form data
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("./public/temp"))
app.use(cookieParser())


//=====routes declarations====//
import userRegRoute from "./routes/user.route.js"
app.use("/api/v1/user",userRegRoute)
// ============================================
// MOUNT ROUTES (VERY IMPORTANT)
// ============================================
import courseRoutes from "./routes/course.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/admin", adminRoutes);
export default app