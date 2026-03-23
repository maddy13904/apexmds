import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  },
  { _id: false }
);

const questionSchema = new mongoose.Schema(
  {
    // 🔹 Subject reference
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true
    },

    // 🔹 Concept tags (AI generated multiple tags)
    conceptTags: {
      type: [String],
      required: true,
      index: true
    },

    // 🔹 Main question text
    questionText: {
      type: String,
      required: true,
      trim: true
    },

    // 🔹 Options (exactly 4 required)
    options: {
      type: [optionSchema],
      validate: {
        validator: function (val) {
          return val.length === 4 && val.filter(o => o.isCorrect).length === 1;
        },
        message: "Question must have exactly 4 options and exactly 1 correct option."
      }
    },

    // 🔹 Explanation
    explanation: {
      type: String,
      required: true,
      trim: true
    },

    // 🔹 Difficulty
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
      index: true
    },

    // 🔹 Question Type
    questionType: {
      type: String,
      enum: ["previous_year", "dynamic"],
      required: true,
      index: true
    },

    // 🔹 For Previous Year questions only
    examYear: {
      type: Number,
      index: true
    },

    // 🔹 AI metadata
    aiModelVersion: {
      type: String,
      required: true
    },

    promptVersion: {
      type: String,
      required: true
    },

    validationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true
    },

    validationScore: {
      type: Number,
      default: 1.0
    },

    // 🔹 Uniqueness control (critical for zero repetition)
    questionHash: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  { timestamps: true }
);


// 🔥 Compound indexes for performance
questionSchema.index({ subject: 1, difficulty: 1 });
questionSchema.index({ subject: 1, questionType: 1 });
questionSchema.index({ subject: 1, validationStatus: 1 });


export default mongoose.model("Question", questionSchema);
