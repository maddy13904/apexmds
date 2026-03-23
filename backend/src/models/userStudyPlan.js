import mongoose from "mongoose";

const userStudyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    focusSubject: {
      type: String,
      required: true
    },

    focusAccuracy: {
      type: Number,
      required: true
    },

    weakConcepts: [
      {
        concept: String,
        accuracy: Number,
        totalAttempts: Number
      }
    ],

    planType: {
      type: String,
      required: true
    },

    recommendedQuestions: {
      type: Number,
      required: true
    },

    recommendedTimeMinutes: {
      type: Number,
      required: true
    },

    aiPrompt: {
      type: String,
      required: true
    },

    generatedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  { timestamps: true }
);

// 🔥 1 plan per user per day
userStudyPlanSchema.index(
  { user: 1, generatedAt: 1 }
);

export default mongoose.model("UserStudyPlan", userStudyPlanSchema);
