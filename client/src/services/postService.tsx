import axios from "axios";
import { IPost } from "../types/IPost";

const API_URL = 'http://localhost:5000/api/posts';

//get all post
export const fetchPosts = async (): Promise<IPost[]> => {
  const token = localStorage.getItem("accessToken");
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.sort(
    (a: IPost, b: IPost) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};  

//get post by id
export const fetchPostDetail = async (postId: string): Promise<IPost> => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.get(`${API_URL}/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return response.data;
  };

// create post
  export const createPost = async (newPost: Omit<IPost, '_id'>): Promise<IPost> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error("No access token found. Please log in.");
    }
  
    const response = await axios.post(
      API_URL,
      newPost,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );
  
    return response.data;
  };

  // delete post 
  export const deletePost = async (postId: string) => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('No access token found');
    }
  
    const response = await axios.delete(`${API_URL}/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data; 
  };

// get all tag
  export const fetchTags = async () => {
    const token = localStorage.getItem("accessToken"); 
    const response = await axios.get("http://localhost:5000/api/posts/tag", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  };