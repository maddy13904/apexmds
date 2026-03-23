import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { SplashScreen } from "../screens/SplashScreen";

import { AuthStack } from "./AuthStack";
import { AppStack } from "../../App";

export default function AuthGate() {
  const { token, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000); // 2 seconds splash

    return () => clearTimeout(timer);
  }, []);

  // 🔹 Always show splash first
  if (showSplash || loading) {
    return <SplashScreen />;
  }

  // 🔐 Decide app flow
  return token ? <AppStack /> : <AuthStack />;
}
