import React, { useState } from 'react';

interface LeftSettingProps {
  className?: string;
  onSelectOption: (option: string) => void;  // Hàm gọi khi chọn mục
}

const LeftSetting: React.FC<LeftSettingProps> = ({ className, onSelectOption }) => {
  return (
    <div className={`fixed w-72 h-screen bg-white dark:bg-gray-800 p-4  shadow-md ${className}`}>
      <ul className="space-y-4">
        <li
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={() => onSelectOption('password')}
        >
          Manage your password
        </li>
        <li
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={() => onSelectOption('savePosts')}
        >
          Save Posts
        </li>
        <li
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={() => onSelectOption('activity')}
        >
          Activity
        </li>
        <li
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={() => onSelectOption('notification')}
        >
          Notification
        </li>
        <li
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={() => onSelectOption('language')}
        >
          Language
        </li>
        <li
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded cursor-pointer"
          onClick={() => onSelectOption('help')}
        >
          Help
        </li>
      </ul>
    </div>
  );
};

export default LeftSetting;
