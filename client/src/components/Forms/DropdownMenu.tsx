import React from 'react';
import axios from 'axios';
import { FaEllipsisV } from 'react-icons/fa';
import { IPost } from '../../types/IPost';
import { useAuth } from '../../stores/AuthContext';
import { deletePost } from '../../services/postService';

interface DropdownMenuButtonProps {
  post: IPost;
}

const DropdownMenuButton: React.FC<DropdownMenuButtonProps> = ({ post }) => {
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  const handleClickOutside = (e: Event) => {
    const target = e.target as Element;
    if (isOpen && !target.closest('.dropdown-menu')) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDelete = async () => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this post?');
      if (!isConfirmed) {
        return;
      }
  
      await deletePost(post._id); 
  
      alert('Post deleted successfully');
      setTimeout(() => {
        window.location.reload();
      }, 200); 
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post: ' + (err as Error).message);
    } finally {
      setIsOpen(false);
    }
  };
  

  return (
    <div className="relative inline-block text-left dropdown-menu">
      <FaEllipsisV
        onClick={toggleDropdown}
        className="w-5 h-5 text-gray-500 dark:text-gray-400 cursor-pointer"
      />
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dropdown-menu">
          <ul className="list-none p-2">
            <li
              onClick={handleDelete}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i className="fas fa-trash mr-2 text-black dark:text-white"></i>
              Delete
            </li>
             {/*  userId = authorId then show Edit else Report */}
             {userId === post.user?._id ? (
              <li
                onClick={handleDelete}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="fas fa-edit mr-2 text-black dark:text-white"></i>
                Edit
              </li>
            ) : (
              <li
                onClick={handleDelete}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="fas fa-flag mr-2 text-black dark:text-white"></i>
                Report
              </li>
            )}
            <li
               onClick={handleDelete}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i className="fas fa-save mr-2 text-black dark:text-white"></i>
              Save
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenuButton;
