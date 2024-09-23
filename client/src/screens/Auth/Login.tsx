import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import jwt_decode, { jwtDecode } from "jwt-decode";
import { useAuth } from '../../stores/AuthContext';

interface DecodedToken {
  userId: string;
}
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const {setUserId} = useAuth();


  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Ngăn không cho form submit mặc định

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('accessToken', token);
      console.log({token});
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userId = decodedToken.userId;
      localStorage.setItem('userId', userId); 
      console.log("Logged in user ID:", userId);
      setUserId(userId);
      navigate('/home');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ msg: string }>;
        if (axiosError.response) {
          setError(axiosError.response.data.msg || "An unexpected error occurred.");
        } else {
          setError("An unexpected error occurred.");
        }
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h2>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="text-red-500 text-sm mb-4">{error}</div>
          )}

          {/* Input email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
              autoComplete="email"
            />
          </div>

          {/* Input password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        {/* href rigister */}
        <p className="mt-4 text-sm text-gray-600 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:text-blue-700">
            Register here
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
