import { useState } from "react";
import axios from "axios";

const useLike = () => {
  const [error, setError] = useState<string | null>(null);

  const handleLike = async (postId: string, isLiked: boolean, setPosts: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      const token = localStorage.getItem('accessToken');
      const url = isLiked
        ? `http://localhost:5000/api/posts/${postId}/unlike`
        : `http://localhost:5000/api/posts/${postId}/like`;

      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const updatedLikes = response.data.likes || [];
      setPosts((prevPosts) => prevPosts.map(post =>
        post._id === postId
          ? { ...post, likes: updatedLikes }
          : post
      ));
    } catch (err) {
      console.error("Error liking/unliking post:", err);
      setError("Failed to like/unlike post");
    }
  };

  return { handleLike, error };
};

export default useLike;
