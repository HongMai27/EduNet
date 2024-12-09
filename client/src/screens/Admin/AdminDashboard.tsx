import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import { useAuth } from "../../stores/AuthContext";
import axios from "axios";
import { FaSearch, FaSort, FaEnvelope, FaSignOutAlt } from "react-icons/fa";
import { searchUsersByUsername } from "../../services/userService";

const AdminDashboard: React.FC = () => {
  const { userId, setUserId } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState<string>("user");
  const [adminUsername, setAdminUsername] = useState<string>("");
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State cho từ khóa tìm kiếm
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]); // Kết quả tìm kiếm
  const [error, setError] = useState<string | null>(null);

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

  const handleSearch = async () => {
    try {
      const results = await searchUsersByUsername(searchTerm); // Tìm kiếm theo từ khóa
      setFilteredUsers(results);
      setError(null);
      setSelectedMenu("search"); // Đổi chế độ hiển thị
    } catch (err) {
      setFilteredUsers([]);
      setError("Error fetching search results");
    }
  };

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
        <div className="flex items-center space-x-4"></div>

        {/* Navbar Actions */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm} // Liên kết với state searchTerm
              onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật searchTerm
              className="text-black px-3 py-2 rounded-md focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="absolute top-3 right-3 text-gray-400"
            >
              <FaSearch />
            </button>
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
        <ContentArea
          selectedMenu={selectedMenu}
          users={selectedMenu === "search" ? filteredUsers : []} 
        />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
