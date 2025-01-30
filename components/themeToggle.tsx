'use client';

import { useTheme } from "@/context/themeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center p-4">
        <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="transition-all"
        >
        {theme === "light" ? (
            <Moon className="w-5 h-5 text-gray-800" />
        ) : (
            <Sun className="w-5 h-5 text-gray-800" />
        )}
        
        </button>
    </div>
  );
};

export default ThemeToggle;
