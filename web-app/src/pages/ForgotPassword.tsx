import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthInput } from "../components/AuthInput";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {

    e.preventDefault();
    setIsLoading(true);

    try {

      await API.post("/auth/forgot-password", { email });

      navigate("/verify-otp", {
        state: { email }
      });

    } catch (err) {

      alert("Failed to send OTP");

    } finally {

      setIsLoading(false);

    }

  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col px-6 py-12">

      <button
        onClick={() => navigate("/login")}
        className="self-start p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full mb-8"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 max-w-md mx-auto w-full">

        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Forgot Password
        </h2>

        <p className="text-slate-500 mb-8">
          Enter your email address and we'll send you a code to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <AuthInput
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            icon={<Mail className="w-5 h-5" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-800/20 hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Send OTP"
            )}
          </button>

        </form>

      </div>
    </div>
  );
}