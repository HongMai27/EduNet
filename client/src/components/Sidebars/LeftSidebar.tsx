// LeftSidebar.tsx
import React from 'react';

interface LeftSidebarProps {
  className?: string; // Allow className prop
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ className }) => {
  return (
    <div className="fixed w-64 h-screen bg-white dark:bg-gray-800 p-4 mt-20 shadow-md">
      <ul className="space-y-4">
      <li className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded">Friend 1</li>
      <li className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded">Friend 2</li>
      <li className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded">Friend 3</li>
      <li className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded">Friend 4</li>

      </ul>
    </div>
  );
};

export default LeftSidebar;
