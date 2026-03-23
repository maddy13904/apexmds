import NotificationSettings from "../../models/NotificationSettings.js";

export const getNotificationSettings = async (req, res) => {

  try {

    let settings = await NotificationSettings.findOne({
      userId: req.user.id
    });

    // If not found create default settings
    if (!settings) {

      settings = await NotificationSettings.create({
        userId: req.user.id
      });

    }

    res.json(settings);

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

};


export const updateNotificationSettings = async (req, res) => {

  try {

    const userId = req.user.id;

    let settings = await NotificationSettings.findOne({ userId });

    if (!settings) {
      settings = new NotificationSettings({ userId });
    }

    const {
      pushEnabled,
      studyReminders,
      quietFrom,
      quietTo,
      reminderTimes
    } = req.body;

    if (pushEnabled !== undefined)
      settings.pushEnabled = pushEnabled;

    if (studyReminders !== undefined)
      settings.studyReminders = studyReminders;

    if (quietFrom !== undefined)
      settings.quietFrom = quietFrom;

    if (quietTo !== undefined)
      settings.quietTo = quietTo;

    if (reminderTimes !== undefined)
      settings.reminderTimes = reminderTimes;

    await settings.save();

    res.json(settings);

  } catch (error) {

    console.error("Notification settings update error:", error);

    res.status(500).json({
      message: "Failed to update notification settings"
    });

  }

};


export const savePushToken = async (req, res) => {

  try {

    const { token } = req.body;

    await User.findByIdAndUpdate(
      req.user.id,
      { expoPushToken: token }
    );

    res.json({ success: true });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

};