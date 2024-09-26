import React from 'react';
import axios from 'axios';
import { FaEllipsisV } from 'react-icons/fa';
import { IPost } from '../../types/IPost';
import { useAuth } from '../../stores/AuthContext';

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
  
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
  
      const response = await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        alert('Post deleted successfully');
        setTimeout(() => {
          window.location.reload();
        }, 200); 
      } else {
        alert('Failed to delete post');
      }
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
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg dropdown-menu">
          <ul className="list-none p-2">
            <li
              onClick={handleDelete}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Delete
            </li>
             {/*  userId = authorId then show Edit else Report */}
             {userId === post.user?._id ? (
              <li
                onClick={handleDelete}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Edit
              </li>
            ) : (
              <li
                onClick={handleDelete}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Report
              </li>
            )}
            <li
               onClick={handleDelete}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Favorite
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenuButton;
