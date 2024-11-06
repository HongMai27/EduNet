import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Lắng nghe sự kiện thông báo từ server
    socket.on('newNotification', (data: { message: string }) => {
      setNotifications((prev) => [...prev, data.message]);
    });

    return () => {
      socket.off('newNotification');
    };
  }, []);

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
