// Header.tsx
import React from "react";
import { FaPhone, FaVideo, FaRegWindowMaximize } from "react-icons/fa";

interface HeaderProps {
  receiverInfo: { avatar: string; username: string } | null;
  startCall: (isVideoCall: boolean) => void;
  handleToggleChat: () => void;
}

const Header: React.FC<HeaderProps> = ({ receiverInfo, startCall, handleToggleChat }) => {
  return (
    <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300">
      <div className="flex items-center space-x-4">
        {receiverInfo && (
          <>
            <img
              src={receiverInfo.avatar}
              alt="Receiver Avatar"
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-lg font-semibold">{receiverInfo.username}</h2>
          </>
        )}
      </div>
      <div className="flex space-x-4">
        <button onClick={() => startCall(false)} className="p-2 rounded-full hover:bg-gray-200">
          <FaPhone className="text-xl" />
        </button>
        <button onClick={() => startCall(true)} className="p-2 rounded-full hover:bg-gray-200">
          <FaVideo className="text-xl" />
        </button>
        <button onClick={handleToggleChat} className="p-2 rounded-full hover:bg-gray-200">
          <FaRegWindowMaximize className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Header;
