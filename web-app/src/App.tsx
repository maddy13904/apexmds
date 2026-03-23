import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { startReminderEngine } from "./utils/reminderEngine";
//import { requestNotificationPermission } from "./utils/Notifications";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ebooks from "./pages/Ebooks";
import AITutor from "./pages/AITutor";
import PreviousPapers from "./pages/PreviousPapers";
import MockTestSetup from "./pages/MockTestSetup";
import TestScreen from "./pages/TestScreen";
import TestResult from "./pages/TestResult";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import DailyQuiz from "./pages/DailyQuiz";
import EditProfile from "./pages/settings/EditProfile";
import ChangePassword from "./pages/settings/ChangePassword";
import LoginHistory from "./pages/settings/LoginHistory";
import Notifications from "./pages/settings/Notifications";
import AppSettings from "./pages/settings/AppSettings";
import DownloadData from "./pages/settings/DownloadData";
import DeleteAccount from "./pages/settings/DeleteAccount";
import DailyStudyGoal from "./pages/settings/DailyStudyGoal";
import ReminderTimes from "./pages/settings/ReminderTimes";
import ReminderSetup from "./pages/settings/ReminderSetup";
import DownloadedEbooks from "./pages/settings/DownloadedEbooks";
import TermsOfService from "./pages/settings/TermsOfService";
import PrivacyPolicy from "./pages/settings/PrivacyPolicy";
import AboutApexMDS from "./pages/settings/AboutApexMDS";
import SubjectTopics from "./pages/SubjectTopics";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";

export default function App() {
  useEffect(() => {
    startReminderEngine();
  }, []);
  return (
    <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
  path="/ebooks"
  element={
    <ProtectedRoute>
      <Ebooks />
    </ProtectedRoute>
  }
/>
<Route path="/ebooks/:subject" element={<SubjectTopics />} />

<Route
  path="/ai-tutor"
  element={
    <ProtectedRoute>
      <AITutor />
    </ProtectedRoute>
  }
/>

<Route
  path="/previous-papers"
  element={
    <ProtectedRoute>
      <PreviousPapers />
    </ProtectedRoute>
  }
/>

<Route
  path="/mock-tests"
  element={
    <ProtectedRoute>
      <MockTestSetup />
    </ProtectedRoute>
  }
/>

<Route
  path="/test"
  element={
    <ProtectedRoute>
      <TestScreen />
    </ProtectedRoute>
  }
/>

<Route
  path="/test-result"
  element={
    <ProtectedRoute>
      <TestResult />
    </ProtectedRoute>
  }
/>

<Route
  path="/analytics"
  element={
    <ProtectedRoute>
      <Analytics />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

<Route
  path="/daily-quiz"
  element={
    <ProtectedRoute>
      <DailyQuiz />
    </ProtectedRoute>
  }
/>

<Route path="/register" element={<Register />} />
<Route path="/settings/edit-profile" element={<EditProfile />} />
<Route path="/settings/login-history" element={<LoginHistory />} />
<Route path="/settings/change-password" element={<ChangePassword />} />
<Route path="/settings/notifications" element={<Notifications />} />
<Route path="/settings/app-settings" element={<AppSettings />} />
<Route path="/settings/download-data" element={<DownloadData />} />
<Route path="/settings/delete-account" element={<DeleteAccount />} />
<Route path="/settings/daily-study-goal" element={<DailyStudyGoal />} />
<Route path="/settings/reminder-times" element={<ReminderTimes />} />
<Route path="/settings/add-reminder" element={<ReminderSetup />} />
<Route path="/settings/downloaded-ebooks" element={<DownloadedEbooks />} />
<Route path="/terms" element={<TermsOfService />} />
<Route path="/privacy" element={<PrivacyPolicy />} />
<Route path="/about" element={<AboutApexMDS />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/verify-otp" element={<VerifyOTP />} />
<Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
    </AuthProvider>
  );
}