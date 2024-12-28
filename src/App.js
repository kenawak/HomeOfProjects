import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectForm from './components/ProjectForm';
import Welcome from './components/Welcome';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  return (
    <Router>
      <div className='font-mono'>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/project-form" element={<ProjectForm />} />
        </Routes>
        </div>
    </Router>
  );
}

export default App;
