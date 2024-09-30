import axios from 'axios';

const useAddcmt = () => {
  const handleAddComment = async (postId: string, content: string, image?: File | null) => {
    if (!content.trim()) {
      throw new Error("Comment content cannot be empty");
    }

    try {
      const commentData = {
        content,
        image: image ? await toBase64(image) : undefined, // Convert image to base64 if provided
      };

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error("No access token found. Please log in.");
      }

      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comment`,
        commentData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      ); 

      console.log('Comment added:', response.data);
      window.location.reload();
      return response.data; // Return the new comment for further use if needed
    } catch (err) {
      console.error('Error adding comment:', err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Unknown error';
        if (err.response?.status === 401) {
          throw new Error("Unauthorized access. Please log in again.");
        } else if (err.response?.status === 500) {
          throw new Error(`Server error: ${errorMessage}`);
        } else {
          throw new Error(`Failed to add comment: ${errorMessage}`);
        }
      } else {
        throw new Error(`Failed to add comment: ${(err as Error).message}`);
      }
    }
  };

  return { handleAddComment };
};

export default useAddcmt;

// Helper function to convert image file to base64
const toBase64 = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
