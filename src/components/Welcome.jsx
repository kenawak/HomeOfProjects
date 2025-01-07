import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Home of Projects</h1>
      <Link to="/project-form" className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
        Go to Project Form
      </Link>
    </div>
  );
};

export default Welcome;
