// components/PostActions.tsx
import React from 'react';
import { FaComment, FaShare, FaThumbsUp } from 'react-icons/fa';

interface PostActionsProps {
  postId: string;
  likes: string[];
  onLike: (postId: string, isLiked: boolean) => void;
}

const PostActions: React.FC<PostActionsProps> = ({ postId, likes, onLike }) => {
  const isLiked = likes.includes(localStorage.getItem('userId') || '');

  return (
    <div className="flex justify-around text-sm text-gray-500 dark:text-gray-400">
    {/* Like Button */}
    <button
      className={`flex items-center space-x-2 ${isLiked ? 'text-blue-500' : 'hover:text-blue-500'}`}
      onClick={() => onLike(postId, isLiked)}
    >
      <FaThumbsUp className="w-5 h-5" />
      <span>{likes.length} Like{likes.length !== 1 ? 's' : ''}</span>
    </button>

    {/* Comment Button */}
    <button className="flex items-center space-x-2 hover:text-blue-500">
      <FaComment className="w-5 h-5" />
      <span>Comment</span>
    </button>

    {/* Share Button */}
    <button className="flex items-center space-x-2 hover:text-blue-500">
      <FaShare className="w-5 h-5" />
      <span>Share</span>
    </button>
  </div>
  );
};

export default PostActions;
