import mongoose from "mongoose";

const userDownloadSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  contentId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  type: {
    type: String,
    enum: ["ebook", "questionpaper"],
    required: true
  }

}, {
  timestamps: true
});

export default mongoose.model("UserDownload", userDownloadSchema);