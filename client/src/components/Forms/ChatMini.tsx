// src/components/ChatMini.tsx
import React, { useState } from "react";
import ChatModal from "../Modals/ChatMini";

const ChatMini: React.FC<{ receiverId: string; isOpen: boolean; onClose: () => void }> = ({ receiverId, isOpen, onClose }) => {
  return (
    <div className="fixed bottom-10 right-10">
      {isOpen && (
        <ChatModal receiverId={receiverId} onClose={onClose} />
      )}
    </div>
  );
};

export default ChatMini;
