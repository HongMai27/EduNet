import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBell, FaEnvelope, FaSearch, FaSun, FaMoon, FaUserCheck, FaUserGraduate } from "react-icons/fa";

interface NavbarProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, darkMode }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(3);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); 
    window.location.href = '/login'; 
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between z-50">
      <div className="text-2xl font-bold text-blue-600 dark:text-white">
        <Link to="/">EduNet</Link>
      </div>

      {/* search */}
      <div className="flex-1 mx-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400 dark:text-gray-300" size={20} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-10 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* other page */}
      <nav className="flex items-center space-x-4">
        {/* Home */}
        <div className="group relative flex items-center">
          <Link to="/home" className="text-blue-600 dark:text-gray-300 group-hover:scale-150 transition-transform duration-150 ease-in-out">
            <FaHome size={28} />
          </Link>
          <span className="tooltip-text group-hover:opacity-100">Home</span>
        </div>

        {/* Friends */}
        <div className="group relative flex items-center">
          <Link to="/home" className="text-blue-600 dark:text-gray-300 group-hover:scale-150 transition-transform duration-150 ease-in-out">
            <FaUserCheck size={28} />
          </Link>
          <span className="tooltip-text group-hover:opacity-100">Friends</span>
        </div>
        {/* Notifications */}
        <div className="group relative flex items-center">
          <Link to="/notifications" className="text-blue-600 dark:text-gray-300 group-hover:scale-150 transition-transform duration-150 ease-in-out">
            <FaBell size={28} />
          </Link>
          <span className="tooltip-text group-hover:opacity-100">Notifications</span>
        </div>

         {/* Messages with Badge */}
         <div className="relative">
          <Link to="/messages" className="text-blue-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
            <FaEnvelope size={24} />
          </Link>
          {unreadMessages > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5">
              {unreadMessages}
            </span>
          )}
        </div>

        {/* User Dropdown */}
        <div className="group relative flex items-center">
          <button
            onClick={toggleDropdown}
            className="text-blue-600 dark:text-gray-300 group-hover:scale-150 transition-transform duration-150 ease-in-out"
          >
            <FaUserGraduate size={28} />
          </button>
          <span className="tooltip-text group-hover:opacity-100">User</span>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-36 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
              <ul className="py-1">
                {/* Profile */}
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-blue-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                </li>

                {/* logout */}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-blue-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <div className="group relative flex items-center">
          <button onClick={toggleDarkMode} className="text-blue-600 dark:text-gray-300 group-hover:scale-150 transition-transform duration-150 ease-in-out">
            {darkMode ? <FaSun size={28} /> : <FaMoon size={28} />}
          </button>
          <span className="tooltip-text group-hover:opacity-100">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </div>

      </nav>
    </header>
  );
};

export default Navbar;
