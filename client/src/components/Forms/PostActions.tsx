import React, { useState } from 'react';
import { FaComment, FaShare, FaThumbsUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface PostActionsProps {
  postId: string;
  likes: string[];
  onLike: (postId: string, isLiked: boolean) => void;
  onAddComment: (postId: string, content: string) => Promise<void>; 
}


const PostActions: React.FC<PostActionsProps> = ({ postId, likes, onLike, onAddComment }) => {
  const isLiked = likes.includes(localStorage.getItem('userId') || '');
  const [commentContent, setCommentContent] = useState(''); 
  const navigate = useNavigate();

  const handleCommentSubmit = () => {
    if (commentContent.trim()) { 
      onAddComment(postId, commentContent); 
      setCommentContent(''); // Reset 
    } 
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-around text-sm text-gray-500 dark:text-gray-400 mb-4">
        {/* Like Button */}
        <button
          className={`flex items-center space-x-2 ${isLiked ? 'text-blue-500' : 'hover:text-blue-500'}`}
          onClick={() => onLike(postId, isLiked)}
        >
          <FaThumbsUp className="w-5 h-5" />
          <span>{likes.length} Like{likes.length !== 1 ? 's' : ''}</span>
        </button>

        {/* Comment Button */}
        <button className="flex items-center space-x-2 hover:text-blue-500" onClick={() => navigate(`/detail/${postId}`)}>
          <FaComment className="w-5 h-5" />
          <span>Comment</span>
        </button>

        {/* Share Button */}
        <button className="flex items-center space-x-2 hover:text-blue-500" onClick={() => {}}>
          <FaShare className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Input */}
      <div className="flex items-center">
        <input
          type="text"
          className="border rounded-md px-2 py-1 flex-grow text-black h-15 dark:bg-gray-800 dark:text-white"
          placeholder="Add a comment..."
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Ngăn chặn hành vi mặc định
              handleCommentSubmit(); 
            }
          }} 
        />
        <button
          className="bg-blue-500 text-white rounded-md px-4 py-1 ml-2"
          onClick={handleCommentSubmit}
        >
          Add
        </button>
      </div>

    </div>
  );
};

export default PostActions;
