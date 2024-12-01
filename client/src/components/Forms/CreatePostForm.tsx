import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { ITag } from '../../types/ITag';
import { IPost } from '../../types/IPost';
import { fetchTags } from '../../services/postService';
import { FaFileAlt, FaFileImage, FaLock, FaGlobe, FaUserFriends } from 'react-icons/fa'; // Import các icon

interface PostFormProps {
  onPostCreated: (post: IPost) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImageOrVideo, setNewPostImageOrVideo] = useState<File | null>(null);
  const [newPostFile, setNewPostFile] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'friend' | 'private'>('public'); // Trạng thái cho visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Trạng thái mở dropdown
  const imageVideoInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  // Fetch all tags to create post
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchTags();
        setAvailableTags(tags);
      } catch (err) {
        setError("Failed to fetch tags");
      }
    };
    loadTags();
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPostContent(e.target.value);
  };

  const handleImageOrVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPostImageOrVideo(e.target.files[0]);
      setImgPreview(URL.createObjectURL(e.target.files[0])); 
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPostFile(e.target.files[0]);
      setFilePreview(URL.createObjectURL(e.target.files[0])); 
    }
  };

  const handleTagToggle = (tagname: string) => {
    setSelectedTag((prevSelectedTag) => (prevSelectedTag === tagname ? null : tagname));
  };

  const handleVisibilityChange = (visibility: 'public' | 'friend' | 'private') => {
    setVisibility(visibility);
    setIsDropdownOpen(false); // Đóng dropdown sau khi chọn
  };

  const uploadFile = async (file: File, fileType: 'imageOrVideo' | 'document') => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`http://localhost:5000/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url; // Nhận URL từ phản hồi
    } catch (error) {
      setError(`Failed to upload ${fileType}`);
      return null; // Trả về null nếu không thành công
    }
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
      let imageUrl = null;
      let videoUrl = null;

      if (newPostImageOrVideo) {
        const fileType = newPostImageOrVideo.type.split('/')[0]; 
        if (fileType === 'image') {
          imageUrl = await uploadFile(newPostImageOrVideo, 'imageOrVideo');
        } else if (fileType === 'video') {
          videoUrl = await uploadFile(newPostImageOrVideo, 'imageOrVideo');
        }

        if (!imageUrl && !videoUrl) return; 
      }

      let docUrl = null;
      if (newPostFile) {
        docUrl = await uploadFile(newPostFile, 'document');
        if (!docUrl) return; 
      }

      const newPost = {
        content: newPostContent,
        tag: selectedTag,
        image: imageUrl, 
        video: videoUrl,  
        doc: docUrl,
        visibility 
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
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (imageVideoInputRef.current) {
        imageVideoInputRef.current.value = '';
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      onPostCreated(response.data);

    } catch (err) {
      setError("Failed to create post");
    }
  };

  return (
    <section className="mb-8 p-1 bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Create a new post</h2>
        {/* Icon Visibility */}
        <div className="relative">
          <button
            className="flex items-center text-gray-500"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {visibility === 'public' && <FaGlobe />}
            {visibility === 'friend' && <FaUserFriends />}
            {visibility === 'private' && <FaLock />}
            <span className="ml-2">{visibility.charAt(0).toUpperCase() + visibility.slice(1)}</span> {/* Hiển thị trạng thái */}
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded shadow-md z-10">
              <button onClick={() => handleVisibilityChange('public')} className="block px-4 py-2 hover:bg-gray-200">Public</button>
              <button onClick={() => handleVisibilityChange('friend')} className="block px-4 py-2 hover:bg-gray-200">Friends</button>
              <button onClick={() => handleVisibilityChange('private')} className="block px-4 py-2 hover:bg-gray-200">Private</button>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900"
          rows={4}
          placeholder="What's on your mind?"
          value={newPostContent}
          onChange={handleContentChange}
        ></textarea>

        {/* Choose Image/Video and File inputs on the same row */}
        <div className="flex items-center gap-4 mb-4">
          {/* Image/Video Upload */}
          <label className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
            <FaFileImage className=" text-blue-500" />
            <span> Choose Image/Video</span>
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleImageOrVideoChange}
              ref={imageVideoInputRef}
            />
          </label>

          {/* File Upload */}
          <label className="flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600">
            <FaFileAlt className=" text-green-500" />
            <span>Choose File</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>
        </div>

        {/* Preview Section */}
        {filePreview || imgPreview && (
          <div className="mb-4">
            {newPostImageOrVideo && newPostImageOrVideo.type.startsWith('image/') ? (
              <img
                src={imgPreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : newPostImageOrVideo && newPostImageOrVideo.type.startsWith('video/') ? (
              <video
                src={imgPreview}
                controls
                className="w-32 h-32 rounded-lg"
              />
            ) : (
              // Display file icon and name for other file types
              <div className="flex items-center gap-2">
                <FaFileAlt className="text-gray-500" />
                <span>{newPostFile?.name}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags list */}
        <div className="mb-4 flex flex-wrap gap-2">
          <h3 className="mb-2 w-full">Select a tag:</h3>
          {availableTags && availableTags.length > 0 ? (
            availableTags.map((tag) => (
              <button
                type="button"
                key={tag._id}
                onClick={() => handleTagToggle(tag.tagname)}
                className={`px-4 py-2 rounded-lg ${
                  selectedTag === tag.tagname
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-600`}
              >
                {tag.tagname}
              </button>
            ))
          ) : (
            <p>No tags available</p>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Post
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </section>
  );
};

export default PostForm;
