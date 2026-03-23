import mongoose from "mongoose";

const ebookSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    pdfUrl: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Ebook", ebookSchema);