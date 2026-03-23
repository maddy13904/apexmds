import { useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {

  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {

      setLoading(true);

      await API.put("/users/change-password", {
        currentPassword,
        newPassword
      });

      alert("Password changed successfully");

      navigate("/profile");

    } catch (err: any) {

      const message =
        err?.response?.data?.message ||
        "Failed to change password";

      alert(message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Change Password
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Update your account password for better security
          </p>
        </div>


        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6"
        >

          {/* CURRENT PASSWORD */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="mt-2 w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          {/* NEW PASSWORD */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="mt-2 w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Confirm New Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-2 w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>


          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-4 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-slate-800 transition"
            >
              {loading ? "Updating..." : "Change Password"}
            </button>

          </div>

        </form>

      </div>

    </Layout>
  );
}