import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icon từ react-icons/fa

interface ChangePasswordFormProps {
  onSubmit: (oldPassword: string, newPassword: string, confirmPassword: string) => void;
  isLoading: boolean;
  statusMessage: string | null;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onSubmit, isLoading, statusMessage }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleOldPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(oldPassword, newPassword, confirmPassword); 
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Change Password</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm">
        Please enter your old password and new password.
      </p>
      
      {/* Old Password */}
      <div className="relative">
        <input
          type={showOldPassword ? 'text' : 'password'}
          placeholder="Old Password"
          value={oldPassword}
          onChange={handleOldPasswordChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
        />
        <div 
          className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400"
          onClick={() => setShowOldPassword(!showOldPassword)}
        >
          {showOldPassword ? <FaEyeSlash /> : <FaEye />} {/* Hiển thị icon tùy vào trạng thái */}
        </div>
      </div>

      {/* New Password */}
      <div className="relative">
        <input
          type={showNewPassword ? 'text' : 'password'}
          placeholder="New Password"
          value={newPassword}
          onChange={handleNewPasswordChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
        />
        <div 
          className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400"
          onClick={() => setShowNewPassword(!showNewPassword)}
        >
          {showNewPassword ? <FaEyeSlash /> : <FaEye />} {/* Hiển thị icon tùy vào trạng thái */}
        </div>
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
        />
        <div 
          className="absolute right-3 top-3 cursor-pointer text-gray-500 dark:text-gray-400"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />} {/* Hiển thị icon tùy vào trạng thái */}
        </div>
      </div>

      <button
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save'}
      </button>

      {statusMessage && (
        <p className={`mt-4 text-center ${statusMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default ChangePasswordForm;
