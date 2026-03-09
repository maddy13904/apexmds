import { useState } from "react";
import Layout from "../components/Layout";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function MockTestSetup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function startMock() {
    try {
      setLoading(true);

      const res = await API.post("/test/start", {
        sessionType: "mock_test",
        subjects: [],
        totalQuestions: 240,
        timeLimitMinutes: 180,
      });

      navigate("/test", {
        state: {
          sessionId: res.data.sessionId,
          questions: res.data.questions,
          timeLimitMinutes: 180,
        },
      });
    } catch (err) {
      console.error("Start mock error:", err);
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
            Full-Length Mock Test
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Simulate the real NEET MDS exam environment
          </p>
        </div>

        {/* Exam Info Card */}
        <Card>

          <div className="space-y-6">

            <div className="flex justify-between text-sm text-slate-700">
              <span>Duration</span>
              <span className="font-semibold">3 Hours</span>
            </div>

            <div className="flex justify-between text-sm text-slate-700">
              <span>Total Questions</span>
              <span className="font-semibold">240</span>
            </div>

            <div className="flex justify-between text-sm text-slate-700">
              <span>Subjects Covered</span>
              <span className="font-semibold">All 16 Subjects</span>
            </div>

          </div>

        </Card>

        {/* Warning */}
        <Card>

          <p className="text-sm text-amber-700">
            ⚠ Once started, the timer begins immediately.  
            Ensure you have 3 hours of uninterrupted time.
          </p>

        </Card>

        {/* Start Button */}
        <Button
          onClick={startMock}
          disabled={loading}
          className="w-full py-4 text-base"
        >
          {loading ? "Starting..." : "Start Full Mock"}
        </Button>

      </div>
    </Layout>
  );
}