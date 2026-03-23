// models/ExamSession.js

import mongoose from "mongoose";

const examSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: ["previousYear", "dailyQuiz", "mockTest"],
      required: true
    },

    subjects: [String],

    totalQuestions: Number,

    duration: Number, // in minutes

    startedAt: Date,

    completedAt: Date,

    score: Number
  },
  { timestamps: true }
);

export default mongoose.model("ExamSession", examSessionSchema);
