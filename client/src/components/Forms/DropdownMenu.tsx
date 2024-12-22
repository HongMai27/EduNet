import React, { useEffect, useState } from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import { IPost } from '../../types/IPost';
import { useAuth } from '../../stores/AuthContext';
import { deletePost, reportPost, savePost, unsavePost } from '../../services/postService';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '../Modals/DeleteModal';
import { toast } from 'react-toastify';
import ReportModal from '../Modals/ReportModal';
import { sendStar } from '../../services/userService';

interface DropdownMenuButtonProps {
  post: IPost;
  onDelete: (postId: string) => void;
}

const DropdownMenuButton: React.FC<DropdownMenuButtonProps> = ({ post, onDelete }) => {
  const { userId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false); 
  const [showDeleteModal, setShowDeleteModal] = useState(false); 
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const navigate = useNavigate();

  const reasons = [
    'Spam or misleading',
    'Hate speech or abusive content',
    'Violence or harmful behavior',
    'Sexually explicit content',
    'Other',
  ];

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

  useEffect(() => {
    const savedPostStatus = localStorage.getItem(`savedPost-${post._id}`);
    if (savedPostStatus === "true") {
      setIsSaved(true);
    }
  }, [post._id]);

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // open modal delete
  const handleDelete = () => {
    setShowDeleteModal(true); 
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(post._id); 
      toast.success('Post deleted successfully');
      onDelete(post._id);
  
    } catch (err) {
      toast.error('Failed to delete post: ' + (err as Error).message);
    } finally {
      setIsOpen(false); 
      setShowDeleteModal(false); 
    }
  };
  
  const handleReport = async (reason: string) => {
    if (!reason) {
      toast.error('Please select a reason for reporting.');
      return;
    }

    const accessToken = localStorage.getItem('accessToken'); 
    const reportedEntityId = post._id;
    if (!reportedEntityId) {
      toast.error('You must be logged in to report');
      return;
    }
    if (!accessToken) {
      toast.error('You must be logged in to report');
      return;
    }

    try {
      await reportPost(reportedEntityId, reason, accessToken);
      toast.success('Post reported successfully!');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error reporting post.";
      toast.error(errorMsg);
    } finally {
      setIsReportModalOpen(false); 
    }
  };

  
  const handleCancelDelete = () => {
    setShowDeleteModal(false); 
  };

  const handleRedirectToEdit = () => {
    navigate(`/editpost`, { state: { postId: post._id, postContent: post.content, tag: post.tag } });
  };

  const handleSave = async () => {
    try {
      const response = await savePost(post._id);  
      if (response && response.message === "Post saved successfully") {
        setIsSaved(true);  
        localStorage.setItem(`savedPost-${post._id}`, "true");  
        toast.success('Saved post!');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Error saving post!');
    }
  };

  // Unsave post
  const handleUnsave = async () => {
    try {
      const response = await unsavePost(post._id);
      if (response && response.message === "Post unsaved successfully") {
        setIsSaved(false);
        localStorage.removeItem(`savedPost-${post._id}`);
        toast.success('Post unsaved!');
      }
    } catch (error) {
      console.error('Error unsaving post:', error);
      toast.error('Error unsaving post!');
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
          {userId === post.user?._id ? (
            <li
              onClick={handleDelete}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i className="fas fa-trash mr-2 text-black dark:text-white"></i>
              Delete
            </li>
          ):(
            <li
              onClick={()=> sendStar(post.user._id)}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <i className="fas fa-star mr-2 text-black dark:text-white"></i>
              Send star
            </li>
          )}

            {userId === post.user?._id ? (
              <li
                onClick={handleRedirectToEdit} 
                className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="fas fa-edit mr-2 text-black dark:text-white"></i>
                Edit
              </li>
            ) : (
              <li
                onClick={() => setIsReportModalOpen(true)}
                className="px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <i className="fas fa-flag mr-2 text-black dark:text-white"></i>
                Report
              </li>
            )}
              <li
        onClick={isSaved ? handleUnsave : handleSave}
        className={`px-4 py-2 text-gray-700 dark:text-gray-200 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 `}
      >
        <i className="fas fa-save mr-2 text-black dark:text-white"></i>
        {isSaved ? "Unsave" : "Save"}
      </li>
          </ul>
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleConfirmDelete} 
          onCancel={handleCancelDelete}  
        />
      )}
      {/* Report Modal */}
      <ReportModal
        isVisible={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitReport={handleReport}
        reasons={reasons}
      />
    </div>
  );
};

export default DropdownMenuButton;
