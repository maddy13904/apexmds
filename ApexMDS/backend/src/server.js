import "./env.js";
import "./models/User.js";
import "./models/Otp.js";

import app from "./app.js";
import connectDB from "./config/db.js";
import { startQuestionReplenishJob } from "./modules/jobs/question.replenish.job.js";
import { startReminderScheduler } from "./services/reminderScheduler.js";

const PORT = process.env.PORT || 5000;

connectDB();
startReminderScheduler();
startQuestionReplenishJob();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 ApexMDS backend running on port ${PORT}`);
});