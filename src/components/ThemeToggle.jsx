import React from 'react';

const ThemeToggle = ({ toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="py-2 px-4 bg-gray-800 text-white dark:bg-gray-200 dark:text-black rounded-lg mb-4"
    >
      Toggle Dark Mode
    </button>
  );
};

export default ThemeToggle;
