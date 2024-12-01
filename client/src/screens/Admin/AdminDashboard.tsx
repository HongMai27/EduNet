import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import { useAuth } from "../../stores/AuthContext";
import axios from "axios";
import { FaSearch, FaSort, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

const AdminDashboard: React.FC = () => {
  const { userId, setUserId } = useAuth(); // Giả sử bạn đang dùng AuthContext để lấy userId
  const [selectedMenu, setSelectedMenu] = useState<string>("user");
  const [adminUsername, setAdminUsername] = useState<string>("");
  const [adminAvatar, setAdminAvatar] = useState<string>("");

  // Fetch thông tin admin khi component mount
  useEffect(() => {
    const fetchAdminInfo = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/userinfor/${userId}`);
          const { username, avatar } = response.data; // Giả sử API trả về username và avatar
          setAdminUsername(username);
          setAdminAvatar(avatar);
        } catch (err) {
          console.error("Error fetching admin info", err);
        }
      }
    };

    fetchAdminInfo();
  }, [userId]);

  const handleLogout = () => {
    setUserId(null); // Clear userId
    localStorage.removeItem("accessToken"); // Clear token
    localStorage.removeItem("userId"); // Clear userId from local storage
    window.location.href = "/login"; // Redirect to login page
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <div className="bg-blue-900 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
            
        </div>
        {/* Navbar Actions */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="text-black px-3 py-2 rounded-md focus:outline-none"
            />
            <FaSearch className="absolute top-3 right-3 text-gray-400" />
          </div>
          {/* Sort */}
          <button className="flex items-center hover:text-gray-300">
            <FaSort className="mr-2" /> Order
          </button>
          {/* Messages */}
          <button className="flex items-center hover:text-gray-300">
            <FaEnvelope className="mr-2" /> Chat
          </button>
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center hover:text-gray-300"
          >
            <FaSignOutAlt className="mr-2" /> Log out
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar
          setSelectedMenu={setSelectedMenu} 
          selectedMenu={selectedMenu} 
          adminUsername={adminUsername} 
          adminAvatar={adminAvatar} 
        />

        {/* Main Content */}
        <div className="flex-1 bg-gray-100 p-4">
          <ContentArea selectedMenu={selectedMenu} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
