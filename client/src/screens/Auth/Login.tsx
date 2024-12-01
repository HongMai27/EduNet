import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../stores/AuthContext';
import Button from '../../components/Forms/Button';
import { GoogleLogin } from '@react-oauth/google'; 
import { updateUserStatus } from '../../hooks/updateStatus';
import { googleLogin, login } from '../../services/authService';
import axios from 'axios';


const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { setUserId } = useAuth();

  // Hàm xử lý login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Gọi API login để lấy token và userId
      const { token, userId } = await login(email, password);
      
      // Lưu userId vào AuthContext
      setUserId(userId);
      
      // Cập nhật trạng thái người dùng
      await updateUserStatus(true);

      // Gọi API để lấy thông tin người dùng và role
      const response = await axios.get(`http://localhost:5000/api/auth/userinfor/${userId}`);
      const { role } = response.data;  // Lấy role từ API

      // Điều hướng tùy vào role
      if (role === 'admin') {
        navigate('/admin');  // Nếu là admin thì chuyển đến trang admin
      } else {
        navigate('/home');  // Nếu là user thì chuyển đến trang home
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Google login
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    try {
      const { accessToken, userId, username } = await googleLogin(token);  
      setUserId(userId);
      await updateUserStatus(true); 
      navigate('/home');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Error handler gg login
  const handleGoogleLoginFailure = () => {
    console.error("Google login failed.");
    setError("Failed to log in with Google.");
  };

  return (
    <section
      className="h-screen bg-cover bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url('https://png.pngtree.com/thumb_back/fh260/background/20210115/pngtree-blue-gradient-web-ui-background-image_518658.jpg')`,
      }}
    >
      <div className="flex flex-wrap items-center justify-center lg:justify-between container h-full px-20 py-24  bg-opacity-80 rounded-lg shadow-lg backdrop-blur-sm">
        {/* Background left */}
        <div className="mb-12 lg:w-6/12">
          <img
            src="https://static.vecteezy.com/system/resources/thumbnails/014/430/730/small/welcome-lettering-with-black-color-png.png"
            className="w-full"
            alt="Phone image"
          />
        </div>
  
        {/* Form login */}
        <div className="lg:w-5/12">
          <form onSubmit={handleLogin}>
            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}
  
            {/* Input email */}
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="email"
              >
                Email
              </label>
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
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="password"
              >
                Password
              </label>
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
            <Button type="submit">Login</Button>
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
  
          {/* Forget Password Link */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            <a href="/forgot-password" className="text-blue-500 hover:text-blue-700">
              Forgot password?
            </a>
          </p>
  
          <p className="mt-4 text-sm text-gray-600 text-center">
            You don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:text-blue-700">
              Register here
            </a>
          </p>
        </div>
      </div>
    </section>
  );
  
}

export default Login;
