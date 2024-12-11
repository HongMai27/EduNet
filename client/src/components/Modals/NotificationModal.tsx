import React, { useEffect } from 'react';
import { INotification } from '../../types/INotification';
import useFormattedTimestamp from '../../hooks/useFormatTimestamp';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate(); 

  // Close the modal when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, notificationsRef]);

  if (!isOpen) return null;

  const sortedNotifications =
    notifications?.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ) || [];

  const handleNotificationClick = (postId: string | undefined) => {
    if (postId) {
      navigate(`/detail/${postId}`);
      onClose();
    }
  };

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
        <div className="max-h-[16rem] overflow-y-auto">
          <ul>
            {sortedNotifications.slice(0, 4).map((notification, index) => (
              <li
                key={index}
                className="py-2 border-b flex items-start cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleNotificationClick(notification.postId?.toString())}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                  <img
                    src={notification.avatar}
                    alt={notification.username}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {notification.message}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-400">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
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
