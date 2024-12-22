import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ContentArea from "./ContentArea";
import Navbar from "./Navbar";
import { useAuth } from "../../stores/AuthContext";
import axios from "axios";
import { searchUsersByUsername } from "../../services/userService";

const AdminDashboard: React.FC = () => {
  const { userId, setUserId } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState<string>("user");
  const [adminUsername, setAdminUsername] = useState<string>("");
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
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
      const results = await searchUsersByUsername(searchTerm);
      setFilteredUsers(results);
      setError(null);
      setSelectedMenu("search");
    } catch (err) {
      setFilteredUsers([]);
      setError("Error fetching search results");
    }
  };

  const handleSortOptionClick = (sortOption: string) => {
    console.log(`Sorting by: ${sortOption}`);
  };

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleSortOptionClick={handleSortOptionClick}
        handleLogout={handleLogout}
      />

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
