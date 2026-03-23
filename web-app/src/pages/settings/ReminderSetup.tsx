import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import API from "../../api/api";

interface Reminder {
  id: number;
  label: string;
  time: string;
  days: string[];
  enabled: boolean;
}

export default function ReminderSetup() {

  const navigate = useNavigate();
  const location = useLocation();

  const editReminder: Reminder | undefined = location.state?.editReminder;

  const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const [label, setLabel] = useState("");
  const [time, setTime] = useState("08:00");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  /* ================================
     PREFILL WHEN EDITING
  ================================= */

  useEffect(() => {
    if (editReminder) {
      setLabel(editReminder.label);
      setTime(editReminder.time);
      setSelectedDays(editReminder.days || []);
    }
  }, [editReminder]);

  /* ================================
     TOGGLE DAY
  ================================= */

  function toggleDay(day: string) {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  }

  /* ================================
     SAVE REMINDER
  ================================= */

  async function saveReminder() {

    if (!label.trim() || selectedDays.length === 0) {
      alert("Enter label and select days");
      return;
    }

    try {

      setSaving(true);

      /* load existing reminders */

      const res = await API.get("/notification-settings");

      let reminders: Reminder[] = res.data?.reminderTimes || [];

      /* remove old reminder if editing */

      if (editReminder) {
        reminders = reminders.filter(
          (r) => r.id !== editReminder.id
        );
      }

      /* create new reminder */

      const newReminder: Reminder = {
        id: editReminder ? editReminder.id : Date.now(),
        label: label.trim(),
        time,
        days: selectedDays,
        enabled: true
      };

      reminders.push(newReminder);

      /* save to backend */

      await API.put("/notification-settings", {
        reminderTimes: reminders
      });

      navigate("/settings/reminder-times");

    } catch (error) {

      console.error("Failed to save reminder", error);
      alert("Failed to save reminder");

    } finally {

      setSaving(false);

    }
  }

  return (
    <Layout>

      <div className="max-w-xl mx-auto space-y-6">

        <h1 className="text-xl font-semibold">
          {editReminder ? "Edit Reminder" : "Add Reminder"}
        </h1>

        <div className="space-y-4">

          {/* LABEL */}

          <div>
            <p className="text-sm text-slate-500 mb-1">
              Reminder Label
            </p>

            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border rounded-lg p-3"
              placeholder="Morning Study"
            />
          </div>

          {/* TIME */}

          <div>
            <p className="text-sm text-slate-500 mb-1">
              Select Time
            </p>

            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* DAYS */}

          <div>
            <p className="text-sm text-slate-500 mb-2">
              Repeat On
            </p>

            <div className="flex flex-wrap gap-2">

              {weekDays.map((day) => {

                const active = selectedDays.includes(day);

                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1 rounded-md text-sm transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 hover:bg-slate-300"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}

            </div>
          </div>

        </div>

        {/* SAVE BUTTON */}

        <button
          onClick={saveReminder}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : editReminder
            ? "Update Reminder"
            : "Save Reminder"}
        </button>

      </div>

    </Layout>
  );
}