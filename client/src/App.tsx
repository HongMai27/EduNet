import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './stores/AuthContext';
import AppContent from './routes/AppContent';
import { ToastContainer } from 'react-toastify';
import { GoogleOAuthProvider } from '@react-oauth/google'; 
import 'react-toastify/dist/ReactToastify.css';
import { ChatProvider } from './stores/ChatMiniContext'; // Đảm bảo import đúng
import ChatModal from './components/Modals/ChatMini';
import UserStatus from './components/UserStatus';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isChatOpen, setChatOpen] = useState(false);
  const [receiverId, setReceiverId] = useState<string | null>(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID as string; 
  if (!clientId) {
    throw new Error("Missing environment variable: REACT_APP_GOOGLE_CLIENT_ID");
  }

  return (
    <Router>
    <AuthProvider>
      <GoogleOAuthProvider clientId={clientId}>
        <ChatProvider>
          <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
            <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            <ToastContainer />
            <UserStatus />
            {/* ChatMini có thể được thêm vào AppContent hoặc 1 component khác nếu cần */}
          </div>
        </ChatProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  </Router>
  );
};

export default App;
