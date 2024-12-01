import React, { useState } from 'react';
import { FaLock, FaSave, FaRegClock, FaBell, FaLanguage, FaQuestionCircle } from 'react-icons/fa';

interface LeftSettingProps {
  className?: string;
  onSelectOption: (option: string) => void;
  selectedOption: string;
}

const LeftSetting: React.FC<LeftSettingProps> = ({ className, onSelectOption, selectedOption }) => {
  return (
    <div className={`fixed w-72 h-screen bg-white dark:bg-gray-800 p-4 shadow-md ${className}`}>
      <ul className="space-y-4">
        <li
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
            selectedOption === 'password'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelectOption('password')}
        >
          <FaLock />
          <span>Manage your password</span>
        </li>

        <li
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
            selectedOption === 'savePosts'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelectOption('savePosts')}
        >
          <FaSave />
          <span>Save Posts</span>
        </li>

        <li
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
            selectedOption === 'activity'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelectOption('activity')}
        >
          <FaRegClock />
          <span>Activity</span>
        </li>

        <li
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
            selectedOption === 'notification'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelectOption('notification')}
        >
          <FaBell />
          <span>Notification</span>
        </li>

        <li
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
            selectedOption === 'language'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelectOption('language')}
        >
          <FaLanguage />
          <span>Language</span>
        </li>

        <li
          className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
            selectedOption === 'help'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
              : 'text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
          onClick={() => onSelectOption('help')}
        >
          <FaQuestionCircle />
          <span>Help</span>
        </li>
      </ul>
    </div>
  );
};

export default LeftSetting;
