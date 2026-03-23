import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/api";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
  const response = await API.post("/auth/login", {
    email,
    password,
  });

  console.log("LOGIN RESPONSE:", response.data);

  const token = response.data.token;

  localStorage.setItem("accessToken", token);
  setIsAuthenticated(true);
}

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("ai_chat_history"); 
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}