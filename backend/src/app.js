import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import studyRoutes from "./modules/study/study.routes.js";
import analyticsRoutes from "./modules/analytics/analytics.routes.js";
import aiRoutes from "./modules/ai/ai.routes.js";
import testRoutes from "./modules/test/test.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";
import devRoutes from "./routes/dev.routes.js";
import paperRoutes from "./modules/paper/paper.routes.js";
import ebookRoutes from "./modules/ebooks/ebooks.routes.js";
import downloadRoutes from "./modules/user/download.routes.js";
import notificationRoutes from "./modules/Notification/notification.routes.js";

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/study", studyRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1", paperRoutes);
app.use("/dev", devRoutes);
app.use("/api/v1", ebookRoutes);
app.use("/api/v1/users/downloads", downloadRoutes);
app.use("/api/v1", notificationRoutes);

app.get("/", (req, res) => {
  res.json({
    app: "ApexMDS Backend",
    status: "Running"
  });
});

export default app;
