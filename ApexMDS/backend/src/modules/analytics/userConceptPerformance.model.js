import mongoose from "mongoose";

const userConceptPerformanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    concept: {
      type: String,
      required: true
    },

    totalAttempts: {
      type: Number,
      default: 0
    },

    correctAttempts: {
      type: Number,
      default: 0
    },

    accuracy: {
      type: Number,
      default: 0
    },

    easyAttempts: { type: Number, default: 0 },
    mediumAttempts: { type: Number, default: 0 },
    hardAttempts: { type: Number, default: 0 },

    lastAttemptAt: Date
  },
  { timestamps: true }
);

userConceptPerformanceSchema.index(
  { user: 1, subject: 1, concept: 1 },
  { unique: true }
);

export default mongoose.model(
  "UserConceptPerformance",
  userConceptPerformanceSchema
);
