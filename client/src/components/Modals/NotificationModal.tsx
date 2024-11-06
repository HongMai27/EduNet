import React from 'react';

interface Notification {
  message: string;
  timestamp: number; // Thêm timestamp để sắp xếp
}

interface NotificationModalProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notifications, isOpen, onClose }) => {
  if (!isOpen) return null; // Không hiển thị nếu không mở modal

  // Sắp xếp thông báo từ mới đến cũ
  const sortedNotifications = notifications.sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-4">
        <h2 className="text-lg font-bold mb-2">Notifications</h2>
        {sortedNotifications.length === 0 ? (
          <p>No notifications</p>
        ) : (
          <ul>
            {sortedNotifications.map((notification, index) => (
              <li key={index} className="py-2 border-b">{notification.message}</li>
            ))}
          </ul>
        )}
        <button
          className="mt-4 w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationModal;
