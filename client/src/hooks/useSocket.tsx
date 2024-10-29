import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:5000';  

const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // connect WebSocket 
    const newSocket = io(SOCKET_SERVER_URL);

    // update state with new socket 
    setSocket(newSocket);

    // close when component unmount
    return () => {
      newSocket.close();
    };
  }, []);

  return socket;
};

export default useSocket;
