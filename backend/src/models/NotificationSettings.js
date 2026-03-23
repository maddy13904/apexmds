import mongoose from "mongoose";

const notificationSettingsSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  studyRemindersEnabled: {
    type: Boolean,
    default: true
  },

  pushNotificationsEnabled: {
    type: Boolean,
    default: true
  },

  reminderTimes: [
  {
    id: Number,
    label: String,
    time: String,
    days: [String],
    enabled: Boolean
  }
],

  quietHoursStart: {
    type: String,
    default: "22:00"
  },

  quietHoursEnd: {
    type: String,
    default: "07:00"
  }

}, { timestamps: true });

export default mongoose.model(
  "NotificationSettings",
  notificationSettingsSchema
);