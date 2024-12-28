import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/project-form");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white">
      <div className="text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Home Of Projects</h1>
        <p className="text-lg md:text-xl mb-10">Your journey to reac audiances starts here. Let’s get started!</p>
        <button
          className="bg-white text-blue-600 dark:bg-gray-700 dark:text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-100 dark:hover:bg-gray-600 hover:scale-105 transition-all"
          onClick={handleClick}
        >
          Start
        </button>
      </div>

      <div className="absolute bottom-0 w-full text-center py-4 text-sm bg-white bg-opacity-10 dark:bg-gray-800 dark:bg-opacity-10 backdrop-blur-lg">
        <p>&copy; {new Date().getFullYear()} Your Data will be sent to the Channel</p>
      </div>
    </div>
  );
};

export default Welcome;
