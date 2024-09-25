import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBell, FaEnvelope, FaUser, FaSearch, FaSun, FaMoon } from "react-icons/fa";

interface NavbarProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, darkMode }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Xóa token đăng nhập
    // Thay đổi điều hướng nếu cần
    window.location.href = '/login'; // Hoặc sử dụng navigate từ react-router-dom nếu có
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 dark:text-white">
        <Link to="/">EduNet</Link>
      </div>

      {/* Tìm kiếm với icon */}
      <div className="flex-1 mx-4">
        <div className="relative">
          {/* Icon tìm kiếm */}
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400 dark:text-gray-300" size={20} />
          </span>
          {/* Trường tìm kiếm */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-10 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
      </div>

      {/* Các liên kết và menu người dùng */}
      <nav className="flex items-center space-x-4">
        <Link to="/home" className="text-blue-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
          <FaHome size={24} />
        </Link>
        <Link to="/notifications" className="text-blue-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
          <FaBell size={24} />
        </Link>
        <Link to="/messages" className="text-blue-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
          <FaEnvelope size={24} />
        </Link>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="text-blue-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white"
          >
            <FaUser size={24} />
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
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

                {/* logout*/}
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

        {/* Nút chuyển đổi chế độ sáng/tối */}
        <button onClick={toggleDarkMode} className="text-blue-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white">
          {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
