import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";

export default function AppSettings() {

  const { logout } = useAuth();

  async function handleLogout() {
    await logout();
    localStorage.removeItem("ai_chat_history");
  }

  return (
    <Layout>

      <div className="max-w-4xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            App Settings
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Customize your study experience
          </p>
        </div>


        {/* STUDY PREFERENCES */}
        <Section title="Study Preferences">

          <MenuItem
            label="Daily Study Goal"
            description="Set your daily study target"
            link="/settings/daily-study-goal"
          />

          <Divider />

          <MenuItem
            label="Reminder Times"
            description="Configure study reminder schedule"
            link="/settings/reminder-times"
          />

        </Section>


        {/* DATA & STORAGE */}
        <Section title="Data & Storage">

          <MenuItem
            label="Downloaded E-Books"
            description="Manage offline study material"
            link="/settings/downloaded-ebooks"
          />

        </Section>


        {/* ABOUT */}
        <Section title="About">

          <MenuItem
            label="About ApexMDS"
            description="Learn more about the platform"
            link="/about"
          />

          <Divider />

          <MenuItem
            label="Terms of Service"
            description="Read our terms and conditions"
            link="/terms"
          />

          <Divider />

          <MenuItem
            label="Privacy Policy"
            description="View how your data is handled"
            link="/privacy"
          />

          <Divider />

          <div className="flex justify-between items-center p-5">
            <span className="text-sm font-medium text-slate-700">
              App Version
            </span>

            <span className="text-sm text-slate-500 font-mono">
              1.0.0
            </span>
          </div>

        </Section>


        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 border border-red-200 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition"
        >
          Logout
        </button>

      </div>

    </Layout>
  );
}



/* ===============================
Reusable Components
=============================== */

function Section({ title, children }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

      <div className="bg-slate-50 border-b border-slate-200 px-5 py-2">
        <h3 className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
          {title}
        </h3>
      </div>

      {children}

    </div>
  );
}

function MenuItem({ label, description, link }: any) {
  return (
    <Link
      to={link}
      className="flex justify-between items-center p-5 hover:bg-slate-50 transition"
    >

      <div>
        <p className="font-medium text-slate-800">
          {label}
        </p>

        <p className="text-sm text-slate-500">
          {description}
        </p>
      </div>

      <span className="text-slate-400 text-lg">
        ›
      </span>

    </Link>
  );
}

function Divider() {
  return (
    <div className="border-t border-slate-200"></div>
  );
}