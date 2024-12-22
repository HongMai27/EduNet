import React, { useState } from "react";
import { FaSearch, FaSort, FaEnvelope, FaSignOutAlt } from "react-icons/fa";

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleSearch: () => void;
  handleSortOptionClick: (sortOption: string) => void;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
  handleSortOptionClick,
  handleLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-blue-900 text-white flex w-full fixed items-center justify-between px-4 h-20 py-3">
      <div className="flex items-center space-x-4"></div>

      {/* Navbar Actions */}
      <div className="flex items-center space-x-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
  );
};

export default Navbar;
