import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:5000/api/auth';

    //login
    export const login = async (email: string, password: string) => {
        try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
        });
    
        const { token } = response.data;
        const decodedToken = jwtDecode<{ userId: string }>(token);
        const userId = decodedToken.userId;
    
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('email', email);
    
        return { token, userId, email };
        } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const axiosError = err as AxiosError<{ msg: string }>;
            throw new Error(axiosError.response?.data.msg || "An unexpected error occurred.");
        } else {
            throw new Error("An unknown error occurred.");
        }
        }
    };
  
    // gg login
    export const googleLogin = async (credential: string) => {
        try {
        const response = await axios.post(`${API_URL}/google-login`, {
            token: credential,
        });
    
        const { accessToken, userId, username, email } = response.data;
    
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
    
        return { accessToken, userId, username };
        } catch (error) {
        console.error("Failed to log in with Google:", error);
        throw new Error("Failed to log in with Google.");
        }
    };

    // forgot password
    export const requestPasswordReset = async (email: string): Promise<string> => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email });
        return response.data.message;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || "Unknown error occurred");
        } else {
        throw new Error("An unexpected error occurred. Please try again.");
        }
    }
    };

    //change pass
    export const changePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        try {

          const token = localStorage.getItem('accessToken');
          if (!token) {
            throw new Error('No access token found. Please log in.');
          }
      
          const response = await axios.put(
            `${API_URL}/change-pass`,
            { oldPassword, newPassword, confirmPassword },  
            {
              headers: {
                Authorization: `Bearer ${token}`,  
              },
            }
          );
      
          return response.data.msg;  
        } catch (error: any) {
          if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'Unknown error occurred');
          } else {
            throw new Error('An unexpected error occurred. Please try again.');
          }
        }
      };
      