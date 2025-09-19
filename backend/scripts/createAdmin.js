// scripts/createAdmin.js
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import mongoose from 'mongoose';

export const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("Admin Email:", adminEmail);

    if (!adminEmail || !adminPassword) {
      throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env");
    }

    // Check if admin already exists
    let adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {

      adminUser = new User({
        firstName: "test",
        lastName: "admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });

      await adminUser.save();
      console.log("Admin user created:", adminEmail);
    } else {
      console.log("Admin user already exists:", adminEmail);
    }

    return adminUser;
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    throw error; 
  } finally {
    await mongoose.connection.close();
  }
};

// run this code in the terminal for creating admin user
// npm run create-admin
createAdmin()