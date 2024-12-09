import React from 'react';
import { INotification } from '../../types/INotification';
import useFormattedTimestamp from '../../hooks/useFormatTimestamp';

interface NotificationModalProps {
  notifications: INotification[];
  isOpen: boolean;
  onClose: () => void;
  notificationsRef: React.RefObject<HTMLDivElement>;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  isOpen,
  onClose,
  notificationsRef,
}) => {
  const { formatTimestamp } = useFormattedTimestamp();

  if (!isOpen) return null;

  const sortedNotifications =
    notifications?.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ) || [];

  return (
    <div
      className="fixed top-20 right-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-80 p-4"
      ref={notificationsRef}
    >
      <h2 className="text-lg font-bold mb-2 dark:text-white">Notifications</h2>
      {notifications === null ? (
        <p>Loading...</p>
      ) : sortedNotifications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No notifications</p>
      ) : (
        <ul>
          {sortedNotifications.map((notification, index) => (
            <li key={index} className="py-2 border-b flex items-start">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={notification.userId?.avatar || '/default-avatar.png'}
                  alt={notification.userId?.username || 'User'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {notification.message}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {notification.userId?.username || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        className="mt-4 w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default NotificationModal;
