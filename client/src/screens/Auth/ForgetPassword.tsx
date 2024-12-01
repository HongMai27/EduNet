import React, { useState } from 'react';
import { requestPasswordReset } from '../../services/authService';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const responseMessage = await requestPasswordReset(email); 
      setMessage(responseMessage); 
    } catch (error) {
      setMessage((error as Error).message); 
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side - Image */}
      <div className="w-1/2 bg-blue-100">
        <img
          src="https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1095.jpg"  
          alt="Forgot Password"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-1/2 flex justify-center items-center bg-white p-8">
        <div className="w-full max-w-sm">
          <h2 className="text-center text-3xl font-semibold text-blue-600 mb-6">Forgot Password?</h2>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Please enter your email address you'd like your password reset information send to
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              placeholder="Your email"
              required
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Send
            </button>
            <p className="mt-4 text-sm text-gray-600 text-center">
            <a href="/login" className="text-blue-500 hover:text-blue-700">
              Back to Login
            </a>
          </p>
          </form>
          {message && (
            <p className="mt-6 text-center text-sm text-gray-700 bg-gray-100 p-2 rounded-lg">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
