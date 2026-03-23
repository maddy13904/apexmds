import cron from "node-cron";
import NotificationSettings from "../models/NotificationSettings.js";
import User from "../models/User.js";
import { sendPushNotification } from "./pushNotification.js";

function convertToMinutes(time) {

  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;

}

function isQuietHours(now, start, end) {

  const current = convertToMinutes(now);
  const startMin = convertToMinutes(start);
  const endMin = convertToMinutes(end);

  if (startMin < endMin) {
    return current >= startMin && current <= endMin;
  }

  return current >= startMin || current <= endMin;

}

export const startReminderScheduler = () => {

  cron.schedule("* * * * *", async () => {

    try {

      const now = new Date();

      const currentTime =
        now.getHours().toString().padStart(2, "0") +
        ":" +
        now.getMinutes().toString().padStart(2, "0");

      const settingsList = await NotificationSettings.find();

      for (const settings of settingsList) {

        /* =====================
           STUDY REMINDERS OFF
        ===================== */

        if (!settings.studyRemindersEnabled) continue;

        /* =====================
           PUSH NOTIFICATIONS OFF
        ===================== */

        if (!settings.pushNotificationsEnabled) continue;

        /* =====================
           QUIET HOURS CHECK
        ===================== */

        if (
          isQuietHours(
            currentTime,
            settings.quietHoursStart,
            settings.quietHoursEnd
          )
        )
          continue;

        /* =====================
           REMINDER TIME MATCH
        ===================== */

        if (!settings.reminderTimes.includes(currentTime)) continue;

        const user = await User.findById(settings.userId);

        if (!user) continue;

        if (!user.expoPushToken) continue;

await sendPushNotification(
  user.expoPushToken,
  "📚 Study Reminder",
  "Time to revise your NEET MDS topics!"
);

        /* =====================
           HERE WE SEND NOTIFICATION
        ===================== */

      }

    } catch (err) {

      console.log("Reminder scheduler error:", err);

    }

  });

};