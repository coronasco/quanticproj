'use client';

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Defines the structure for the theme context.
 */
interface ThemeContextType {
  theme: string;
  primaryColor: string;
  setTheme: (theme: string) => void;
  setPrimaryColor: (color: string) => void;
}

// Default theme values
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  primaryColor: "#4F46E5", // Default primary color (indigo)
  setTheme: () => {},
  setPrimaryColor: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>("light");
  const [primaryColor, setPrimaryColor] = useState<string>("#4F46E5");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--primary-color", primaryColor);
  }, [theme, primaryColor]);

  return (
    <ThemeContext.Provider value={{ theme, primaryColor, setTheme, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);