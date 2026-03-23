import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function DailyStudyGoal() {

  const navigate = useNavigate();

  const [weakSubjects, setWeakSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeakSubjects();
  }, []);

  async function loadWeakSubjects() {
    try {

      const res = await API.get("/analytics/global");

      const sorted =
        (res.data.weakSubjects || []).sort(
          (a: any, b: any) => a.accuracy - b.accuracy
        );

      setWeakSubjects(sorted);

    } catch (err) {
      console.log("Failed to load weak subjects");
    } finally {
      setLoading(false);
    }
  }

  function handleLearnWithAI(subject: string, accuracy: number) {

    const prompt = `
I am preparing for NEET MDS.

My weak subject is ${subject}.
My current accuracy is ${accuracy}%.

Create a structured improvement plan including:
1. Core concepts to master
2. Common mistakes
3. High-yield exam traps
4. Rapid revision bullets
5. How to improve to 75%+
`;

    navigate("/ai-tutor", { state: { prompt } });
  }

  const highPriorityCount =
    weakSubjects.filter((s) => s.accuracy < 50).length;

  return (
    <Layout>

      <div className="max-w-5xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Daily Study Plan
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            AI-recommended focus areas for today
          </p>
        </div>


        {/* STATS CARD */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex justify-between items-center">

          <div>

            <p className="text-sm text-slate-500">
              Focus Subjects Today
            </p>

            <p className="text-3xl font-bold text-blue-600">
              {weakSubjects.length}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {highPriorityCount} high priority
            </p>

          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            📊
          </div>

        </div>


        {/* SMART TIP */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

          <p className="font-semibold text-blue-800">
            Smart Study Tip
          </p>

          <p className="text-sm text-blue-700 mt-1">
            Start with lowest accuracy subjects first for maximum score improvement.
          </p>

        </div>


        {/* SUBJECT LIST */}
        <div className="space-y-4">

          <p className="text-xs font-semibold text-slate-500">
            TODAY'S FOCUS AREAS
          </p>

          {loading && (
            <p className="text-slate-500">
              Loading study plan...
            </p>
          )}

          {!loading && weakSubjects.length === 0 && (
            <p className="text-center text-slate-500">
              No weak subjects found 🎉
            </p>
          )}

          {weakSubjects.map((subject) => (

            <div
              key={subject.subject}
              className={`bg-white border rounded-xl p-5 flex justify-between items-center ${
                subject.accuracy < 50
                  ? "border-red-200"
                  : "border-slate-200"
              }`}
            >

              <div>

                <p className="font-semibold text-slate-800">
                  {subject.subject}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Accuracy: {subject.accuracy}%
                </p>

                <span
                  className={`text-xs px-2 py-1 rounded-md mt-2 inline-block ${
                    subject.accuracy < 50
                      ? "bg-red-100 text-red-600"
                      : "bg-amber-100 text-amber-600"
                  }`}
                >
                  {subject.accuracy < 50
                    ? "High Priority"
                    : "Needs Revision"}
                </span>

              </div>


              <button
                onClick={() =>
                  handleLearnWithAI(
                    subject.subject,
                    subject.accuracy
                  )
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
              >
                Learn with AI
              </button>

            </div>

          ))}

        </div>


        <p className="text-center text-xs text-slate-400">
          Your study plan updates automatically based on performance.
        </p>

      </div>

    </Layout>
  );
}