import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

interface Reminder {
  id: number;
  time: string;
  label: string;
  enabled: boolean;
  days: string[];
}

export default function ReminderTimes() {

  const navigate = useNavigate();
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    loadReminders();
  }, []);

  async function loadReminders() {
    try {

      const res = await API.get("/notification-settings");

      setReminders(res.data.reminderTimes || []);

    } catch (err) {

      console.log("Failed to load reminders");

    }
  }

  async function updateReminders(updated: Reminder[]) {

    try {

      await API.put("/notification-settings", {
        reminderTimes: updated
      });

      setReminders(updated);

    } catch (err) {

      console.log("Failed to update reminders");

    }

  }

  function toggleReminder(id: number) {

    const updated = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );

    updateReminders(updated);
  }

  function deleteReminder(id: number) {

    const updated = reminders.filter((r) => r.id !== id);

    updateReminders(updated);
  }

  return (
    <Layout>

      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Reminder Times
          </h1>

          <p className="text-sm text-slate-500">
            Manage your study reminders
          </p>
        </div>

        <div className="space-y-3">

          {reminders.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No reminders yet
            </div>
          )}

          {reminders.map((reminder) => (

            <div
              key={reminder.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between"
            >

              <div
                className="cursor-pointer"
                onClick={() =>
                  navigate("/settings/add-reminder", {
                    state: { editReminder: reminder },
                  })
                }
              >
                <p className="font-semibold text-lg">
                  {reminder.time}
                </p>

                <p className="text-sm text-slate-500">
                  {reminder.label}
                </p>

                {/* Show days */}
                <p className="text-xs text-slate-400 mt-1">
                  {reminder.days.join(", ")}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <button
                  onClick={() => toggleReminder(reminder.id)}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    reminder.enabled
                      ? "bg-blue-600"
                      : "bg-slate-400"
                  }`}
                >
                  {reminder.enabled ? "On" : "Off"}
                </button>

                <button
                  onClick={() => deleteReminder(reminder.id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

        <button
          onClick={() => navigate("/settings/add-reminder")}
          className="w-full bg-blue-600 text-white py-3 rounded-lg"
        >
          Add New Reminder
        </button>

      </div>

    </Layout>
  );
}