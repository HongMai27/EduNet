import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../stores/AuthContext';
import Button from '../../components/Forms/Button';
import { GoogleLogin } from '@react-oauth/google'; // Import from @react-oauth/google

interface DecodedToken {
  userId: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { setUserId } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('accessToken', token);
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userId = decodedToken.userId;
      localStorage.setItem('userId', userId);
      setUserId(userId);
      navigate('/home');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ msg: string }>;
        setError(axiosError.response?.data.msg || "An unexpected error occurred.");
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  // Google login success handler
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/google-login', {
        token,
      });
  
      const { accessToken, userId, username } = response.data;
  
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
  
      setUserId(userId);
      navigate('/home');
    } catch (error) {
      console.error("Failed to log in with Google:", error);
      setError("Failed to log in with Google.");
    }
  };
  

  //  error handler
  const handleGoogleLoginFailure = () => {
    console.error("Google login failed.");
    setError("Failed to log in with Google.");
  };

  return (
    <section className="h-screen bg-slate-50">
      <div className="flex flex-wrap items-center justify-center lg:justify-between container h-full px-20 py-24 ">
        {/* background left */}
        <div className="mb-12 lg:w-6/12">
          <img
            src="https://img.freepik.com/premium-photo/group-people-holding-up-banner-that-says-welcome_1244314-7335.jpg?semt=ais_hybrid"
            className="w-full"
            alt="Phone image"
          />
        </div>

        {/* form login */}
        <div className="lg:w-5/12">
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

            {/* Submit button */}
            <Button type="submit">
              Login
            </Button>
          </form>

          <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
            <p className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">
              OR
            </p>
          </div>

          {/* Login with Google */}
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess} 
            onError={handleGoogleLoginFailure}     
          />

          <p className="mt-4 text-sm text-gray-600 text-center">
            You don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:text-blue-700">
              Register here
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
