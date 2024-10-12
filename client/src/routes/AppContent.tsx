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
import PostDetail from '../screens/PostDetail';
import EditPostModal from '../components/Forms/EditPost';


const AppContent: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const hideSidebars = ['/login', '/register', '/profile'];
  const showNavbar = !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
      <div className="flex">
      {!hideSidebars.includes(location.pathname) && <LeftSidebar />}
      {!hideSidebars.includes(location.pathname) && <RightSidebar />}
      
        <main className="flex-1 p-0">
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
              path="/detail/:postId"
              element={
                <ProtectedRoute>
                  <PostDetail />
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
              <Route
              path="/editpost"
              element={
                <ProtectedRoute>
                  <EditPostModal />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {showNavbar }
      </div>
    </>
  );
};

export default AppContent;
