import mongoose from "mongoose";

const testSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sessionType: {
      type: String,
      enum: ["previous_year", "daily_quiz", "mock_test"],
      required: true
    },

    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
      }
    ],

    totalQuestions: Number,
    timeLimitMinutes: Number,

    score: {
      type: Number,
      default: 0
    },

    attemptedQuestions: {
      type: Number,
      default: 0
    },

    completed: {
      type: Boolean,
      default: false
    },
    startTime: {
  type: Date,
  required: true
},

endTime: {
  type: Date,
  required: true
}
  },
  { timestamps: true }
);

export default mongoose.model("TestSession", testSessionSchema);
