import React from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Sidebars/Navbar';
import LeftSidebar from '../components/Sidebars/LeftSidebar';
import RightSidebar from '../components/Sidebars/RightSidebar';
import Home from '../screens/Home';
import Register from '../screens/Auth/Register';
import Profile from '../screens/Profile';
import Login from '../screens/Auth/Login';
import ProtectedRoute from './ProtectedRoute'; 

const AppContent: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
      <div className="flex">
        {showNavbar && <LeftSidebar />}
        <main className="flex-1">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {showNavbar && <RightSidebar />}
      </div>
    </>
  );
};

export default AppContent;
