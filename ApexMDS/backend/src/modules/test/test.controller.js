import TestSession from "../../models/TestSession.js";
import Question from "../../models/Question.js";
import QuestionAttempt from "../../models/QuestionAttempt.js";
import Subject from "../../models/Subject.js";
import { updateConceptStats } from "../analytics/conceptPerformance.service.js";
import { getAdaptiveQuestionsForDailyQuiz } from "../analytics/adaptiveQuestion.service.js";

/*
=========================================
START TEST
=========================================
*/

export const startTest = async (req, res) => {
  try {
    const { sessionType, totalQuestions, timeLimitMinutes, year, subjects } = req.body;

    let questions = [];
    let finalSubjects = [];
    const startTime = new Date();

const endTime = new Date(
  startTime.getTime() + timeLimitMinutes * 60 * 1000
);

    /*
    =========================================
    1️⃣ PREVIOUS YEAR PAPER
    =========================================
    */
    if (sessionType === "previous_year") {

      questions = await Question.find({
        questionType: "previous_year",
        examYear: year,
        validationStatus: "approved"
      }).limit(totalQuestions);

      if (questions.length !== totalQuestions) {
        return res.status(400).json({
          message: "Previous year paper not complete in DB"
        });
      }

      finalSubjects = [...new Set(questions.map(q => q.subject.toString()))];
    }

    /*
    =========================================
    2️⃣ DAILY QUIZ (RANDOM 15 MIXED)
    =========================================
    */
    else if (sessionType === "daily_quiz") {

  /*
  =========================================
  SUBJECT PRACTICE QUIZ (FROM STUDY PLAN)
  =========================================
  */

  if (subjects && subjects.length > 0) {

    const subjectDoc = await Subject.findOne({
      name: subjects[0]
    });

    if (!subjectDoc) {
      return res.status(400).json({
        message: "Subject not found"
      });
    }

    questions = await Question.aggregate([
      {
        $match: {
          subject: subjectDoc._id,
          validationStatus: "approved"
        }
      },
      { $sample: { size: totalQuestions } }
    ]);

    if (questions.length < totalQuestions) {
      return res.status(400).json({
        message: "Not enough questions for this subject"
      });
    }

    finalSubjects = [subjectDoc._id];
  }

  /*
  =========================================
  NORMAL DAILY QUIZ (ADAPTIVE)
  =========================================
  */
  else {

    questions = await getAdaptiveQuestionsForDailyQuiz(
      req.user._id,
      totalQuestions
    );

    finalSubjects = [];
  }
}

    /*
    =========================================
    3️⃣ FULL MOCK TEST
    15 QUESTIONS PER SUBJECT
    =========================================
    */
    else if (sessionType === "mock_test") {

      const subjects = await Subject.find({}, "_id name");

      let allQuestions = [];

      for (const subject of subjects) {

        const subjectQuestions = await Question.aggregate([
          {
            $match: {
              subject: subject._id,
              questionType: "dynamic",
              validationStatus: "approved"
            }
          },
          { $sample: { size: 15 } }
        ]);

        if (subjectQuestions.length < 15) {
          return res.status(400).json({
            message: `Not enough questions for ${subject.name}`
          });
        }

        allQuestions.push(...subjectQuestions);
      }

      // Shuffle entire 240
      allQuestions.sort(() => Math.random() - 0.5);

      questions = allQuestions;
      finalSubjects = subjects.map(s => s._id);
    }

    else {
      return res.status(400).json({ message: "Invalid session type" });
    }

    /*
    =========================================
    CREATE SESSION
    =========================================
    */


const session = await TestSession.create({
  user: req.user._id,
  sessionType,
  subjects: finalSubjects,
  totalQuestions,
  timeLimitMinutes,
  startTime,
  endTime,
  score: 0,
  attemptedQuestions: 0,
  completed: false
});


    return res.status(201).json({
      sessionId: session._id,
      questions
    });

  } catch (error) {
    console.error("START TEST ERROR:", error);
    return res.status(500).json({ message: "Failed to start test" });
  }
};


/*
=========================================
SUBMIT ANSWER
=========================================
*/

export const submitAnswer = async (req, res) => {
  try {
    const { testSessionId, questionId, selectedOption, timeTaken } = req.body;
    const userId = req.user._id;

    // 1️⃣ Get session FIRST
    const session = await TestSession.findOne({
      _id: testSessionId,
      user: userId
    });

    if (!session) {
      return res.status(404).json({ message: "Test session not found" });
    }

    if (session.completed) {
      return res.status(400).json({ message: "Test already completed" });
    }

    // 2️⃣ Time validation (AFTER session exists)
    if (new Date() > session.endTime) {
      session.completed = true;
      await session.save();

      return res.status(400).json({
        message: "Time expired. Test auto-completed.",
        completed: true
      });
    }

    // 3️⃣ Prevent duplicate attempt
    const existingAttempt = await QuestionAttempt.findOne({
      testSession: testSessionId,
      question: questionId
    });


    // 4️⃣ Get question
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const correctOptionIndex = question.options.findIndex(
      opt => opt.isCorrect === true
    );

    const isCorrect = selectedOption === correctOptionIndex;

    // 5️⃣ Save attempt
        if (existingAttempt) {
  existingAttempt.selectedOption = selectedOption;
  existingAttempt.isCorrect = isCorrect;
  await existingAttempt.save();
} else {
  await QuestionAttempt.create({
      user: userId,
      testSession: session._id,
      question: question._id,
      subject: question.subject,
      conceptTags: question.conceptTags,
      difficulty: question.difficulty,
      selectedOption,
      correctOption: correctOptionIndex,
      isCorrect,
      timeTaken: timeTaken || 0
  });
}

    // 6️⃣ Update score
    if (isCorrect) {
      session.score += 1;
    }

    session.attemptedQuestions += 1;

    if (session.attemptedQuestions >= session.totalQuestions) {
      session.completed = true;
    }

    await session.save();

    return res.status(200).json({
      success: true,
      correct: isCorrect,
      correctOption: correctOptionIndex,
      explanation: question.explanation,
      score: session.score,
      completed: session.completed
    });

  } catch (error) {
    console.error("SUBMIT ANSWER ERROR:", error);
    return res.status(500).json({ message: "Failed to submit answer" });
  }
};

