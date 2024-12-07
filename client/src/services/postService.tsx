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

  //delete comment
  export const deleteComment = async (postId: string, commentId: string) => {
    const token = localStorage.getItem('accessToken');
  
    if (!token) {
      throw new Error('No access token found');
    }
  
    const response = await axios.delete(`${API_URL}/${postId}/comment/${commentId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    return response.data;
  };
  

  //edit comment
  export const editComment = async (postId: string, commentId: string, newContent: string) => {
    const token = localStorage.getItem('accessToken');
  
    if (!token) {
      throw new Error('No access token found');
    }
  
    const response = await axios.put(`${API_URL}/${postId}/comment/${commentId}`,
      { content: newContent },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  
    return response.data;
  };
  

// get all tag
  export const fetchTags = async () => {
    const token = localStorage.getItem("accessToken"); 
    const response = await axios.get(`${API_URL}/tag`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  };


  //edit post
  export const editPost = async (postId: string, data: any) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        throw new Error("No access token found. Please log in.");
    }

    const response = await axios.put(`${API_URL}/${postId}`, data, {
        headers: {
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${token}` 
        }
    });

    return response.data; 
  };

// Save a post
export const savePost = async (postId: string): Promise<any> => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.post(`${API_URL}/save-post/${postId}`,  {},
      {
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}`,  
        },
      }
    );
    return response.data;  
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;  
  }
};

// Unsave a post
export const unsavePost = async (postId: string): Promise<any> => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.post(`${API_URL}/unsave/${postId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error unsaving post:', error);
    throw error;
  }
};

// Get saved posts of the user
export const getSavedPosts = async (userId: string): Promise<any> => {
  const token = localStorage.getItem("accessToken");

  try {
    const response = await axios.get(`${API_URL}/getsaved/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;  // Trả về danh sách bài viết đã lưu
  } catch (error) {
    console.error('Error fetching saved posts:', error);
    throw error;  // Nếu có lỗi, ném lỗi ra ngoài
  }
};
