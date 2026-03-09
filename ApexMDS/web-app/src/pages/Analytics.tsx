import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/api";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import AnalyticsStatCard from "../components/AnalyticsStatsCard";
import { CheckCircle, ClipboardCheck, ClipboardList, Clock, TrendingUp, XCircle } from "lucide-react";

export default function Analytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const res = await API.get("/analytics/global");
      setData(res.data);
    } catch (err) {
      console.error("Analytics load failed:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <p className="text-slate-500">Loading analytics...</p>
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="text-center mt-20 text-slate-500">
          No analytics available.
        </div>
      </Layout>
    );
  }

  const { overview, weakSubjects, strongSubjects, recentTests } = data;

  function formatSessionType(type: string) {
    if (type === "previous_year") return "Previous Year";
    if (type === "mock_test") return "Mock Test";
    if (type === "daily_quiz") return "Daily Quiz";
    return type;
  }

  function handleLearnWithAI(subject: string, accuracy: number) {
    const prompt = `
I am preparing for NEET MDS.

My weak subject is ${subject}.
My current accuracy in this subject is ${accuracy}%.

Create a structured improvement plan including:
1. Core concepts to master
2. Common mistakes
3. High-yield exam traps
4. Rapid revision bullets
5. Strategy to reach 75%+ accuracy

Return in structured format.
`;

    navigate("/ai-tutor", { state: { prompt } });
  }

  return (
    <Layout>

      <div className="max-w-6xl mx-auto space-y-10">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Performance Analytics
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Track your progress and subject mastery
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6">

          <AnalyticsStatCard
  title="Overall Progress"
  value="78%"
  subtitle="Your average performance"
  icon={<TrendingUp className="w-5 h-5 text-emerald-400" />}
  gradient="from-blue-800 to-blue-900"
/>

<AnalyticsStatCard
  title="Tests Taken"
  value="42"
  subtitle="Completed tests"
  icon={<ClipboardCheck className="w-5 h-5 text-sky-400" />}
  gradient="from-blue-800 to-blue-900"
/>

<AnalyticsStatCard
  title="Study Time"
  value="120h"
  subtitle="Total preparation"
  icon={<Clock className="w-5 h-5 text-purple-400" />}
  gradient="from-blue-800 to-blue-900"
/>

 <AnalyticsStatCard
    title="Questions Attempted"
    value={overview.totalQuestionsAttempted}
    icon={<ClipboardList className="w-5 h-5 text-blue-200" />}
    gradient="from-blue-800 to-blue-900"
  />

  <AnalyticsStatCard
    title="Correct Answers"
    value={overview.totalCorrect}
    icon={<CheckCircle className="w-5 h-5 text-emerald-200" />}
    gradient="from-emerald-600 to-emerald-700"
  />

  <AnalyticsStatCard
    title="Wrong Answers"
    value={overview.totalWrong}
    icon={<XCircle className="w-5 h-5 text-red-200" />}
    gradient="from-red-600 to-red-700"
  />

        </div>

        {/* Recent Tests */}
        {recentTests?.length > 0 && (

          <div>

            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Recent Tests
            </h2>

            <div className="space-y-4">

              {recentTests.slice(0, 5).map((test: any) => (

                <Card key={test.sessionId}>

                  <div className="flex justify-between items-center">

                    <div>

                      <p className="font-semibold text-slate-900">
                        {formatSessionType(test.type)}
                      </p>

                      <p className="text-sm text-slate-500">
                        {new Date(test.createdAt).toLocaleDateString("en-IN")}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-semibold text-slate-900">
                        {test.score}/{test.totalQuestions}
                      </p>

                      <p
                        className={`text-sm font-semibold ${
                          test.accuracy >= 75
                            ? "text-green-600"
                            : test.accuracy < 50
                            ? "text-red-600"
                            : "text-amber-500"
                        }`}
                      >
                        {test.accuracy}%
                      </p>

                    </div>

                  </div>

                </Card>

              ))}

            </div>

          </div>

        )}

        {/* Strong + Weak Subjects */}
        <div className="grid md:grid-cols-2 gap-10">

          {/* Weak Subjects */}

          <div>

            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Areas for Improvement
            </h2>

            {weakSubjects?.length === 0 && (
              <p className="text-sm text-slate-500">
                No weak subjects identified.
              </p>
            )}

            {weakSubjects?.map((subject: any) => (

              <Card key={subject.subject}>

                <div className="flex justify-between items-center">

                  <div>

                    <p className="font-semibold text-slate-900">
                      {subject.subject}
                    </p>

                    <p className="text-sm text-red-600">
                      Accuracy {subject.accuracy}%
                    </p>

                  </div>

                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleLearnWithAI(subject.subject, subject.accuracy)
                    }
                  >
                    Learn with AI
                  </Button>

                </div>

              </Card>

            ))}

          </div>

          {/* Strong Subjects */}

          <div>

            <h2 className="text-lg font-semibold text-green-600 mb-4">
              Strong Areas
            </h2>

            {strongSubjects?.length === 0 && (
              <p className="text-sm text-slate-500">
                No strong subjects identified.
              </p>
            )}

            {strongSubjects?.map((subject: any) => (

              <Card key={subject.subject}>

                <div>

                  <p className="font-semibold text-slate-900">
                    {subject.subject}
                  </p>

                  <p className="text-sm text-green-600">
                    Accuracy {subject.accuracy}%
                  </p>

                </div>

              </Card>

            ))}

          </div>

        </div>

      </div>

    </Layout>
  );
}

/* ===============================
   Stat Card
=============================== 

function StatCard({ label, value }: any) {
  return (

    <Card>

      <div className="text-center">

        <p className="text-2xl font-bold text-slate-900">
          {value}
        </p>

        <p className="text-sm text-slate-500 mt-1">
          {label}
        </p>

      </div>

    </Card>

  );
}*/