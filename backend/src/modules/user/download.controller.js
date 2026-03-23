import UserDownload from "../../models/UserDownload.js";

/*
========================
SAVE DOWNLOAD
========================
*/

export const saveDownload = async (req, res) => {

  try {

    const userId = req.user._id;

    const { contentId, title, type } = req.body;

    const existing = await UserDownload.findOne({
      user: userId,
      contentId
    });

    if (existing) {
      return res.json(existing);
    }

    const download = await UserDownload.create({
      user: userId,
      contentId,
      title,
      type
    });

    res.status(201).json(download);

  } catch (error) {

    console.error("SAVE DOWNLOAD ERROR:", error);

    res.status(500).json({
      message: "Failed to save download"
    });

  }

};


/*
========================
GET USER DOWNLOADS
========================
*/

export const getUserDownloads = async (req, res) => {

  try {

    const userId = req.user._id;

    const downloads = await UserDownload.find({
      user: userId
    }).sort({ createdAt: -1 });

    const ebooks = downloads.filter(d => d.type === "ebook");
    

    const questionPapers = downloads.filter(
      d => d.type === "questionpaper"
    );

    res.json({
      ebooks,
      questionPapers
    });

  } catch (error) {

    console.error("GET DOWNLOAD ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch downloads"
    });

  }

};


/*
========================
DELETE DOWNLOAD
========================
*/

export const deleteDownload = async (req, res) => {

  try {

    const userId = req.user._id;

    const { contentId } = req.params;

    await UserDownload.deleteOne({
      user: userId,
      contentId
    });

    res.json({
      success: true
    });

  } catch (error) {

    console.error("DELETE DOWNLOAD ERROR:", error);

    res.status(500).json({
      message: "Failed to delete download"
    });

  }

};