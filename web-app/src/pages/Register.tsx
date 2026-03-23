import { useState } from "react";
import { Mail, Lock, User, Phone, Briefcase, ArrowRight } from "lucide-react";
import { AuthInput } from "../components/AuthInput";
import { OTPInput } from "../components/OTPInput";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Register() {

  const navigate = useNavigate();

  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  //const [otp, setOtp] = useState("");

  const [showPassword] = useState(false);

  /* ======================
     PASSWORD VALIDATION
  ====================== */

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&#]/.test(password)
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  function PasswordRule({ valid, label }: any) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className={valid ? "text-green-600" : "text-red-600"}>
          {valid ? "✔" : "✖"}
        </span>
        <span className={valid ? "text-green-600" : "text-red-600"}>
          {label}
        </span>
      </div>
    );
  }

  /* ======================
     SUBMIT DETAILS
  ====================== */

  async function handleDetailsSubmit(e: React.FormEvent) {

    e.preventDefault();

    if (!name || !email || !phone || !password || !role) {
      alert("Please fill all fields");
      return;
    }

    if (!isPasswordValid) {
      alert("Password does not meet requirements");
      return;
    }

    try {

      setLoading(true);

      await API.post("/auth/register", {
        name,
        email,
        phone,
        role,
        password
      });

      setStep("otp");

    } catch (error: any) {

      alert(error?.response?.data?.message || "Registration failed");

    } finally {

      setLoading(false);

    }

  }

  /* ======================
     VERIFY OTP
  ====================== */

  async function handleVerifyOtp(code: string) {

    try {

      setLoading(true);

      await API.post("/auth/verify-email", {
        email,
        otp: code
      });

      alert("Registration successful");

      navigate("/login");

    } catch (error: any) {

      alert(error?.response?.data?.message || "OTP verification failed");

    } finally {

      setLoading(false);

    }

  }

  /* ======================
     UI
  ====================== */

  return (

    <div className="min-h-screen bg-slate-50 flex flex-col px-6 py-12">

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">

        {/* Title */}

        <div className="text-center mb-8">

          <h2 className="text-3xl font-bold text-slate-900">

            {step === "details" ? "Create Account" : "Verify Email"}

          </h2>

          <p className="text-slate-500 mt-2">

            {step === "details"
              ? "Start your journey to success today"
              : "Enter the 6-digit code sent to your email"}

          </p>

        </div>

        {/* STEP 1 — DETAILS */}

        {step === "details" && (

          <form onSubmit={handleDetailsSubmit} className="space-y-5">

            <AuthInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={<User className="w-5 h-5" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <AuthInput
              label="Role"
              type="text"
              placeholder="Doctor / Student / Intern"
              icon={<Briefcase className="w-5 h-5" />}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />

            <AuthInput
              label="Email"
              type="email"
              placeholder="john@email.com"
              icon={<Mail className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <AuthInput
              label="Phone"
              type="text"
              placeholder="10 digit number"
              icon={<Phone className="w-5 h-5" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <AuthInput
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              icon={<Lock className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* PASSWORD RULES */}

            <div className="space-y-1">

              <PasswordRule valid={passwordChecks.length} label="At least 8 characters" />
              <PasswordRule valid={passwordChecks.uppercase} label="One uppercase letter" />
              <PasswordRule valid={passwordChecks.lowercase} label="One lowercase letter" />
              <PasswordRule valid={passwordChecks.number} label="One number" />
              <PasswordRule valid={passwordChecks.special} label="One special character" />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-800/20 hover:bg-blue-900 transition flex items-center justify-center gap-2"
            >

              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continue <ArrowRight className="w-5 h-5" />
                </>
              )}

            </button>

          </form>

        )}

        {/* STEP 2 — OTP */}

        {step === "otp" && (

          <div className="space-y-6">

            <OTPInput onComplete={handleVerifyOtp} />

            {loading && (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-800/30 border-t-blue-800 rounded-full animate-spin" />
              </div>
            )}

          </div>

        )}

        {/* LOGIN LINK */}

        <div className="mt-8 text-center">

          <p className="text-slate-500">

            Already have an account?{" "}

            <button
              onClick={() => navigate("/login")}
              className="text-blue-800 font-bold hover:underline"
            >
              Login
            </button>

          </p>

        </div>

      </div>

    </div>

  );

}