import cookieParser from "cookie-parser"
import express from "express"
import cors from "cors"

// 🔐 Security packages
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import xssClean from "xss-clean";

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
/* ============================================
   🔐 SECURITY MIDDLEWARES
============================================ */

// 1️⃣ Helmet - secure HTTP headers
app.use(helmet());

// 2️⃣ Logger (important for debugging + monitoring)
app.use(morgan("dev"));

// 3️⃣ Rate Limiting - prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP
  message: "Too many requests, please try again later"
});
app.use("/api", limiter);

// 4️⃣ Prevent HTTP Parameter Pollution
app.use(hpp());

// 5️⃣ Prevent XSS attacks
app.use(xssClean());

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



/* ============================================
   ❌ GLOBAL ERROR HANDLER (VERY IMPORTANT)
============================================ */

app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});
export default app
