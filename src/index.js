import app from "./app.js";
import Dbconnection from "./db/index.js";
import dotenv from "dotenv"
// WHAT: Load environment variables from .env file
// WHY: Allows using process.env for PORT, DB URI, etc.
dotenv.config({
    path:"./.env"
})
Dbconnection()
.then(()=>{
app.listen(process.env.PORT||5000, () => {
  console.log(`Server is running on :${process.env.PORT}`)
})
})
.catch((error)=>{
console.log("Server connection failure",error)
process.exit(1)
})