import { useState } from "react";
import axios from "axios";
import { Socket } from "socket.io-client"; // Import type Socket để khai báo

interface UseLikeProps {
  socket: Socket | null; // socket nhận từ useSocket
}

const useLike = ({ socket }: UseLikeProps) => {
  const [error, setError] = useState<string | null>(null);

  const handleLike = async (
    postId: string,
    isLiked: boolean,
    setPosts: React.Dispatch<React.SetStateAction<any[]>>,
    userId: string
  ) => {
    try {
      const token = localStorage.getItem("accessToken");
      const url = isLiked
        ? `http://localhost:5000/api/posts/${postId}/unlike`
        : `http://localhost:5000/api/posts/${postId}/like`;

      const response = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật số lượng like trong danh sách bài viết
      const updatedLikes = response.data.likes || [];
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: updatedLikes } : post
        )
      );

      // Lấy username từ userId
      const userResponse = await axios.get(`http://localhost:5000/api/auth/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const username = userResponse.data.username; // Giả sử API trả về { username: '...' }

      // Phát sự kiện "like" hoặc "unlike" qua socket để server phát thông báo
      if (socket) {
        socket.emit("sendNotification", {
          userId,    // ID của người dùng đã like/unlike
          username,  // Tên người dùng
          postId,    // ID bài viết được like/unlike
          type: isLiked ? "unlike" : "like" // Loại thông báo
        });
      }

    } catch (err) {
      console.error("Error liking/unliking post:", err);
      setError("Failed to like/unlike post");
    }
  };

  return { handleLike, error };
};

export default useLike;
