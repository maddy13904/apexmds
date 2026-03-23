import mongoose from "mongoose";

const questionAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    testSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestSession",
      required: true
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    selectedOption: {
      type: Number,
      required: true
    },

    correctOption: {
      type: Number,
      required: true
    },

    isCorrect: {
      type: Boolean,
      required: true
    },

    timeTaken: {
      type: Number, // seconds
      default: 0
    },
    conceptTags: {
      type: [String],
      required: true
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("QuestionAttempt", questionAttemptSchema);
