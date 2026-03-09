import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

interface User {
  name: string;
  email: string;
  role: string;
}

export default function Profile() {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await API.get("/users/me");
      setUser(res.data.user);
    } catch (err) {
      console.log("Profile load failed");
    } finally {
      setLoading(false);
    }
  }

  function avatar(name: string) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=1e3a8a&color=fff&size=128`;
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-80 text-slate-500">
          Loading profile...
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="text-red-500">Unable to load profile</div>
      </Layout>
    );
  }

  const roleLower = user.role.toLowerCase();
  
  const displayName =
  roleLower === "doctor" || roleLower === "intern"
    ? `Dr. ${user.name}`
    : user.name;


  return (
    <Layout>

      <div className="max-w-6xl mx-auto space-y-8">

        {/* PAGE HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Profile & Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* PROFILE CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">

            <div className="flex flex-col items-center text-center">

              <img
                src={avatar(displayName)}
                className="w-24 h-24 rounded-full mb-4 border border-slate-200"
              />

              <h2 className="text-lg font-semibold text-slate-900">
                {displayName}
              </h2>

              <p className="text-sm text-slate-500">
                {user.email}
              </p>

            </div>

            <div className="border-t mt-6 pt-6 text-center">

              <p className="text-xs text-slate-400">
                Account Role
              </p>

              <p className="text-sm font-medium text-slate-700 mb-6">
                {user.role}
              </p>

              <button
                onClick={logout}
                className="w-full bg-red-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 transition"
              >
                Logout
              </button>

            </div>

          </div>


          {/* SETTINGS MENU */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <SettingsItem
              title="Edit Profile"
              description="Update your personal details"
              link="/settings/edit-profile"
            />

            <SettingsItem
              title="Login History"
              description="View recent account activity"
              link="/settings/login-history"
            />

            <SettingsItem
              title="Change Password"
              description="Update your account password"
              link="/settings/change-password"
            />

            <SettingsItem
              title="Notifications"
              description="Manage reminder and system notifications"
              link="/settings/notifications"
            />

            <SettingsItem
              title="App Settings"
              description="Customize your app preferences"
              link="/settings/app-settings"
            />

            <SettingsItem
              title="Download Your Data"
              description="Export your learning data"
              link="/settings/download-data"
            />

            <SettingsItem
              title="Delete Account"
              description="Permanently delete your account"
              link="/settings/delete-account"
              danger
            />

          </div>

        </div>

      </div>

    </Layout>
  );
}


/* ======================================
SETTINGS MENU ITEM
====================================== */

function SettingsItem({
  title,
  description,
  link,
  danger
}: any) {

  return (
    <Link
      to={link}
      className={`flex justify-between items-center px-6 py-5 border-b border-slate-200 last:border-none transition hover:bg-slate-50`}
    >

      <div>

        <h3
          className={`font-medium ${
            danger ? "text-red-600" : "text-slate-900"
          }`}
        >
          {title}
        </h3>

        <p className="text-sm text-slate-500 mt-1">
          {description}
        </p>

      </div>

      <span className="text-slate-400 text-xl">
        ›
      </span>

    </Link>
  );
}