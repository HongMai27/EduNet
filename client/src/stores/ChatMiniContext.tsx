import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatMiniContextType {
  receiverId: string | null;
  isOpen: boolean;
  openChat: (receiverId: string) => void;
  closeChat: () => void;
}

const ChatMiniContext = createContext<ChatMiniContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openChat = (id: string) => {
    setReceiverId(id);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
    setReceiverId(null);
  };

  return (
    <ChatMiniContext.Provider value={{ receiverId, isOpen, openChat, closeChat }}>
      {children}
    </ChatMiniContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatMiniContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
