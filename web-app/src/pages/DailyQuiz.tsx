import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import API from "../api/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function DailyQuiz() {

  const location = useLocation();
  const navigate = useNavigate();

  const subject = location.state?.subject || null;

  const isStudyPlanPractice = !!subject;

  const totalQuestions = isStudyPlanPractice ? 35 : 20;
  const timeLimitMinutes = isStudyPlanPractice ? 30 : 20;

  const [loading, setLoading] = useState(false);

  async function startQuiz() {
  try {
    setLoading(true);

    const payload = {
      sessionType: "daily_quiz",
      subjects: subject ? [subject] : [],
      totalQuestions: subject ? 35 : 20,
      timeLimitMinutes: subject ? 30 : 20
    };

    const res = await API.post("/test/start", payload);

    navigate("/test", {
      state: {
        sessionId: res.data.sessionId,
        questions: res.data.questions,
        timeLimitMinutes: payload.timeLimitMinutes
      }
    });

  } catch (err) {
    console.error("Daily quiz error:", err);
  } finally {
    setLoading(false);
  }
}

  return (
    <Layout>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}

        <div>

          <h1 className="text-2xl font-bold text-slate-900">
            {isStudyPlanPractice ? "Focused Practice" : "Daily Quiz"}
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            {isStudyPlanPractice
              ? `Practice questions from ${subject}`
              : "Quick practice to sharpen your concepts"}
          </p>

        </div>

        {/* Quiz Info */}

        <Card>

          <div className="space-y-6">

            <div className="flex justify-between text-sm text-slate-700">
              <span>Total Questions</span>
              <span className="font-semibold">{totalQuestions}</span>
            </div>

            <div className="flex justify-between text-sm text-slate-700">
              <span>Time Limit</span>
              <span className="font-semibold">
                {timeLimitMinutes} minutes
              </span>
            </div>

            <div className="flex justify-between text-sm text-slate-700">
              <span>Subjects</span>
              <span className="font-semibold">
                {subject || "Mixed Subjects"}
              </span>
            </div>

          </div>

        </Card>

        {/* Warning */}

        <Card>

          <p className="text-sm text-amber-700">
            ⚠ Once started, the timer begins immediately.
          </p>

        </Card>

        {/* Start Button */}

        <Button
          onClick={startQuiz}
          disabled={loading}
          className="w-full py-4 text-base"
        >
          {loading ? "Starting Quiz..." : "Start Quiz"}
        </Button>

      </div>

    </Layout>
  );
}