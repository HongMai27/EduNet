import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LikeListFormProps {
  postId: string;
  onClose: () => void;  
}

interface User {
  _id: string;
  username: string;
  avatar: string;
}

const LikeListForm: React.FC<LikeListFormProps> = ({ postId, onClose }) => {
  const [likes, setLikes] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Gọi API để lấy danh sách người like
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${postId}/likes`);
        setLikes(response.data.likes);  
        setLoading(false);
      } catch (err) {
        setError('Failed to load likes');
        setLoading(false);
      }
    };

    fetchLikes();
  }, [postId]);

  // Hiển thị thông báo loading hoặc lỗi
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 relative">
      <h2 className="text-xl font-bold mb-4">People who liked this post</h2>
    
  
      {/* Kiểm tra nếu chưa ai like thì hiển thị thông báo */}
      {likes.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No likes yet</p>
      ) : (
        <ul>
          {likes.map((user) => (
            <li key={user._id} className="flex items-center mb-4">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-8 h-8 rounded-full mr-3"
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default LikeListForm;
