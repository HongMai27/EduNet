import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  userId: string | null;
  username: string | null;
  avatar: string | null;
  setUserId: (id: string | null) => void;
  setUsername: (name: string | null) => void;
  setAvatar: (avatar: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(() => localStorage.getItem('userId'));
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));
  const [avatar, setAvatar] = useState<string | null>(() => localStorage.getItem('avatar'));


  return (
    <AuthContext.Provider 
      value={{ 
        userId, 
        setUserId, 
        username,
        setUsername,
        avatar, 
        setAvatar 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
