import { showNotification } from "./Notifications";
import API from "../api/api";

const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

let reminders: any[] = [];

const triggered = new Set<number>();
let lastMinute = -1;

/* load reminders from backend */
async function loadReminders() {

  try {

    const res = await API.get("/notification-settings");

    reminders = res.data.reminderTimes || [];

    console.log("Reminders loaded:", reminders);

  } catch (err) {

    console.log("Failed to load reminders", err);

  }

}

export async function reloadReminders() {
  await loadReminders();
}

export async function startReminderEngine() {

  await loadReminders();

  /* reload reminders every 60 seconds */
  setInterval(loadReminders, 60000);

  /* check reminders every 5 seconds */
  setInterval(() => {

    const now = new Date();

    console.log("Checking reminders at:", now.toLocaleTimeString());

    if (!reminders.length) return;

    const currentDay = weekDays[now.getDay()];
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    /* reset duplicate tracker each minute */
    if (currentMinute !== lastMinute) {
      triggered.clear();
      lastMinute = currentMinute;
    }

    reminders.forEach((reminder: any) => {

      if (!reminder.enabled) return;

      if (!reminder.days.includes(currentDay)) return;

      const [h, m] = reminder.time.split(":");

      if (
        currentHour === parseInt(h) &&
        currentMinute === parseInt(m)
      ) {

        if (triggered.has(reminder.id)) return;

        triggered.add(reminder.id);

        console.log("Triggering reminder:", reminder);

        showNotification(
          "📚 Study Reminder",
          reminder.label
        );

      }

    });

  }, 5000);

}