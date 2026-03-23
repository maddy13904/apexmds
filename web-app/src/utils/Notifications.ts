export async function requestNotificationPermission() {

  if (!("Notification" in window)) {
    alert("Browser does not support notifications");
    return;
  }

  if (Notification.permission === "granted") return;

  if (Notification.permission !== "denied") {
    await Notification.requestPermission();
  }
}

export function showNotification(title: string, body: string) {

  if (Notification.permission !== "granted") return;

  new Notification(title, {
    body,
    icon: "/logo192.png"
  });

}