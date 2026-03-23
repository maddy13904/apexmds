import PreviousYear from "../../models/PreviousYear.js";
import QuestionPaper from "../../models/QuestionPaper.js";
import Question from "../../models/Question.js";
import PracticeAttempt from "../../models/PracticeAttempt.js";


export const getYears = async (req, res) => {
  const years = await PreviousYear.find().sort({ year: -1 });
  res.json(years);
};


export const getPapersByYear = async (req, res) => {
  const papers = await QuestionPaper.find({ year: req.params.yearId })
    .select("_id paperNumber");
  res.json(papers);
};


export const getPracticeQuestions = async (req, res) => {
  const paperId = req.params.paperId;
  const userId = req.user._id;

  const paper = await QuestionPaper.findById(paperId).populate("questions");

  // Get already attempted questions
  const attempted = await PracticeAttempt.find({
    user: userId,
    paper: paperId
  }).select("question");

  const attemptedIds = attempted.map(a => a.question.toString());

  const unanswered = paper.questions.filter(
    q => !attemptedIds.includes(q._id.toString())
  );

  res.json(unanswered);
};


export const submitAnswer = async (req, res) => {
  const { questionId, selectedOptionIndex, paperId } = req.body;

  const question = await Question.findById(questionId);
  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  const isCorrect =
    question.correctOptionIndex === selectedOptionIndex;

  try {
    await PracticeAttempt.create({
      user: req.user._id,
      question: questionId,
      selectedOptionIndex,
      isCorrect,
      year: question.year,
      paper: paperId
    });

    res.json({ isCorrect });
  } catch (error) {
    // Duplicate attempt blocked here
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Question already attempted"
      });
    }
    res.status(500).json({ message: error.message });
  }
};


export const getPracticeSummary = async (req, res) => {
  const paperId = req.params.paperId;

  const attempts = await PracticeAttempt.find({
    user: req.user._id,
    paper: paperId
  }).populate("question");

  let correct = 0;
  let wrong = 0;
  const subjectStats = {};

  attempts.forEach(a => {
    if (a.isCorrect) correct++;
    else wrong++;

    const subject = a.question.subject.toString();

    if (!subjectStats[subject]) {
      subjectStats[subject] = { correct: 0, wrong: 0 };
    }

    if (a.isCorrect) subjectStats[subject].correct++;
    else subjectStats[subject].wrong++;
  });

  res.json({
    total: attempts.length,
    correct,
    wrong,
    subjectStats
  });
};
