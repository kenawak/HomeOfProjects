import { Moon, Sun } from 'lucide-react';
import React, { useState, useEffect } from "react";

const ThemeToggleSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme) {
      if (storedTheme === 'dark') {
        setIsDarkMode(true);
        htmlElement.classList.add("dark");
      } else {
        htmlElement.classList.remove("dark");
      }
    } else if (systemPrefersDark) {
      setIsDarkMode(true);
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (isDarkMode) {
      htmlElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      htmlElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="absolute top-4 right-4">
      <button onClick={handleToggle} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
        {isDarkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-800" />}
      </button>
    </div>
  );
};

export default ThemeToggleSwitch;