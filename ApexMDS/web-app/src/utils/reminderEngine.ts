import { showNotification } from "./Notifications";

const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export function startReminderEngine() {

  setInterval(() => {

    const saved = localStorage.getItem("reminders");
    if (!saved) return;

    const reminders = JSON.parse(saved);

    const now = new Date();

    const currentDay = weekDays[now.getDay()];

    const currentTime =
      now.toTimeString().slice(0,5); // HH:MM

    reminders.forEach((reminder: any) => {

      if (!reminder.enabled) return;

      if (!reminder.days.includes(currentDay)) return;

      if (reminder.time === currentTime) {

        showNotification(
          "📚 Study Reminder",
          reminder.label
        );

      }

    });

  }, 60000); // every minute
}