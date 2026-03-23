import cron from "node-cron";
import { monitorQuestionPool } from "../question/question.pool.monitor.js";

export function startQuestionReplenishJob() {

  // Every 24 hours
  cron.schedule("*0 0 * * *", async () => {
    console.log("⏳ Running Question Replenish Job...");
    await monitorQuestionPool();
  });

  console.log("📅 Question Replenish Job Scheduled (Daily at MidNight)");
}
