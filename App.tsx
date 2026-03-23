import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});


import { AuthProvider, useAuth } from "./src/context/AuthContext";

/* =========================
   AUTH SCREENS
========================= */
import { SplashScreen } from "./src/screens/SplashScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { VerifyOTPScreen } from "./src/screens/VerifyOTPScreen";
import { ResetPasswordScreen } from "./src/screens/ResetPasswordScreen";

/* =========================
   MAIN SCREENS
========================= */
import { DashboardScreen } from "./src/screens/DashboardScreen";
import { EBooksScreen } from "./src/screens/EBooksScreen";
import { PracticeScreen } from "./src/screens/PracticeScreen";
import { AITutorScreen } from "./src/screens/AITutorScreen";
import { AnalyticsScreen } from "./src/screens/AnalyticsScreen";

import { MockTestScreen } from "./src/screens/MockTestScreen";
import { PreviousYearPapersScreen } from "./src/screens/PreviousYearPapersScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { AppSettingsScreen } from "./src/screens/AppSettingsScreen";
import { EditProfileScreen } from "./src/screens/EditProfileScreen";
import { ChangePasswordScreen } from "./src/screens/ChangePasswordScreen";
import { PrivacySecurityScreen } from "./src/screens/PrivacySecurityScreen";
import { NotificationsScreen } from "./src/screens/NotificationsScreen";
import { TopicsScreen } from "./src/screens/TopicsScreen";
import { EBooksViewerScreen } from "./src/screens/EBooksViewerScreen";
import { DownloadedEbooksScreen } from "./src/screens/DownloadedEbooksScreen";
import { AboutApexMDSScreen } from "./src/screens/AboutApexMDSScreen";
import { MockTestSetupScreen } from "./src/screens/MockTestSetupScreen";
import { LoginHistoryScreen } from "./src/screens/LoginHistoryScreen";
import { DownloadDataScreen } from "./src/screens/DownloadDataScreen";
import { DeleteAccountScreen } from "./src/screens/DeleteAccountScreen";
import { ClearCacheScreen } from "./src/screens/ClearCacheScreen";
import { DailyStudyPlanScreen } from "./src/screens/DailyStudyPlanScreen";
import { ReminderTimesScreen } from "./src/screens/ReminderTimeScreen";
import { AddStudySessionScreen } from "./src/screens/AddStudySessionScreen";
import { PrivacyPolicyScreen } from "./src/screens/PrivacyPolicyScreen";
import { TermsOfServiceScreen } from "./src/screens/TermsOfServiceScreen";
import { AddReminderScreen } from "./src/screens/AddReminderScreen";
import { QuestionPaperViewerScreen } from "./src/screens/QuestionPaperViewerScreen";
import { PracticeSummaryScreen } from "./src/screens/PracticeSummaryScreen";
import { TestScreen } from "./src/screens/TestScreen";
import { TestResultScreen } from "./src/screens/TestResultScreen";
import { ReminderSetupScreen } from "./src/screens/ReminderSetupScreen";

/* =========================
   NAVIGATORS
========================= */
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* =========================
   BOTTOM TABS
========================= */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { height: 65, paddingBottom: 8, paddingTop: 6 },
        tabBarActiveTintColor: "#1E40AF",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "EBooks") iconName = "book";
          else if (route.name === "AppSettings") iconName = "settings";
          else if (route.name === "AITutor") iconName = "sparkles";
          else if (route.name === "Performance") iconName = "bar-chart";

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} options={{
    title: "Home",
    headerTitle: "Dashboard"
  }} />
      <Tab.Screen name="EBooks" component={EBooksScreen} />
      <Tab.Screen name="AITutor" component={AITutorScreen} />
      <Tab.Screen name="Performance" component={AnalyticsScreen} />
      <Tab.Screen name="AppSettings" component={AppSettingsScreen} />
    </Tab.Navigator>
  );
}

/* =========================
   AUTH STACK
========================= */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={VerifyOTPScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

/* =========================
   APP STACK (PROTECTED)
========================= */
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />

      <Stack.Screen name="MockTest" component={MockTestScreen} />
      <Stack.Screen name="AITutor" component={AITutorScreen} />
      <Stack.Screen name="PreviousPapers" component={PreviousYearPapersScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="AppSettings" component={AppSettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="TopicsScreen" component={TopicsScreen} />
      <Stack.Screen name="EBooksViewer" component={EBooksViewerScreen} />
      <Stack.Screen name="DownloadedEbooks" component={DownloadedEbooksScreen} />
      <Stack.Screen name="AboutApexMDS" component={AboutApexMDSScreen} />
      <Stack.Screen name="MockTestSetup" component={MockTestSetupScreen} />
      <Stack.Screen name="LoginHistory" component={LoginHistoryScreen} />
      <Stack.Screen name="DownloadData" component={DownloadDataScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="ClearCache" component={ClearCacheScreen} />
      <Stack.Screen name="DailyStudyPlan" component={DailyStudyPlanScreen} />
      <Stack.Screen name="ReminderTime" component={ReminderTimesScreen} />
      <Stack.Screen name="AddStudySession" component={AddStudySessionScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      <Stack.Screen name="QuestionPaperViewer" component={QuestionPaperViewerScreen} />
      <Stack.Screen name="PracticeSummary" component={PracticeSummaryScreen} />
      <Stack.Screen name="TestScreen" component={TestScreen} />
      <Stack.Screen name="TestResult" component={TestResultScreen} />
      <Stack.Screen name="AddReminder" component={ReminderSetupScreen} />
    </Stack.Navigator>
  );
}

/* =========================
   ROOT NAVIGATOR
========================= */
const RootNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return isLoggedIn ? <AppStack /> : <AuthStack />;
};


/* =========================
   APP ENTRY
========================= */
export default function App() {
  useEffect(() => {
    setupNotifications();
  }, []);

  async function setupNotifications() {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      alert("Enable notifications to receive reminders");
      return;
    }

    // 🔥 CREATE ANDROID NOTIFICATION CHANNEL
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#2563EB",
      });
    }
  }
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

