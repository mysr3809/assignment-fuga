import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
  const dbURI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(dbURI);
    console.log("MongoDB connected...");
  } catch (err) {
    console.error("MongoDB connection error:  ", err.message);
    process.exit(1);
  }
}

export default connectDB;
