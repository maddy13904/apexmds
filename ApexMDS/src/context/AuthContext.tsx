import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { loadToken, logout as clearToken } from "../utils/authStorage";
import { setUnauthorizedHandler } from "../services/api";
import * as Notifications from "expo-notifications";


type AuthContextType = {
  isLoggedIn: boolean;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔁 Phase 2.0 – Auth Rehydration
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const token = await loadToken();
        if (mounted) {
          setIsLoggedIn(Boolean(token));
        }
      } catch (err) {
        console.error("Auth rehydration failed:", err);
        if (mounted) {
          setIsLoggedIn(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
  setUnauthorizedHandler(() => {
    setIsLoggedIn(false);
  });
}, []);


  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await clearToken();
    } finally {
      setIsLoggedIn(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
