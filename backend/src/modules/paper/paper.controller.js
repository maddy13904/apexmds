import QuestionPaper from "../../models/QuestionPaper.js";

export const getPapersByYear = async (req, res) => {
  try {
    const year = Number(req.query.year);

    if (!year) {
      return res.status(400).json({
        message: "Year query parameter is required"
      });
    }

    const papers = await QuestionPaper.find({ year }).sort({
      paperNumber: 1
    });

    res.json(papers);
  } catch (error) {
    console.error("Error fetching papers:", error);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const getAllPapers = async (req, res) => {
  try {
    const papers = await QuestionPaper.find()
      .select("year pdfUrl")
      .sort({ year: -1 });

    res.json(papers);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};