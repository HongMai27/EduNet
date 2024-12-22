import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../stores/AuthContext';
import Button from '../../components/Forms/Button';
import { GoogleLogin } from '@react-oauth/google'; 
import { updateUserStatus } from '../../hooks/updateStatus';
import { googleLogin, login } from '../../services/authService';
import LogoImage from '../../image/logo.png'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { fetchUserInfo } from '../../services/userService';


const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const { setUserId, setAvatar, setUsername } = useAuth();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token, userId } = await login(email, password);
      setUserId(userId);
      
      await updateUserStatus(true);

      const { role, avatar, username } = await fetchUserInfo(userId);    
      localStorage.setItem('avatar', avatar);
      localStorage.setItem('username', username);
      setAvatar(avatar);
      setUsername(username);

      if (role === 'admin') {
        navigate('/admin');  
      } else {
        navigate('/home');  
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // Google login
  const handleGoogleLoginSuccess = async (credentialResponse: any) => {
    const token = credentialResponse.credential;

    try {
      const { accessToken, userId} = await googleLogin(token);  
      setUserId(userId);
      await updateUserStatus(true); 
      const { role, avatar, username } = await fetchUserInfo(userId);
      localStorage.setItem('avatar', avatar);
      localStorage.setItem('username', username);
      setAvatar(avatar);
      setUsername(username);
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
      {/* Form Container */}
      <div className="bg-white/70 backdrop-blur-lg p-8 rounded-lg shadow-lg max-w-md w-full ">
        {/* Logo */}
        <div className="mb-6">
          <img
            src={LogoImage}
            className="w-60 h-20 mx-auto"
            alt="Logo"
          />
        </div>
  
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
      <div className="mb-6 relative">
        <label
          className="block text-sm font-medium text-gray-700 mb-1"
          htmlFor="password"
        >
          Password
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your password"
          required
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-2/3 right-3 transform -translate-y-2/4 text-gray-500 hover:text-gray-700"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full">Login</Button>
    </form>
  
        {/* Divider */}
        <div className="my-4 flex items-center before:flex-1 before:border-t before:border-neutral-300 after:flex-1 after:border-t after:border-neutral-300">
          <p className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">
            OR
          </p>
        </div>
  
        {/* Login with Google */}
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginFailure}
        />
  
        {/* Forget Password */}
        <p className="mt-4 text-sm text-gray-600 text-center">
          <a href="/forgot-password" className="text-blue-500 hover:text-blue-700">
            Forgot password?
          </a>
        </p>
  
        {/* Register */}
        <p className="mt-4 text-sm text-gray-600 text-center">
          You don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:text-blue-700">
            Register here
          </a>
        </p>
      </div>
    </section>
  );
  
}

export default Login;
