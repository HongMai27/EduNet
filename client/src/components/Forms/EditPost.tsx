import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { editPost, fetchTags } from '../../services/postService';
import { ITag } from '../../types/ITag';
import { FaFileAlt, FaFileImage, FaGlobe, FaLock, FaUserFriends } from 'react-icons/fa';

const EditPostModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visibility, setVisibility] = useState<'public' | 'friend' | 'private'>('public'); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { postId, postContent, image, tag: selectedTagId } = location.state || {};
  const [content, setContent] = useState(postContent || '');
  const [selectedImage, setSelectedImage] = useState<string | null>(image || null);
  const [selectedTag, setSelectedTag] = useState<string | null>(selectedTagId || null);
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  

  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await fetchTags(); 
        setAvailableTags(tags); // Lấy danh sách các thẻ từ API
      } catch (err) {
        setError("Failed to fetch tags");
      }
    };
    loadTags();
  }, []);

  useEffect(() => {
    if (!postId) {
      setError('No post data to edit');
    }
  }, [postId]);

  const handleTagToggle = (tagId: string) => {
    setSelectedTag((prev) => (prev === tagId ? null : tagId));
  };


  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedPost = {
        content,
        image: selectedImage,
        visibility,
        tag: selectedTag,
      };

      await editPost(postId, updatedPost);
      navigate(`/detail/${postId}`, { replace: true });
      alert('Post updated successfully!');
    } catch (err) {
      setError('Failed to update post: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };



  const handleVisibilityChange = (visibility: 'public' | 'friend' | 'private') => {
    setVisibility(visibility);
    setIsDropdownOpen(false); 
  };
  const handleCancel = () => {
    navigate(-1); 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-3xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Edit Post</h2>
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
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSaveChanges}>
          <textarea
            className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 text-black dark:text-white"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <div className="mb-4 flex flex-wrap gap-2">
            <h3 className="mb-2 w-full text-black dark:text-white">Select a tag:</h3>
            {availableTags && availableTags.length > 0 ? (
              availableTags.map((tag) => (
                <button
                  type="button"
                  key={tag._id}
                  onClick={() => handleTagToggle(tag._id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedTag === tag._id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  } hover:bg-blue-600`}
                >
                  {tag.tagname}
                </button>
              ))
            ) : (
              <p className="text-black dark:text-white">No tags available</p>
            )}
          </div>

          {selectedImage && (
            <div className="mb-4 flex justify-center">
              <img src={selectedImage} alt="Post" className="w-32 h-auto rounded-lg" />
            </div>
          )}


          <div className="flex justify-between">
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostModal;
