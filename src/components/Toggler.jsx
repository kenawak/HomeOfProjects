import React, { useState, useEffect } from "react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="flex items-center space-x-3">
      <span className="text-gray-900 dark:text-gray-100">
        {isDark ? "Dark Mode" : "Light Mode"}
      </span>
      <div
        onClick={() => setIsDark(!isDark)}
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
          isDark ? "bg-gray-800" : "bg-gray-300"
        }`}
      >
        <div
          className={`h-5 w-5 bg-white rounded-full shadow-md transform transition-transform ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ThemeToggle;
