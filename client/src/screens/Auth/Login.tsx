import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import jwt_decode, { jwtDecode } from "jwt-decode";
import { useAuth } from '../../stores/AuthContext';
import Button from '../../components/Forms/Button';
import logo from '../../assets/logo.png'; 

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
    e.preventDefault(); // Ngăn form submit mặc định

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
  <section className="h-screen">
    <div className="container h-full px-6 py-24">
      <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
        {/* background left */}
        <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
          <img
            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
            className="w-full"
            alt="Phone image"
          />
        </div>

        {/* form login */}
        <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
        {/* <div className="justify-center items-center flex ">
          <img
            src={logo}
            className="w-40"
            alt="logo"
          />
        </div> */}
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

            {/* <!-- Remember me checkbox --> */}
            <div className="mb-6 flex items-center justify-between">
              <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                <input
                  className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                  type="checkbox"
                  value=""
                  id="exampleCheck3"
                  defaultChecked
                />
                <label
                  className="inline-block pl-[0.15rem] hover:cursor-pointer"
                  htmlFor="exampleCheck3"
                >
                  Remember me
                </label>
              </div>

              {/* <!-- Forgot password link --> */}
              <a
                href="#!"
                className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
              >
                Forgot password?
              </a>
            </div>
            {/* <!-- Submit button --> */}
            <Button type="submit">
              Login
            </Button>
            </form>
            <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
              <p className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">
                OR
              </p>
            </div>

            {/* <!-- Social login buttons --> */}
            <Button
              type="button"
              className="bg-gray-300 mb-6 flex items-center justify-center text-blue-600 hover:bg-slate-500"
            >
              <img
                src="https://webimages.mongodb.com/_com_assets/cms/kr6fvgdym4qzsgqo3-Google%20Icon.svg?auto=format%252Ccompress"
                alt="Google Logo"
                className="w-5 h-5 mr-2" 
              />
              Continue with Google
            </Button>
            <p className="mt-4 text-sm text-gray-600 text-center">
              You dont have account?{" "}
              <a href="/register" className="text-blue-500 hover:text-blue-700">
                Register here
              </a>.
            </p>
  
          
        </div>
      </div>
    </div>
  </section>
);
}

export default Login;
