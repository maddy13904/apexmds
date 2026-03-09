import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    platform: String,
    ipAddress: String,
    userAgent: String,
    loggedInAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success"
    }
  },
  { timestamps: true }
);

export default mongoose.model("LoginHistory", loginHistorySchema);
