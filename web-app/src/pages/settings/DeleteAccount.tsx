import { useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";
//import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {

  //const { logout } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"warning" | "confirm" | "password">("warning");
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const REQUIRED_PHRASE = "delete my account";

  const dataToDelete = [
    "All profile information and settings",
    "Study progress and analytics",
    "Practice history and answers",
    "Mock test results",
    "Downloaded e-books",
    "Login history and sessions",
    "All custom preferences"
  ];

  function handleConfirm() {
    if (confirmText.trim().toLowerCase() !== REQUIRED_PHRASE) {
      setError('Please type "delete my account" exactly');
      return;
    }

    setError("");
    setStep("password");
  }

  async function handleDelete() {

    if (!password) {
      setError("Please enter your password");
      return;
    }

    try {

      setLoading(true);
      setError("");

      await API.delete("/users/delete-account", {
        data: { password }
      });

      localStorage.clear();
      alert("Your Account has been successfully deleted!")

      navigate("/login");

    } catch (err:any) {

      setError(
        err?.response?.data?.message ||
        "Failed to delete account"
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-red-600">
            Delete Account
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Permanently remove your account and data
          </p>
        </div>


        {/* STEP 1 WARNING */}
        {step === "warning" && (
          <>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">

              <p className="font-semibold text-red-700">
                This action cannot be undone
              </p>

              <p className="text-sm text-red-600 mt-1">
                Deleting your account permanently removes all your data.
              </p>

            </div>


            <div className="bg-white border border-slate-200 rounded-xl p-6">

              <p className="font-semibold text-slate-800 mb-3">
                What will be deleted
              </p>

              <ul className="space-y-2 text-sm text-slate-600">

                {dataToDelete.map((item,i)=>(
                  <li key={i}>
                    • {item}
                  </li>
                ))}

              </ul>

            </div>


            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

              <p className="font-semibold text-blue-800">
                Consider Alternatives
              </p>

              <p className="text-sm text-blue-700 mt-1">
                You may instead change password, update privacy settings,
                or logout from devices.
              </p>

            </div>


            <button
              onClick={()=>setStep("confirm")}
              className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold"
            >
              Continue to Delete Account
            </button>


            <button
              onClick={()=>window.history.back()}
              className="w-full border border-slate-300 py-3 rounded-xl hover:bg-slate-100"
            >
              Cancel
            </button>

          </>
        )}


        {/* STEP 2 CONFIRM TEXT */}
        {step === "confirm" && (
          <>

            <div className="bg-white border border-slate-200 rounded-xl p-6">

              <p className="font-semibold text-slate-800">
                Confirm Account Deletion
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Type <b>delete my account</b> to continue.
              </p>

              <input
                value={confirmText}
                onChange={(e)=>setConfirmText(e.target.value)}
                className="mt-4 w-full border border-slate-300 rounded-lg px-4 py-3 text-sm"
                placeholder="delete my account"
              />

              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {error}
                </p>
              )}

            </div>


            <button
              onClick={handleConfirm}
              disabled={confirmText.trim().toLowerCase() !== REQUIRED_PHRASE}
              className="w-full bg-red-600 text-white py-3 rounded-xl disabled:opacity-40"
            >
              Continue
            </button>


            <button
              onClick={()=>setStep("warning")}
              className="w-full border border-slate-300 py-3 rounded-xl"
            >
              Back
            </button>

          </>
        )}


        {/* STEP 3 PASSWORD */}
        {step === "password" && (
          <>

            <div className="bg-white border border-slate-200 rounded-xl p-6">

              <p className="font-semibold text-slate-800">
                Enter Password
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Enter your password to confirm deletion.
              </p>

              <input
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Enter password"
                className="mt-4 w-full border border-slate-300 rounded-lg px-4 py-3 text-sm"
              />

              {error && (
                <p className="text-red-500 text-sm mt-2">
                  {error}
                </p>
              )}

            </div>


            <button
              onClick={handleDelete}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700"
            >
              {loading ? "Deleting..." : "Delete My Account"}
            </button>


            <button
              onClick={()=>setStep("confirm")}
              className="w-full border border-slate-300 py-3 rounded-xl"
            >
              Back
            </button>

          </>
        )}


        <p className="text-center text-xs text-slate-400">
          Need help? Contact support before deleting your account.
        </p>

      </div>

    </Layout>
  );
}