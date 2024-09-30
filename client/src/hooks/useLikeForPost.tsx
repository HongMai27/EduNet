import { useState } from "react";
import axios from "axios";
import { IPost } from "../types/IPost";

const useLikeForPost = () => {
  const [error, setError] = useState<string | null>(null);

  const handleLike = async (postId: string, isLiked: boolean, setPost: React.Dispatch<React.SetStateAction<IPost | null>>) => {
    try {
      const token = localStorage.getItem("accessToken");
      const url = isLiked
        ? `http://localhost:5000/api/posts/${postId}/unlike`
        : `http://localhost:5000/api/posts/${postId}/like`;

      const response = await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedLikes = response.data.likes || [];
      setPost((prevPost) => 
        prevPost && prevPost._id === postId
          ? { ...prevPost, likes: updatedLikes }
          : prevPost
      );
    } catch (err) {
      console.error("Error liking/unliking post:", err);
      setError("Failed to like/unlike post");
    }
  };

  return { handleLike, error };
};

export default useLikeForPost;
