import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // handle register
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
        confirmPassword,
      });
      
      console.log("Registration successful.");
      alert('Registration successful! You can login now.');
      navigate('/login'); 
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
    <div 
      className="flex h-screen justify-center items-center bg-cover bg-no-repeat" 
      style={{ backgroundImage: `url('https://png.pngtree.com/thumb_back/fh260/background/20210115/pngtree-blue-gradient-web-ui-background-image_518658.jpg')` }}
    >
      <div className="flex space-x-8">
        {/* Ô đầu tiên */}
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg backdrop-blur-md bg-opacity-80">
          <p className="text-gray-600 text-justify mb-4">
          Edunet is an innovative online platform designed to foster the sharing and dissemination of knowledge across diverse domains. 
          It serves as a collaborative space where educators, learners, and professionals can connect, exchange ideas, and access a wide range of educational resources. 
          With user-friendly features and a commitment to inclusivity, Edunet empowers users to create and share content such as tutorials, articles, and courses, making learning more accessible to everyone. 
          Its mission is to bridge knowledge gaps, inspire lifelong learning, and cultivate a global community united by the pursuit of education and growth.
          </p>
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Welcome to Edunet</h2>

          
        </div>
  
        {/* Ô form đăng ký */}
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg backdrop-blur-md bg-opacity-80">
          <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Create an Account</h2>
  
          <form onSubmit={handleRegister}>
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
  
            {/* Input name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Enter your name"
                required
              />
            </div>
  
            {/* Input email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
  
            {/* Input password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
            </div>
  
            {/* Input confirm password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Confirm your password"
                required
              />
            </div>
  
            {/* Nút đăng ký */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-lg transform hover:scale-105"
            >
              Register
            </button>
          </form>
  
          {/* Liên kết đến trang đăng nhập */}
          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:text-blue-700 font-semibold">
              Login here
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
  
};

export default Register;
