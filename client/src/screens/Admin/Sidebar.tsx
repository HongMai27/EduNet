import React from "react";
import { FaUser, FaCog, FaListAlt, FaChartBar } from "react-icons/fa"; // Các icon ví dụ

interface SidebarProps {
  setSelectedMenu: React.Dispatch<React.SetStateAction<string>>;
  adminUsername: string;
  adminAvatar: string;
  selectedMenu: string; // Added to track the selected menu
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedMenu, adminUsername, adminAvatar, selectedMenu }) => {
  return (
    <div className="bg-blue-900 text-white w-64 p-4 min-h-screen">
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={adminAvatar} 
          alt="Admin Avatar"
          className="w-24 h-24 rounded-full mr-4"
        />
        <span className="text-lg font-semibold">{adminUsername}</span>
      </div>

      <h2 className="text-xl font-bold mb-6">Manage</h2>
      <ul className="space-y-4">
        <li
          className={`cursor-pointer p-2 rounded ${selectedMenu === "user" ? "font-bold bg-gray-700" : "hover:bg-gray-700"}`}
          onClick={() => setSelectedMenu("user")}
        >
          <FaUser className="inline mr-2" /> Users Management
        </li>
        <li
          className={`cursor-pointer p-2 rounded ${selectedMenu === "posts" ? "font-bold bg-gray-700" : "hover:bg-gray-700"}`}
          onClick={() => setSelectedMenu("posts")}
        >
          <FaListAlt className="inline mr-2" /> Posts Management
        </li>
        <li
          className={`cursor-pointer p-2 rounded ${selectedMenu === "analytics" ? "font-bold bg-gray-700" : "hover:bg-gray-700"}`}
          onClick={() => setSelectedMenu("analytics")}
        >
          <FaChartBar className="inline mr-2" /> Statistical
        </li>
        <li
          className={`cursor-pointer p-2 rounded ${selectedMenu === "settings" ? "font-bold bg-gray-700" : "hover:bg-gray-700"}`}
          onClick={() => setSelectedMenu("settings")}
        >
          <FaCog className="inline mr-2" /> Setting
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;