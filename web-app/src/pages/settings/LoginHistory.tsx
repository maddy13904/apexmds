import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";

interface LoginEntry {
  _id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

export default function LoginHistory() {

  const [history, setHistory] = useState<LoginEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const res = await API.get("/auth/login-history");
      setHistory(res.data);
    } catch (err) {
      console.log("Failed to load login history");
    } finally {
      setLoading(false);
    }
  }

  function formatDevice(userAgent: string) {

    if (userAgent.includes("Chrome")) return "Chrome Browser";
    if (userAgent.includes("Firefox")) return "Firefox Browser";
    if (userAgent.includes("Safari")) return "Safari Browser";

    return "Unknown Device";
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  return (
    <Layout>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Login History
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Review recent access to your account
          </p>
        </div>


        {/* CONTENT */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">

          {loading && (
            <div className="p-8 text-slate-500">
              Loading login history...
            </div>
          )}

          {!loading && history.length === 0 && (
            <div className="p-8 text-slate-500">
              No login activity found.
            </div>
          )}

          {!loading && history.map((entry) => (

            <div
              key={entry._id}
              className="px-6 py-5 border-b border-slate-200 last:border-none flex justify-between items-center"
            >

              <div>

                <p className="font-medium text-slate-900">
                  {formatDevice(entry.userAgent)}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  IP: {entry.ipAddress}
                </p>

              </div>

              <div className="text-sm text-slate-500">
                {formatDate(entry.createdAt)}
              </div>

            </div>

          ))}

        </div>

      </div>

    </Layout>
  );
}