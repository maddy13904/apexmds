import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const res = await API.get("/users/me");
      setName(res.data.user.name);
      setEmail(res.data.user.email);
      setRole(res.data.user.role)
    } catch (err) {
      console.log("Profile load failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);

      await API.put("/users/me", {
        name,
        role
      });

      alert("Profile updated successfully");

      navigate("/profile");

    } catch (err) {
      console.log("Update failed");
      alert("Failed to update profile");
    } finally {
      setSaving(false);
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

  return (
    <Layout>

      <div className="max-w-3xl mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Edit Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Update your personal information
          </p>
        </div>


        {/* PROFILE FORM */}
        <form
          onSubmit={handleSave}
          className="bg-white border border-slate-200 rounded-2xl p-8 space-y-6"
        >

          {/* AVATAR */}
          <div className="flex flex-col items-center">

            <img
              src={avatar(name)}
              className="w-24 h-24 rounded-full border border-slate-200"
            />

            <p className="text-xs text-slate-500 mt-2">
              Avatar generated from your name
            </p>

          </div>


          {/* NAME */}
          <div>

            <label className="text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

          </div>


          {/* EMAIL (READ ONLY) */}
          <div>

            <label className="text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              disabled
              className="mt-2 w-full border border-slate-200 bg-slate-50 rounded-lg px-4 py-2 text-sm text-slate-500"
            />

            <p className="text-xs text-slate-400 mt-1">
              Email cannot be changed
            </p>

          </div>

          <div>

            <label className="text-sm font-medium text-slate-700">
              Role
            </label>

            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
              disabled={saving}
              className="px-6 py-2 text-sm bg-blue-700 text-white rounded-lg hover:bg-slate-800 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </Layout>
  );
}