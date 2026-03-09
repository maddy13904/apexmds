import { useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";
import jsPDF from "jspdf";

export default function DownloadData() {

  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState("");

  const dataCategories = [
    {
      title: "Profile Information",
      description: "Name, email, and account details"
    },
    {
      title: "Study Progress",
      description: "Completed topics and progress stats"
    },
    {
      title: "Practice History",
      description: "Attempted questions and answers"
    },
    {
      title: "Mock Test Results",
      description: "Mock scores and analytics"
    },
    {
      title: "Downloaded E-Books",
      description: "List of saved study materials"
    },
    {
      title: "Analytics Data",
      description: "Performance insights"
    }
  ];


  async function handleDownload() {

  setLoading(true);
  setError("");
  setComplete(false);

  try {

    const profileRes = await API.get("/users/me");
    const analyticsRes = await API.get("/analytics/global");

    const profile = profileRes.data.user;
    const analytics = analyticsRes.data;

    const downloaded =
      JSON.parse(localStorage.getItem("downloadedBooks") || "[]");

    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(18);
    doc.text("ApexMDS Data Export", 10, y);

    y += 10;

    doc.setFontSize(14);
    doc.text("Profile Information", 10, y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`Name: ${profile.name}`, 10, y);
    y += 6;
    doc.text(`Email: ${profile.email}`, 10, y);
    y += 6;
    doc.text(`Role: ${profile.role}`, 10, y);

    y += 10;

    doc.setFontSize(14);
    doc.text("Performance Overview", 10, y);
    y += 8;

    doc.setFontSize(11);
    doc.text(`Total Tests: ${analytics.overview.totalTests}`, 10, y);
    y += 6;
    doc.text(`Questions Attempted: ${analytics.overview.totalQuestionsAttempted}`, 10, y);
    y += 6;
    doc.text(`Correct Answers: ${analytics.overview.totalCorrect}`, 10, y);
    y += 6;
    doc.text(`Wrong Answers: ${analytics.overview.totalWrong}`, 10, y);
    y += 6;
    doc.text(`Accuracy: ${analytics.overview.overallAccuracy}%`, 10, y);

    y += 10;

    doc.setFontSize(14);
    doc.text("Strong Subjects", 10, y);
    y += 8;

    analytics.strongSubjects.forEach((s: any) => {
      doc.text(`• ${s.subject} (${s.accuracy}%)`, 10, y);
      y += 6;
    });

    y += 5;

    doc.setFontSize(14);
    doc.text("Weak Subjects", 10, y);
    y += 8;

    analytics.weakSubjects.forEach((s: any) => {
      doc.text(`• ${s.subject} (${s.accuracy}%)`, 10, y);
      y += 6;
    });

    y += 5;

    doc.setFontSize(14);
    doc.text("Recent Tests", 10, y);
    y += 8;

    analytics.recentTests.forEach((t: any) => {
      doc.text(`• ${t.type} - ${t.score}/${t.totalQuestions} (${t.accuracy}%)`, 10, y);
      y += 6;
    });

    y += 5;

    doc.setFontSize(14);
    doc.text("Downloaded E-Books", 10, y);
    y += 8;

    downloaded.forEach((b: any) => {
      doc.text(`• ${b.title}`, 10, y);
      y += 6;
    });

    y += 10;

    doc.text(`Generated: ${new Date().toLocaleString()}`, 10, y);

    doc.save("ApexMDS_Data_Export.pdf");

    setComplete(true);

  } catch (err) {

    console.error(err);
    setError("Failed to generate export file.");

  } finally {

    setLoading(false);

  }

}


  return (
    <Layout>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Download Your Data
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Export all your ApexMDS data
          </p>
        </div>


        {/* INFO CARD */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

          <p className="font-semibold text-blue-900">
            Your Data Package
          </p>

          <p className="text-sm text-blue-700 mt-1">
            We will compile all your learning data into a downloadable file.
          </p>

        </div>


        {/* INCLUDED DATA */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">

          <p className="text-xs font-semibold text-slate-500">
            INCLUDED IN EXPORT
          </p>

          {dataCategories.map((item, i)=>(
            <div
              key={i}
              className="border border-slate-200 rounded-lg p-4"
            >
              <p className="font-medium text-slate-800">
                {item.title}
              </p>

              <p className="text-sm text-slate-500">
                {item.description}
              </p>
            </div>
          ))}

        </div>


        {/* PRIVACY NOTICE */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">

          <p className="font-semibold text-amber-800">
            Privacy Notice
          </p>

          <p className="text-sm text-amber-700 mt-1">
            Your data export will only be accessible to you.
          </p>

        </div>


        {/* SUCCESS */}
        {complete && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">

            <p className="font-semibold text-emerald-800">
              Download Complete
            </p>

            <p className="text-sm text-emerald-700">
              Your data export has been generated.
            </p>

          </div>
        )}


        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-5">

            <p className="font-semibold text-red-800">
              Error
            </p>

            <p className="text-sm text-red-700">
              {error}
            </p>

          </div>
        )}


        {/* DOWNLOAD BUTTON */}
        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          {loading ? "Generating..." : "Download My Data"}
        </button>


        <p className="text-center text-xs text-slate-400">
          Estimated file size: 2-5MB
        </p>

      </div>

    </Layout>
  );
}