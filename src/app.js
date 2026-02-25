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
import userRegRoute from "./controllers/routes/user.route.js"
app.use("/api/v1/user",userRegRoute)

export default app