import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Định nghĩa URL của server WebSocket
const SOCKET_SERVER_URL = 'http://localhost:5000';  

const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Tạo kết nối WebSocket khi component được mount
    const newSocket = io(SOCKET_SERVER_URL);

    // Cập nhật state với socket mới
    setSocket(newSocket);

    // Đóng kết nối khi component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};

export default useSocket;
