import mongoose from "mongoose";

const previousYearSchema = new mongoose.Schema({
  year: {
    type: Number,
    unique: true,
    required: true
  }
});

export default mongoose.model("PreviousYear", previousYearSchema);
