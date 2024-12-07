import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import { useAuth } from "../../stores/AuthContext";
import axios from "axios";
import { FaSearch, FaSort, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

const AdminDashboard: React.FC = () => {
  const { userId, setUserId } = useAuth(); 
  const [selectedMenu, setSelectedMenu] = useState<string>("user");
  const [adminUsername, setAdminUsername] = useState<string>("");
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  // Fetch thông tin admin khi component mount
  useEffect(() => {
    const fetchAdminInfo = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:5000/api/auth/userinfor/${userId}`);
          const { username, avatar } = response.data; 
          setAdminUsername(username);
          setAdminAvatar(avatar);
        } catch (err) {
          console.error("Error fetching admin info", err);
        }
      }
    };

    fetchAdminInfo();
  }, [userId]);

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
  
    const handleSortOptionClick = (sortOption: string) => {
      console.log(`Sorting by: ${sortOption}`);
      setIsDropdownOpen(false);
    };

  const handleLogout = () => {
    setUserId(null); // Clear userId
    localStorage.removeItem("accessToken"); 
    localStorage.removeItem("userId"); 
    window.location.href = "/login";
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

        {/* Sort Button with Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center hover:text-gray-300"
          >
            <FaSort className="mr-2" /> Order
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md text-black">
              <ul>
                <li
                  onClick={() => handleSortOptionClick("point")}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Sort by Point
                </li>
                <li
                  onClick={() => handleSortOptionClick("lastactive")}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                >
                  Sort by Last Active
                </li>
                <li
                  onClick={() => handleSortOptionClick("reported")}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black"
                >
                  Sort by Reported
                </li>
              </ul>
            </div>
          )}
        </div>

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
