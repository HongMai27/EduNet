// components/PostActions.tsx
import React from 'react';

interface PostActionsProps {
  postId: string;
  likes: string[];
  onLike: (postId: string, isLiked: boolean) => void;
}

const PostActions: React.FC<PostActionsProps> = ({ postId, likes, onLike }) => {
  const isLiked = likes.includes(localStorage.getItem('userId') || '');

  return (
    <div className="flex justify-around text-sm text-gray-500 dark:text-gray-400">
      <button
        className={`flex items-center space-x-2 ${isLiked ? 'text-blue-500' : 'hover:text-blue-500'}`}
        onClick={() => onLike(postId, isLiked)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
        <span>{likes.length} Like{likes.length !== 1 ? 's' : ''}</span>
      </button>

      <button className="flex items-center space-x-2 hover:text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 4a3 3 0 00-3 3v8a3 3 0 003 3h11l4 4v-4h1a3 3 0 003-3V7a3 3 0 00-3-3H5z"
          />
        </svg>
        <span>Comment</span>
      </button>

      <button className="flex items-center space-x-2 hover:text-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <span>Share</span>
      </button>
    </div>
  );
};

export default PostActions;
