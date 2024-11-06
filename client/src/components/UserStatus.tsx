import { useEffect, useState } from 'react';
import useSocket from '../hooks/useSocket';

const UserStatus = () => {
  const socket = useSocket();
  const [userStatus, setUserStatus] = useState<{ [key: string]: boolean }>({}); // State để lưu trạng thái của người dùng

  useEffect(() => {
    if (!socket) return; // Chỉ tiếp tục nếu có socket

    // Gửi request để đăng ký trạng thái người dùng
    const userId = 'yourUserId'; // Thay bằng userId thực tế
    socket.emit('registerUser', userId);

    // Nhận thông báo khi có sự thay đổi trạng thái
    socket.on('userStatusUpdate', (data) => {
      setUserStatus((prevStatus) => ({
        ...prevStatus,
        [data.userId]: data.isOnline, // Cập nhật trạng thái cho userId
      }));
    });

    // Dọn dẹp khi component unmount
    return () => {
      socket.off('userStatusUpdate'); // Ngừng lắng nghe sự kiện khi unmount
    };
  }, [socket]);

  return (
    <div>
      {/* Hiển thị trạng thái người dùng */}
      {Object.keys(userStatus).map((userId) => (
        <div key={userId}>
          User {userId} is {userStatus[userId] ? 'Online' : 'Offline'}
        </div>
      ))}
    </div>
  );
};

export default UserStatus;
