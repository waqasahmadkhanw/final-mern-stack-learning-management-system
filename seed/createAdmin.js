// seed/createAdmin.js

import Dbconnection from "../src/db/index.js";
import { User } from "../src/models/user.model.js";
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
const createAdmin = async () => {
  try {
    // 1. Connect to MongoDB using  existing function
    await Dbconnection();          // this already logs "✅ MongoDB connected!"
    console.log('📦 Database connected for seeding');

    // 2. Check if admin already exists (optional but recommended)
    const existingAdmin = await User.findOne({ email: 'waqasahmadkhan@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists. No new admin created.');
      return;   // exit early – no need to create
    }

    // 3. Create the admin user
    const newAdmin = await User.create({
      name: 'waqas',
      email: 'waqasahmadkhan@gmail.com',
      password: '123456',       // will be auto-hashed by User model's pre-save hook
      role: 'admin'
    });

    console.log('✅ Admin created successfully:', newAdmin.email);
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    // 4. Always close the database connection
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the function
createAdmin();