import { useState } from "react";
import { Lock, ArrowLeft } from "lucide-react";
import { AuthInput } from "../components/AuthInput";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

export default function ResetPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {

      await API.post("/auth/reset-password", {
        email,
        newPassword
      });

      alert("Password reset successful");

      navigate("/login");

    } catch {

      alert("Reset failed");

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="min-h-screen bg-slate-50 flex flex-col px-6 py-12">

      <button
        onClick={() => navigate(-1)}
        className="self-start p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full mb-8"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 max-w-md mx-auto w-full">

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Reset Password
        </h2>

        <p className="text-slate-500 mb-8">
          Create a new strong password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <AuthInput
            label="New Password"
            type="password"
            placeholder="Min. 8 characters"
            icon={<Lock className="w-5 h-5" />}
            value={newPassword}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="Re-enter password"
            icon={<Lock className="w-5 h-5" />}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-800/20 hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >

            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Reset Password"
            )}

          </button>

        </form>

      </div>

    </div>

  );

}