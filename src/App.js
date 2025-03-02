import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProjectForm from './components/ProjectForm';
import Welcome from './components/Welcome';
import './App.css';

// const API_URL = process.env.REACT_APP_API_URL; // Commented out as it's not used


function App() {
  const [user, setUser] = useState(null);

    useEffect(() => {
        // Ensure the Telegram Web App is ready
        if (window.Telegram) {
            window.Telegram.WebApp.ready();

            // Access the user information
            const obj = window.Telegram.WebApp.initDataUnsafe;
            console.log("tg-object:", obj);
            const user_data = window.Telegram.WebApp.initDataUnsafe.user;
            console.log(user)
        // Get the user_id
        if (user_data) {
            setUser(user_data);
            console.log('User ID:', user_data);
        }else{
            console.log('No user ID');
        }
      }
    }, []);
  return (
    <Router>
      <div className='font-mono'>
        
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/project-form" element={<ProjectForm user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
