import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import API from "../../api/api";

export default function Notifications() {

  const [pushEnabled, setPushEnabled] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [quietFrom, setQuietFrom] = useState("22:00");
  const [quietTo, setQuietTo] = useState("08:00");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const res = await API.get("/notification-settings");

      const settings = res.data;

      setPushEnabled(settings.pushEnabled ?? true);
      setStudyReminders(settings.studyReminders ?? true);
      setQuietFrom(settings.quietFrom ?? "22:00");
      setQuietTo(settings.quietTo ?? "08:00");

    } catch {
      console.log("Failed to load notification settings");
    }
  }

  async function saveSettings(newSettings: any) {
    try {
      await API.put("/notification-settings", newSettings);
    } catch {
      console.log("Failed to save settings");
    }
  }

  function togglePush() {

    const newValue = !pushEnabled;

    setPushEnabled(newValue);

    saveSettings({
      pushEnabled: newValue,
      studyReminders,
      quietFrom,
      quietTo
    });
  }

  function toggleStudy() {

    const newValue = !studyReminders;

    setStudyReminders(newValue);

    saveSettings({
      pushEnabled,
      studyReminders: newValue,
      quietFrom,
      quietTo
    });
  }

  function updateQuiet(type: "from" | "to", value: string) {

    if (type === "from") setQuietFrom(value);
    else setQuietTo(value);

    saveSettings({
      pushEnabled,
      studyReminders,
      quietFrom: type === "from" ? value : quietFrom,
      quietTo: type === "to" ? value : quietTo
    });
  }

  return (
    <Layout>

      <div className="max-w-4xl mx-auto space-y-8">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Notifications
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage alerts and reminders
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">

          <h3 className="text-xs font-semibold text-slate-500">
            CHANNELS
          </h3>

          <ToggleRow
            label="Push Notifications"
            description="Receive notifications on your device"
            enabled={pushEnabled}
            onToggle={togglePush}
          />

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">

          <h3 className="text-xs font-semibold text-slate-500">
            STUDY
          </h3>

          <ToggleRow
            label="Study Reminders"
            description="Enable daily reminder notifications"
            enabled={studyReminders}
            onToggle={toggleStudy}
          />

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">

          <h3 className="text-xs font-semibold text-slate-500">
            QUIET HOURS
          </h3>

          <p className="text-sm text-slate-500">
            Notifications will be blocked during this time
          </p>

          <div className="flex gap-6">

            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">
                From
              </label>

              <input
                type="time"
                value={quietFrom}
                onChange={(e) =>
                  updateQuiet("from", e.target.value)
                }
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1">
                To
              </label>

              <input
                type="time"
                value={quietTo}
                onChange={(e) =>
                  updateQuiet("to", e.target.value)
                }
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}

function ToggleRow({ label, description, enabled, onToggle }: any) {

  return (
    <div className="flex justify-between items-center">

      <div>

        <p className="font-medium text-slate-900">
          {label}
        </p>

        <p className="text-sm text-slate-500">
          {description}
        </p>

      </div>

      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition ${
          enabled ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <div
          className={`h-6 w-6 bg-white rounded-full shadow transform transition ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>

    </div>
  );
}