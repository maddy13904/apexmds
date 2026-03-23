import mongoose from "mongoose";

const questionPaperSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true
    },
    paperNumber: {
      type: Number,
      default: 1
    },
    pdfUrl: {
      type: String,
      required: true
    },
    totalQuestions: {
      type: Number,
      default: 240
    }
  },
  { timestamps: true }
);

questionPaperSchema.index({ year: 1, paperNumber: 1 }, { unique: true });

export default mongoose.model("QuestionPaper", questionPaperSchema);