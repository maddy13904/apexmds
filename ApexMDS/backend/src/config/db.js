import mongoose from "mongoose";
import { seedSubjects } from "../utils/seedSubjects.js";
import seedQuestions from "../utils/seedQuestions.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
    await seedSubjects();
    await seedQuestions();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
