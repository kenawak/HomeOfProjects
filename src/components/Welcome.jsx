import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/project-form");
    }, 4500); // 4.5 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-900 text-white">
      <div className="flex justify-center items-center">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      </div>
      <div className="text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to Home Of Projects</h1>
        <p className="text-lg md:text-xl mb-10">Boost your audience & reachability through broadcasting to the Channel</p>
      </div>
    </div>
  );
};

export default Welcome;
