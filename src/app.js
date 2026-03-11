import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"
const app=express()
// WHAT: Configure CORS middleware
// WHY: Allow frontend to communicate with backend securely, including cookies
// HOW: Restrict origin to environment variable and enable credentials 
// ---------note-------//
// I keep frontend url in here intentially .the best thing to keep it in .env file
app.use(cors({
    // origin:"http://localhost:5173",
    origin:[
    "http://localhost:5173",
    "https://final-frontend-learning-management-sandy.vercel.app"
  ],
  // origin: (origin, callback) => {
  //   if (!origin || origin.includes("vercel.app") || origin.includes("localhost")) {
  //     callback(null, true);
  //   } else {
  //     callback(new Error("Not allowed by CORS"));
  //   }
  // },
  credentials: true
}));
app.use(express.json({limit:"16kb"}))
// WHAT: Parse URL-encoded form data
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("./public/temp"))
app.use(cookieParser())


//=====routes declarations====//
import userRegRoute from "./routes/user.route.js"
app.use("/api/users",userRegRoute)
// ============================================
// MOUNT ROUTES (VERY IMPORTANT)
// ============================================
import courseRoutes from "./routes/course.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

app.use("/api/courses", courseRoutes);
// app.use("/api/instructor/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/admin", adminRoutes);
export default app
