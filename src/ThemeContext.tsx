import React, { createContext, useState } from "react";

export const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: any) {
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    darkMode,
    toggleDarkMode: () => setDarkMode(!darkMode),
    colors: darkMode
      ? {
          background: "#0F172A",
          card: "#1E293B",
          text: "#F8FAFC",
          border: "#334155"
        }
      : {
          background: "#F8FAFC",
          card: "#FFFFFF",
          text: "#0F172A",
          border: "#E2E8F0"
        }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}
