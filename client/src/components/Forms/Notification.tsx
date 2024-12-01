import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Notification: React.FC<{ userId: string }> = ({ userId }) => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Hàm lấy thông báo từ API
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/notifications/${userId}`);
        setNotifications(response.data.map((notification: { message: string }) => notification.message));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications(); // Gọi API khi component mount lần đầu

    // Đăng nhập socket và lắng nghe thông báo mới
    socket.emit('login', userId);
    socket.on('newNotification', (data: { message: string }) => {
      // Kiểm tra thông báo đã có trong danh sách chưa
      setNotifications((prev) => {
        if (!prev.includes(data.message)) {
          return [...prev, data.message];
        }
        return prev;
      });
    });

    return () => {
      socket.off('newNotification');
    };
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((notification, index) => (
          <li key={index} className="p-2 bg-gray-100 rounded">
            {notification}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
