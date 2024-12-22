import React from 'react';

interface DeleteConfirmationModalProps {
  onConfirm: () => void; 
  onCancel: () => void; 
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-5 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-sm w-full text-center">
        <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to delete this post?</p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-red-600"
            onClick={onConfirm}
          >
            OK
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
