import axios from 'axios';
import { IUser } from '../types/IUser'; 

const API_URL = 'http://localhost:5000/api/auth';

// Fetch user by ID
export const fetchUserById = async (userId: string): Promise<IUser> => {
  const response = await axios.get<IUser>(`${API_URL}/user/${userId}`);
  return response.data;
};
 
//fetch friend
export const fetchFriends = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  const response = await axios.get(`${API_URL}/friend`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

//fetch suggest friend
export const fetchSuggest = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  const response = await axios.get(`${API_URL}/suggest`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

//fetch followings & flollowers
export const fetchFollow = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  const response = await axios.get(`${API_URL}/getfollow`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; 
};

//add friend
export const addFriend = async (targetUserId: string) => {
  const token = localStorage.getItem('accessToken'); 

  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }

  const response = await axios.put(
    `${API_URL}/follow/${targetUserId}`,
    {}, 
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );

  return response.data; 
};

// unfollow
export const unfriend = async (targetUserId: string) => {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    throw new Error("No authentication token found. Please login.");
  }

  const response = await axios.put(
    `${API_URL}/unfollow/${targetUserId}`, 
    {}, // An empty object for the request body if no data is needed
    {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    }
  );

  console.log({ token });

  return response.data; 
};