import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function cancelAllReminderNotifications() {

  if (Platform.OS === "web") return;

  await Notifications.cancelAllScheduledNotificationsAsync();

}

export async function scheduleReminderNotification(reminder: any) {

  if (Platform.OS === "web") return [];

  const [hour, minute] = reminder.time.split(":").map(Number);

  const ids: string[] = [];

  const dayMap: any = {
    Sun: 1,
    Mon: 2,
    Tue: 3,
    Wed: 4,
    Thu: 5,
    Fri: 6,
    Sat: 7
  };

  for (let day of reminder.days) {

    const weekdayIndex = dayMap[day];
    if (!weekdayIndex) continue;

    const trigger: any = {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: weekdayIndex,
      hour,
      minute,
      channelId: "default"
    };

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "📚 Study Reminder",
        body: reminder.label,
        sound: true
      },
      trigger
    });

    ids.push(id);

  }

  return ids;

}