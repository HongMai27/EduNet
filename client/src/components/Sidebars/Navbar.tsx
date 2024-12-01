import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBell, FaEnvelope, FaSearch, FaSun, FaMoon, FaUserCheck, FaUserGraduate } from "react-icons/fa";
import useSocket from "../../hooks/useSocket";
import NotificationModal from "../Modals/NotificationModal";
import SearchResultsModal from "../Modals/ResultSearchModal";
import { searchUsersByUsername } from "../../services/userService";
import { updateUserStatus } from "../../hooks/updateStatus";
import { INotification } from "../../types/INotification";
import axios from "axios";
import { useAuth } from "../../stores/AuthContext";

interface NavbarProps {
  toggleDarkMode: () => void;
  darkMode: boolean;
}


const Navbar: React.FC<NavbarProps> = ({ toggleDarkMode, darkMode }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {userId} = useAuth();
  const socket = useSocket();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [modalResult, setModalResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null); 
  const notificationsRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); 
  const currentPath = location.pathname; 
  const [modalPosition, setModalPosition] = useState<{ top: number; left: number } | null>(null); // Vị trí của modal
  const [notifications, setNotifications] = useState<INotification[]>(() => {
    const storedNotifications = localStorage.getItem("notifications");
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  });

  
  useEffect(() => {
    if (!socket) return;

    // Lắng nghe sự kiện `newNotification`
    // socket.on("newNotification", (data) => {
    //   console.log("Received new notification:", data);

    //   const newNotification: INotification = {
    //     _id: data._id || '',
    //     message: data.message,
    //     timestamp: Date.now().toString(),
    //     type: data.type || 'generic',
    //     user: data.user || {}, // Cung cấp giá trị mặc định nếu không có dữ liệu
    //     post: data.post || {}, // Cung cấp giá trị mặc định nếu không có dữ liệu
    //   };

    //   // Cập nhật trạng thái notifications và lưu vào localStorage
    //   setNotifications((prev) => {
    //     const updatedNotifications = [newNotification, ...prev].slice(0, 10);
    //     // Xóa tất cả dữ liệu trong localStorage
    //     localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    //     return updatedNotifications;
    //   });

    //   // Cập nhật số lượng thông báo chưa đọc
    //   setUnreadCount((prev) => prev + 1);
    // });

    // Lắng nghe sự kiện tin nhắn mới
    socket.on("newMessage", (data) => {
      console.log("Received new message:", data);
      setUnreadMessages((prev) => prev + 1);
    });

    // Xóa các listener khi component bị hủy
    return () => {
      socket.off("newNotification");
      socket.off("newMessage");
    };
  }, [socket]);
  
  const fetchNotifications = async () => {
    const token = localStorage.getItem('accessToken');  
    
    if (!token) {
      console.error('No token found');
      return; 
    }
  
    try {
      const response = await axios.get(
        `http://localhost:5000/api/auth/notifications/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`, 
          },
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  

  const openModal = () => {
    setModalOpen(true);
    fetchNotifications();  
  };


  // Đóng modal
  const closeModal = () => {
    setModalOpen(false);
  };
  

  const handleSearch = async () => {
    try {
      const results = await searchUsersByUsername(searchTerm); 
      setSearchResults(results);
      setError(null);
      setModalResult(true); 
    } catch (err) {
      setModalResult(false); 
    }
  };

  
  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    updateUserStatus(false)
    localStorage.removeItem('accessToken'); 
    window.location.href = '/login'; 
  };


  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between z-50">
      <div className="text-2xl font-bold text-blue-600 dark:text-white">
        <Link to="/">EduNet</Link>
      </div>

      {/* Search */}
      <div className="flex-1 mx-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <FaSearch className="text-gray-400 dark:text-gray-300" size={20} />
          </span>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
            ref={searchInputRef} // Gán ref vào ô tìm kiếm
            className="w-full px-10 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        {searchResults.length > 0 && (
          <SearchResultsModal
            results={searchResults}
            onClose={() => setSearchResults([])} 
            searchInputRef={searchInputRef} // Truyền ref
          />
        )}
      </div>

      {/* Other page */}
      <nav className="flex items-center space-x-4">
        {/* Home */}
        <div className="group relative flex items-center">
          <Link to="/home"   className={`text-blue-600 dark:text-gray-300 group-hover:scale-150 transition-transform duration-150 ease-in-out ${currentPath === '/home' ? 'border-b-2 border-blue-600' : ''}`} // Add underline if active
>
            <FaHome size={28} />
          </Link>
          <span className="tooltip-text group-hover:opacity-100">Home</span>
        </div>

        {/* Friends */}
        <div className="group relative flex items-center">
          <Link to="/friends" className={`text-blue-600 dark:text-gray-300 group-hover:scale-150 transition-transform duration-150 ease-in-out ${currentPath === '/friends' ? 'border-b-2 border-blue-600' : ''}`}>
            <FaUserCheck size={28} />
          </Link>
          <span className="tooltip-text group-hover:opacity-100">Friends</span>
        </div>

        {/* Notifications Section */}
        <div className="group relative flex items-center">
          <button
            ref={bellRef} 
            onClick={openModal}
            className="text-blue-600 dark:text-gray-300"
          >
            <FaBell size={28} />
          </button>
          <span className="tooltip-text group-hover:opacity-100">Notification</span>
        </div>

        {/* Notification Modal */}
        {isModalOpen && (
          <NotificationModal
            notifications={notifications}
            isOpen={isModalOpen}
            onClose={closeModal}
            notificationsRef={notificationsRef}  // Truyền ref vào prop
          />
        )}

        {/* Messages with Badge */}
        <div className="group relative flex items-center">
          <Link to="/messages"  className={`text-blue-600 dark:text-gray-300 group-hover:scale-150 transition-transform duration-150 ease-in-out ${currentPath === '/messages' ? 'border-b-2 border-blue-600' : ''}`}>
            <FaEnvelope size={24} />
          </Link>
          {unreadMessages > 0 && (
            <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-semibold rounded-full px-1.5">
              {unreadMessages}
            </span>
          )}
          <span className="tooltip-text group-hover:opacity-100">Message</span>
        </div>

        {/* User Dropdown */}
        <div className="group relative flex items-center">
          <button
            onClick={toggleDropdown}
            className={`text-blue-600 dark:text-gray-300 group-hover:scale-150 transition-transform duration-150 ease-in-out ${currentPath === '/profile' ? 'border-b-2 border-blue-600' : ''}`}
          >
            <FaUserGraduate size={28} />
          </button>
          <span className="tooltip-text group-hover:opacity-100">User</span>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-48   w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
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

                 {/* setting */}
                 <li>
                  <Link
                    to="/setting"
                    className="block px-4 py-2 text-blue-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Setting & Private
                  </Link>
                </li>

                   {/* Logout */}
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
