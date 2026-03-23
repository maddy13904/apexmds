import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/api";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function TestResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchResult();
  }, []);

  async function fetchResult() {
    try {
      const res = await API.get(`/test/result/${sessionId}`);
      setResult(res.data);
    } catch (err) {
      console.error("Result load error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <p className="text-slate-500">Loading result...</p>
        </div>
      </Layout>
    );
  }

  if (!result) {
    return (
      <Layout>
        <div className="text-center mt-20 text-slate-500">
          Unable to load result.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>

      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Test Result
          </h1>

          <p className="text-sm text-slate-500">
            Detailed performance breakdown
          </p>
        </div>

        {/* SUMMARY */}
        <Card>

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Overall Performance
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Score and accuracy summary
              </p>

            </div>

            <div className="text-right">

              <p className="text-4xl font-bold text-slate-900">
                {result.correct} / {result.totalQuestions}
              </p>

              <p className="text-sm text-slate-500">
                Accuracy: {result.accuracy}%
              </p>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-6 mt-8 text-sm">

            <div>
              <p className="text-slate-500">Attempted</p>
              <p className="font-semibold text-slate-900">
                {result.attempted}
              </p>
            </div>

            <div>
              <p className="text-slate-500">Time Taken</p>
              <p className="font-semibold text-slate-900">
                {result.timeTakenMinutes} mins
              </p>
            </div>

            <div>
              <p className="text-slate-500">Performance Level</p>
              <p className="font-semibold text-slate-900">
                {result.performanceLevel}
              </p>
            </div>

          </div>

        </Card>

        {/* SUBJECT PERFORMANCE */}
        <div>

          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Subject Performance
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {result.subjectStats?.map((subject: any, index: number) => (

              <Card key={index}>

                <h3 className="font-semibold text-slate-900 mb-2">
                  {subject.subject}
                </h3>

                <p className="text-sm text-slate-600">
                  Accuracy: {subject.accuracy}%
                </p>

                <p className="text-sm text-slate-600">
                  Correct: {subject.correct} | Wrong: {subject.wrong}
                </p>

              </Card>

            ))}

          </div>

        </div>

        {/* STRONG + WEAK */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* Strong */}

          <div>

            <h2 className="text-lg font-semibold text-green-600 mb-4">
              Strong Subjects
            </h2>

            {result.strongSubjects?.length === 0 && (
              <p className="text-sm text-slate-500">
                No strong subjects identified.
              </p>
            )}

            {result.strongSubjects?.map((subject: any, index: number) => (

              <Card key={index}>

                <p className="text-green-700 font-medium">
                  {subject.subject} ({subject.accuracy}%)
                </p>

              </Card>

            ))}

          </div>

          {/* Weak */}

          <div>

            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Weak Subjects
            </h2>

            {result.weakSubjects?.length === 0 && (
              <p className="text-sm text-slate-500">
                No weak subjects identified.
              </p>
            )}

            {result.weakSubjects?.map((subject: any, index: number) => (

              <Card key={index}>

                <p className="text-red-700 font-medium">
                  {subject.subject} ({subject.accuracy}%)
                </p>

              </Card>

            ))}

          </div>

        </div>

        {/* BUTTON */}
        <div className="pt-6">

          <Button onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>

        </div>

      </div>

    </Layout>
  );
}