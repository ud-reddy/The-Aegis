
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Modules } from './pages/Modules';
import { Learning } from './pages/Learning';
import { Services } from './pages/Services';
import { Timetable } from './pages/Timetable';
import { Profile } from './pages/Profile';
import { Shop } from './pages/Shop';
import { Activity } from './pages/Activity';
import { Community } from './pages/Community';
import { INITIAL_PROFILE } from './constants';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(INITIAL_PROFILE);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <Router>
      <Layout user={user}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/modules/*" element={<Modules />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/services" element={<Services />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/profile" element={<Profile user={user} toggleDarkMode={toggleDarkMode} isDarkMode={darkMode} />} />
          <Route path="/shop" element={<Shop user={user} onUpdateUser={setUser} />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/community" element={<Community />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
