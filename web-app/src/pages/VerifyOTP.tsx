import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { OTPInput } from "../components/OTPInput";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

export default function VerifyOTP() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(30);

  /* =========================
     TIMER FOR RESEND BUTTON
  ========================== */

  useEffect(() => {

    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);

  }, [timer]);

  /* =========================
     VERIFY OTP
  ========================== */

  async function handleVerify(otp: string) {

    setLoading(true);

    try {

      await API.post("/auth/verify-reset-otp", { email, otp });

      navigate("/reset-password", {
        state: { email, otp }
      });

    } catch {

      alert("Invalid OTP");

    } finally {

      setLoading(false);

    }

  }

  /* =========================
     RESEND OTP
  ========================== */

  async function handleResend() {

    try {

      setResending(true);

      await API.post("/auth/forgot-password", { email });

      setTimer(30);

      alert("OTP resent successfully");

    } catch {

      alert("Failed to resend OTP");

    } finally {

      setResending(false);

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
          Verify OTP
        </h2>

        <p className="text-slate-500 mb-8">
          Enter the 6-digit code sent to your email.
        </p>

        <div className="space-y-8">

          <OTPInput onComplete={handleVerify} />

          {loading && (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-800/30 border-t-blue-800 rounded-full animate-spin" />
            </div>
          )}

          {/* RESEND SECTION */}

          <div className="text-center">

            <p className="text-slate-500 text-sm mb-2">
              Didn't receive the code?
            </p>

            <button
              onClick={handleResend}
              disabled={timer > 0 || resending}
              className="text-sky-600 font-semibold text-sm hover:underline disabled:text-slate-400"
            >

              {resending
                ? "Sending..."
                : timer > 0
                ? `Resend in ${timer}s`
                : "Resend OTP"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}