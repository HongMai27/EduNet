import axios from 'axios';
import { io } from 'socket.io-client';
import { fetchPostDetail } from '../services/postService';

const socket = io('http://localhost:5000');

const useAddcmt = () => {
  const handleAddComment = async (
    postId: string, 
    content: string, 
    username: string, 
    userId: string, 
    avatar: string, 
    setComments: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    if (!content.trim()) {
      throw new Error("Comment content cannot be empty");
    }

    try {
      const commentData = { content };
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      // Gửi yêu cầu thêm bình luận đến API
      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        commentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Comment added:', response.data);

      const fetchedPost = await fetchPostDetail(postId); // Lấy lại dữ liệu bài viết
      setComments(fetchedPost.comments || []);
      // Cập nhật bình luận mới vào state
      setComments((prevComments) => [...prevComments, response.data]);

      // Gửi thông báo đến server qua socket
      const notificationData = {
        postId,
        type: 'comment',
        username,
        avatar,
        userId,
      };
      socket.emit('sendNotification', notificationData);

      return response.data;
    } catch (err) {
      console.error('Error adding comment:', err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Unknown error';
        if (err.response?.status === 401) {
          throw new Error("Unauthorized access. Please log in again.");
        } else if (err.response?.status === 500) {
          throw new Error(`Server error: ${errorMessage}`);
        } else {
          throw new Error(`Failed to add comment: ${errorMessage}`);
        }
      } else {
        throw new Error(`Failed to add comment: ${(err as Error).message}`);
      }
    }
  };

  return { handleAddComment };
};


export default useAddcmt;
