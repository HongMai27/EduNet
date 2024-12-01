import React, { useState } from 'react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
  statusMessage: string | null;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onSubmit, isLoading, statusMessage }) => {
  const [email, setEmail] = useState<string>(localStorage.getItem('email') || '');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(email);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-center mb-4">Forgot Password</h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-sm">
        Please check your email, we will send you a new password.
      </p>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleEmailChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 dark:bg-gray-700 dark:text-white"
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send'}
      </button>

      {statusMessage && (
        <p className={`mt-4 text-center ${statusMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
};

export default ForgotPasswordForm;
