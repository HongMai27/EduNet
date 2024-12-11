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
import Chat from '../components/Forms/ChatBox';
import ChatPage from '../screens/Chat';
import ForgotPassword from '../screens/Auth/ForgetPassword';
import FriendPage from '../screens/Friends';
import SettingsPage from '../screens/Setting';
import AdminDashboard from '../screens/Admin/AdminDashboard';
import PostDetails from '../screens/Admin/ReportDetail';

// Wrapper component để lấy receiverId từ URL
const ChatMini: React.FC = () => {
  const { receiverId } = useParams<{ receiverId: string }>();
  
  // Kiểm tra nếu receiverId không tồn tại
  if (!receiverId) {
    return <div>Không có người nhận.</div>; 
  }

  return <Chat receiverId={receiverId} />;
};


const AppContent: React.FC<{ darkMode: boolean; toggleDarkMode: () => void }> = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  //usematch for dynamic path
  const isProfile = useMatch('/profile');
  const isFriends = useMatch('/friends');
  const isSetting = useMatch('/setting');
  const isChat = useMatch('/messages');
  const isProfileDetail = useMatch('/profiles/:userId');

  const hideSidebars =
    ['/login', '/register', '/forgot-password', '/admin'].includes(location.pathname) || isProfile || isProfileDetail || isChat || isFriends || isSetting ;

  const showNavbar = !['/login', '/register', '/forgot-password', '/admin', '/admin/posts/:id'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />}
      <div className="flex">
        {!hideSidebars && <LeftSidebar />}
        {!hideSidebars && <RightSidebar />}

        <main className="flex-1 p-0">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
              path="/friends"
              element={
                <ProtectedRoute>
                  <FriendPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setting"
              element={
                <ProtectedRoute>
                  <SettingsPage />
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
              path="/messages/:receiverId" 
              element={
                <ProtectedRoute>
                  <ChatMini />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages" 
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

<Route
  path="/admin/report/:reportId"
  element={
    <ProtectedRoute>
      <AdminDashboard />
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
