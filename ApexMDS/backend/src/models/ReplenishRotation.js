import mongoose from "mongoose";

const rotationSchema = new mongoose.Schema({
  lastIndex: {
    type: Number,
    default: -1
  }
});

export default mongoose.model("ReplenishRotation", rotationSchema);