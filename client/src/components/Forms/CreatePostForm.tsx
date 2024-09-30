import React, { useRef, useState, useEffect } from 'react'; 
import axios from 'axios';
import { ITag } from '../../types/ITag';
import { IPost } from '../../types/IPost';
import { fetchTags } from '../../services/postService';

interface PostFormProps {
  onPostCreated: (post: IPost) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<ITag[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  //fetch all tag to create post
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchTags(); 
        console.log("Response Data:", tags); 
        setAvailableTags(tags); 
      } catch (err) {
        console.error("Error fetching tags:", err);
        setError("Failed to fetch tags");
      }
    };
    loadTags(); 
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPostContent(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPostImage(e.target.files[0]);
    }
  };

  const handleTagToggle = (tagname: string) => {
    setSelectedTag((prevSelectedTag) => (prevSelectedTag === tagname ? null : tagname));
  };

  const toBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPostContent.trim() === '') {
      setError("Content cannot be empty");
      return;
    }

    if (!selectedTag) {
      setError("Please select a tag"); 
      return;
    }

    try {
      const newPost = {
        content: newPostContent,
        tag: selectedTag, 
        image: newPostImage ? await toBase64(newPostImage) : undefined
      };

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError("No access token found. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/posts",
        newPost, 
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      setNewPostContent('');
      setNewPostImage(null);
      setSelectedTag(null);  
      setError(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onPostCreated(response.data);

    } catch (err) {
      console.error('Error:', err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.msg || 'Unknown error';
        if (err.response?.status === 401) {
          setError("Unauthorized access. Please log in again.");
        } else if (err.response?.status === 500) {
          setError(`Server error: ${errorMessage}`);
        } else {
          setError(`Failed to create post: ${errorMessage}`);
        }
      } else {
        setError(`Failed to create post: ${(err as Error).message}`);
      }
    }
  };

  return (
    <section className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create a new post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900"
          rows={4}
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={handleContentChange}
        ></textarea>
        <input
          type="file"
          accept="image/*"
          className="mb-4"
          onChange={handleImageChange}
          ref={fileInputRef}
        />

        {/* Display available tags as buttons */}
        <div className="mb-4 flex flex-wrap gap-2">
          <h3 className="mb-2 w-full">Select a tag:</h3>
          {availableTags && availableTags.length > 0 ? (
            availableTags.map((tag) => (
              <button
                type="button"
                key={tag._id}
                onClick={() => handleTagToggle(tag.tagname)}
                className={`px-4 py-2 rounded-lg ${
                  selectedTag === tag.tagname ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-600`}
              >
                {tag.tagname}
              </button>
            ))
          ) : (
            <p>No tags available</p>  
          )}
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Post
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </section>
  );
};

export default PostForm;
