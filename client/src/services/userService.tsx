import axios from 'axios';
import { IUser } from '../types/IUser'; 

const API_URL = 'http://localhost:5000/api/auth/user';

// Fetch user by ID
export const fetchUserById = async (userId: string): Promise<IUser> => {
  const response = await axios.get<IUser>(`${API_URL}/${userId}`);
  return response.data;
};
