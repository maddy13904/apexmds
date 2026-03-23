import Ebook from "../../models/Ebooks.js";

export const getAllEbooks = async (req, res) => {
  try {
    const ebooks = await Ebook.find().sort({ subject: 1 });
    res.json(ebooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};