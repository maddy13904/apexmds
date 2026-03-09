import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function TestScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    sessionId,
    questions = [],
    timeLimitMinutes = 180,
  } = location.state || {};

  if (!questions.length) {
    return <div className="p-10">No questions available.</div>;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    questions.map(() => null)
  );

  const [markedQuestions, setMarkedQuestions] = useState<boolean[]>(
    questions.map(() => false)
  );

  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);

  const timerRef = useRef<number | null>(null);

  const currentQuestion = questions[currentIndex];

  /* =============================
     TIMER
  ============================= */

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  /* =============================
     SUBMIT ANSWER
  ============================= */

  async function submitAnswer(optionIndex: number | null) {
    if (optionIndex === null) return;

    await API.post("/test/submit-answer", {
      testSessionId: sessionId,
      questionId: currentQuestion._id,
      selectedOption: optionIndex,
      timeTaken: 0,
    });
  }

  async function handleNext() {
    await submitAnswer(selectedAnswers[currentIndex]);

    if (currentIndex === questions.length - 1) {
      navigate("/test-result", { state: { sessionId } });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handleAutoSubmit() {
    navigate("/test-result", { state: { sessionId } });
  }

  function toggleMark() {
    setMarkedQuestions((prev) =>
      prev.map((val, i) => (i === currentIndex ? !val : val))
    );
  }

  return (
    <div className="h-screen bg-slate-100 flex flex-col">

      {/* HEADER */}

      <div className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">

        <h1 className="font-semibold text-slate-900">
          NEET MDS Mock Test
        </h1>

        <div className="flex items-center gap-8 text-sm">

          <span className="text-slate-600">
            Question {currentIndex + 1} / {questions.length}
          </span>

          <span
            className={`font-semibold text-lg ${
              timeLeft < 300 ? "text-red-600" : "text-slate-900"
            }`}
          >
            ⏱ {formatTime(timeLeft)}
          </span>

          <button
            onClick={handleAutoSubmit}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Submit Test
          </button>

        </div>

      </div>

      {/* MAIN BODY */}

      <div className="flex flex-1 overflow-hidden">

        {/* QUESTION AREA */}

        <div className="flex-1 p-10 overflow-y-auto">

          <div className="max-w-4xl">

            <p className="text-slate-900 text-lg leading-relaxed mb-8">
              {currentQuestion.questionText}
            </p>

            {/* OPTIONS */}

            <div className="space-y-4">

              {currentQuestion.options.map((option: any, index: number) => (

                <div
                  key={index}
                  onClick={() =>
                    setSelectedAnswers((prev) =>
                      prev.map((val, i) =>
                        i === currentIndex ? index : val
                      )
                    )
                  }
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedAnswers[currentIndex] === index
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-300 bg-white hover:border-slate-400"
                  }`}
                >

                  {typeof option === "string"
                    ? option
                    : option.text}

                </div>

              ))}

            </div>

            {/* NAVIGATION */}

            <div className="flex justify-between mt-10">

              <button
                onClick={() =>
                  setCurrentIndex((prev) => Math.max(prev - 1, 0))
                }
                className="px-6 py-2 border border-slate-300 rounded-md hover:bg-slate-100"
              >
                Previous
              </button>

              <button
                onClick={toggleMark}
                className="text-amber-600 font-medium"
              >
                {markedQuestions[currentIndex]
                  ? "Unmark Review"
                  : "Mark for Review"}
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
              >
                {currentIndex === questions.length - 1
                  ? "Finish"
                  : "Next"}
              </button>

            </div>

          </div>

        </div>

        {/* QUESTION PALETTE */}

        <div className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto">

          <h2 className="text-sm font-semibold mb-4">
            Question Palette
          </h2>

          <div className="grid grid-cols-5 gap-3">

            {questions.map((_: any, index: number) => {

              let bg = "bg-slate-300";

              if (index === currentIndex)
                bg = "bg-blue-600";

              else if (markedQuestions[index])
                bg = "bg-amber-500";

              else if (selectedAnswers[index] !== null)
                bg = "bg-green-500";

              return (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-10 rounded text-white text-sm ${bg}`}
                >
                  {index + 1}
                </button>
              );

            })}

          </div>

        </div>

      </div>

    </div>
  );
}