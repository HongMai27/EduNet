import React from 'react';
import { useLocation, Routes, Route, useMatch, useParams } from 'react-router-dom';
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
import OtherProfile from '../screens/OtherProfile';
import Chat from '../components/Forms/Chat';
import ChatPage from '../screens/Chat';

// Wrapper component để lấy receiverId từ URL
const ChatWrapper: React.FC = () => {
  const { receiverId } = useParams<{ receiverId: string }>();
  
  // Kiểm tra nếu receiverId không tồn tại
  if (!receiverId) {
    return <div>Không có người nhận.</div>; // Hiển thị thông báo hoặc điều hướng đến trang khác
  }

  return <Chat receiverId={receiverId} />;
};


const AppContent: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  //usematch for dynamic path
  const isProfile = useMatch('/profile');
  const isChat = useMatch('/messages');
  const isProfileDetail = useMatch('/profiles/:userId');

  const hideSidebars =
    ['/login', '/register'].includes(location.pathname) || isProfile || isProfileDetail || isChat;

  const showNavbar = !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
      <div className="flex">
        {!hideSidebars && <LeftSidebar />}
        {!hideSidebars && <RightSidebar />}

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
              path="/profiles/:userId"
              element={
                <ProtectedRoute>
                  <OtherProfile />
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
            <Route
              path="/messages/:receiverId" // Sửa thành /messages/:receiverId
              element={
                <ProtectedRoute>
                  <ChatWrapper />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages" // Sửa thành /messages/:receiverId
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        {showNavbar}
      </div>
    </>
  );
};

export default AppContent;
