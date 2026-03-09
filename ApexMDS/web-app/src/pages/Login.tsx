import { useState } from "react";
import { Mail, Lock, ArrowRight, Activity } from "lucide-react";
import { AuthInput } from "../components/AuthInput";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {

  e.preventDefault();
  setIsLoading(true);

  try {

    await login(emailOrPhone, password);
    navigate("/");

  } catch (err: any) {

    const message = err?.response?.data?.message;
    console.log(err.response?.data);

    if (message?.toLowerCase().includes("user")) {
      alert("No user found. Please register to login.");
    } 
    else if (message?.toLowerCase().includes("password") || message?.toLowerCase().includes("credential")) {
      alert("Invalid credentials");
    } 
    else {
      alert(message || "Login failed");
    }

  } finally {

    setIsLoading(false);

  }

}

  return (

    <div className="min-h-screen bg-slate-50 flex flex-col px-6 py-12">

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">

        {/* Logo / Header */}
        <div className="text-center mb-10">

          <div className="w-16 h-16 bg-blue-800 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900">
            Welcome Back
          </h2>

          <p className="text-slate-500 mt-2">
            Sign in to continue your prep
          </p>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          <AuthInput
            label="Email or Phone"
            type="text"
            placeholder="Enter your email"
            icon={<Mail className="w-5 h-5" />}
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />

          <AuthInput
            label="Password"
            type="password"
            placeholder="Enter your password"
            icon={<Lock className="w-5 h-5" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm font-medium text-sky-600 hover:text-sky-700"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-800/20 hover:bg-blue-900 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >

            {isLoading ? (

              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />

            ) : (

              <>
                Login <ArrowRight className="w-5 h-5" />
              </>

            )}

          </button>

        </form>

        {/* Register */}
        <div className="mt-8 text-center">

          <p className="text-slate-500">

            Don't have an account?{" "}

            <button
              onClick={() => navigate("/register")}
              className="text-blue-800 font-bold hover:underline"
            >
              Register
            </button>

          </p>

        </div>

      </div>

    </div>
  );
}