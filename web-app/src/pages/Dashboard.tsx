import { useEffect, useState } from "react";
import API from "../api/api";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import Avatar from "../components/Avatar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  DocumentTextIcon,
  ClockIcon,
  PencilSquareIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

interface StudyPlan {
  focusSubject: string;
  focusAccuracy: number;
  recommendedQuestions: number;
  recommendedTimeMinutes: number;
  aiPrompt: string;
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const profileRes = await API.get("/users/me");
      setUser(profileRes.data.user);

      const planRes = await API.get("/analytics/study-plan");
      setStudyPlan(planRes.data);
    } catch (err) {
      console.log("Dashboard load error");
    } finally {
      setLoading(false);
    }
  }

  const isWeak = studyPlan?.focusAccuracy && studyPlan.focusAccuracy < 50;

  return (
    <Layout>
      <div className="space-y-10">

        {/* Welcome */}
        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user?.name || "Student"}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Your personalized AI-driven study dashboard
            </p>
          </div>

          <Avatar name={user?.name} size={40} />

        </div>

        {/* Study Plan */}
        <Card>

          {loading ? (
            <p className="text-slate-500">Loading study plan...</p>
          ) : studyPlan ? (
            <>
              <div className="flex items-center justify-between mb-6">

                <h2 className="text-lg font-semibold text-slate-900">
                  Today's AI Focus
                </h2>

                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    isWeak
                      ? "bg-red-100 text-red-600"
                      : "bg-emerald-100 text-emerald-600"
                  }`}
                >
                  {isWeak ? "Focus Required" : "On Track"}
                </span>

              </div>

              <div className="grid md:grid-cols-2 gap-6">

                {/* Subject */}
                <div className="border border-slate-200 rounded-lg p-5">

                  <p className="text-sm text-slate-500">
                    Subject Focus
                  </p>

                  <h3 className="text-lg font-semibold text-slate-900 mt-1">
                    {studyPlan.focusSubject}
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    Accuracy: {studyPlan.focusAccuracy}% • {studyPlan.recommendedTimeMinutes} mins
                  </p>

                  <div className="mt-4">
                    <Button
                      onClick={() =>
                        navigate("/ai-tutor", {
                          state: { prompt: studyPlan.aiPrompt }
                        })
                      }
                    >
                      Learn with AI
                    </Button>
                  </div>

                </div>

                {/* Practice */}
                <div className="border border-slate-200 rounded-lg p-5">

                  <p className="text-sm text-slate-500">
                    Practice
                  </p>

                  <h3 className="text-lg font-semibold text-slate-900 mt-1">
                    {studyPlan.recommendedQuestions} Questions
                  </h3>

                  <p className="text-sm text-slate-500 mt-2">
                    Strengthen weak concepts
                  </p>

                  <div className="mt-4">
                    <Button
                      onClick={() =>
  navigate("/daily-quiz", {
    state: { subject: studyPlan.focusSubject }
  })
}
                    >
                      Start Practice
                    </Button>
                  </div>

                </div>

              </div>
            </>
          ) : (
            <p className="text-slate-500">
              Complete a test to generate your AI study plan.
            </p>
          )}

        </Card>

        {/* Quick Access */}
        <div>

          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Quick Access
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

  <FeatureCard
    title="Previous Papers"
    icon={DocumentTextIcon}
    color="#F59E0B"
    bg="#FEF3C7"
    onClick={() => navigate("/previous-papers")}
  />

  <FeatureCard
    title="Mock Test"
    icon={ClockIcon}
    color="#E11D48"
    bg="#FFE4E6"
    onClick={() => navigate("/mock-tests")}
  />

  <FeatureCard
    title="Daily Quiz"
    icon={PencilSquareIcon}
    color="#059669"
    bg="#D1FAE5"
    onClick={() => navigate("/daily-quiz")}
  />

  <FeatureCard
    title="E-Books"
    icon={BookOpenIcon}
    color="#7C3AED"
    bg="#EDE9FE"
    onClick={() => navigate("/ebooks")}
  />

  <FeatureCard
    title="AI Tutor"
    icon={ChatBubbleLeftRightIcon}
    color="#0284C7"
    bg="#DBEAFE"
    onClick={() => navigate("/ai-tutor")}
  />

  <FeatureCard
    title="Analytics"
    icon={ChartBarIcon}
    color="#4F46E5"
    bg="#DBEAFE"
    onClick={() => navigate("/analytics")}
  />

</div>

        </div>

      </div>
    </Layout>
  );
}

function FeatureCard({ title, icon: Icon, color, bg, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer p-5 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      style={{ backgroundColor: bg }}
    >
      <div className="flex flex-col items-center text-center">

        {/* ICON */}
        <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition">
          <Icon className="w-6 h-6" style={{ color }} />
        </div>

        {/* TITLE */}
        <h3 className="font-semibold text-slate-900 mt-3">
          {title}
        </h3>

        {/* SUBTEXT */}
        <p className="text-xs text-slate-500 mt-1">
          Access {title.toLowerCase()} module
        </p>

      </div>
    </div>
  );
}