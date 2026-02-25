//----steps-----//
//import mongoose from mongoose
//make an async arrow function 
//use trycatch for error handling
//connect through mongoose
//export function
import mongoose from "mongoose"; // WHAT: Import Mongoose library
                                 // WHY: To interact with MongoDB using schemas and models
const Dbconnection = async () => { 
  try {
    const connection =await mongoose.connect(`${process.env.MONGODB_URI}`)
    console.log(`✅ MongoDB connected! Host: ${connection.connection.host}`);
    // WHAT: Log successful connection
    // WHY: Confirm database is connected
    
  } catch (error) {
    console.error("❌ MongoDB connection FAILED", error);
    // WHAT: Log connection error
    // WHY: Identify issues in DB connection
    // HOW: Using console.error
    // WHERE: Server console
    process.exit(1);
    // WHAT: Stop server
    // WHY: Server cannot run without DB
    // HOW: Exit process with failure code
    // WHERE: Backend server startup
  }
};

// Listen for MongoDB disconnect events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected!");
  // WHAT: Notify disconnection
  // WHY: Monitor DB uptime and issues
  // HOW: Event listener on mongoose.connection
  // WHERE: Global backend listener
});

export default Dbconnection; 
// WHAT: Export DB connection function
// WHY: To reuse in server.js or other modules
//