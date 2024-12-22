import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostDetail } from '../../services/postService';
import { IPost } from '../../types/IPost';
import Navbar from './Navbar';
import { fetchUserInfo, searchUsersByUsername } from '../../services/userService';
import { useAuth } from '../../stores/AuthContext';
import useFormattedTimestamp from '../../hooks/useFormatTimestamp';

const ReportDetails: React.FC = () => {
  const { reportId } = useParams();
  const { userId, setUserId } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState<string>("user");
  const [post, setPost] = useState<IPost | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [adminAvatar, setAdminAvatar] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const { formatTimestamp } = useFormattedTimestamp();

  
  // Fetch post details
  useEffect(() => {
    const fetchDetail = async () => {
      if (reportId) {
        try {
          const fetchedPost = await fetchPostDetail(reportId);
          setPost(fetchedPost);
          setComments(fetchedPost.comments || []);
          setError(null);
        } catch {
          setError("Failed to fetch post detail");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Post ID is missing");
        setLoading(false);
      }
    };

    fetchDetail();
  }, [reportId]);

    const handleSearch = async () => {
      try {
        const results = await searchUsersByUsername(searchTerm);
        setFilteredUsers(results);
        setError(null);
        setSelectedMenu("search");
      } catch (err) {
        setFilteredUsers([]);
        setError("Error fetching search results");
      }
    };
  
    const handleSortOptionClick = (sortOption: string) => {
      console.log(`Sorting by: ${sortOption}`);
    };
  
    const handleLogout = () => {
      setUserId(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    };

  if (loading) return <p>Loading...</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        handleSortOptionClick={handleSortOptionClick}
        handleLogout={handleLogout}
      />
      {/* Main Content */}
      <div className="flex flex-1 mt-20">
        {/* Left Sidebar */}
        <div className="w-1/5 border-x-8 border-blue-900 shadow-2xl p-4">
          <h2 className="text-xl text-center font-semibold mb-16">User Info</h2>
          {post ? (
            <>
               <div className="w-64 h-52 cursor-pointer relative -mt-14 border-4 border-white">
              <img
                src={post.user.avatar}
                alt="User Avatar"
                className="w-full h-full rounded-xl "
              />
            </div>
              <div className="mb-2">
                <p className="font-bold">Name:</p>
                <p>{post.user.username}</p>
              </div>
              <div className="mb-2">
                <p className="font-bold">Email:</p>
                <p>{post.user.email}</p>
              </div>
              <div className="mb-2">
                <p className="font-bold">Point:</p>
                <p>{post.user.point}</p>
              </div>
              <div className="mb-2">
                <p className="font-bold">Last active:</p>
                <p>{post.user.lastActive}</p>
              </div>
            </>
          ) : (
            <p>Loading user info...</p>
          )}
        </div>

        {/* Center Content */}
        <div className="w-3/5 bg-white p-4 rounded-md">
          {post && (
            <>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                  <img
                    src={post.user?.avatar || "https://via.placeholder.com/150"}
                    alt="User Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{post.user?.username}</h2>
                  <span className="text-sm text-gray-500">
                  {formatTimestamp(post.date)}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="inline-block px-2 py-1 text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-100">
                    {post.tag?.tagname || "General"}
                  </span>
                </div>
              </div>
              <p className="text-gray-700">{post.content}</p>
              {post.image && ( 
          <div className="mb-4 flex justify-center">
            <img src={post.image} alt="Post" />
          </div>
        )}
        {post.video && (
            <div className="mb-4 flex justify-center">
              <video
                controls
                className="rounded-lg w-full h-auto max-w-5xl object-cover"
              >
                <source src={post.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {post.doc && (post.doc.endsWith(".pdf") || post.doc.endsWith(".doc") || post.doc.endsWith(".docx")) && (
            <div className="mb-4 flex justify-center">
              <a href={post.doc} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                View Document
              </a>
            </div>
          )}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Comments</h2>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="mb-4">
                      <p className="font-bold">{comment.user.username}</p>
                      <p>{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p>No comments found.</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-1/5 border-x-8 border-blue-900 shadow-2xl p-4">
          <h2 className="text-xl font-semibold mb-4">User List</h2>
          <ul>
            <li className="mb-2">User 1</li>
            <li className="mb-2">User 2</li>
            <li className="mb-2">User 3</li>
            <li className="mb-2">User 4</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;
