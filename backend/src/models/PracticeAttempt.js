import mongoose from "mongoose";

const practiceAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },

    selectedOptionIndex: {
      type: Number,
      min: 0,
      max: 3,
      required: true
    },

    isCorrect: {
      type: Boolean,
      required: true
    },

    year: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PreviousYear",
      required: true
    },

    paper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionPaper",
      required: true
    }
  },
  { timestamps: true }
);

// 🔥 prevents reattempt
practiceAttemptSchema.index(
  { user: 1, question: 1 },
  { unique: true }
);

export default mongoose.model("PracticeAttempt", practiceAttemptSchema);
