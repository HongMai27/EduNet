import React, { useEffect, useState } from 'react';
import { useAuth } from '../stores/AuthContext';
import { IUser } from '../types/IUser';
import { IPost } from '../types/IPost';
import useLike from '../hooks/useLike';
import Loader from '../components/Forms/Loader';
import useAddcmt from '../hooks/useAddcmt';
import { fetchUserById } from '../services/userService';
import NewsFeed from '../components/Forms/Newfeed';
import { useNavigate, useParams } from 'react-router-dom';

const OtherProfile: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { handleLike } = useLike();
  const { handleAddComment } = useAddcmt();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('No user ID found');
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUserById(userId);
        setUser(userData);

        const userPosts = await fetchUserById(userId);
        setPosts(userPosts.posts);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleRedirectToProfile = (userId: string) => {
    navigate(`/profiles/${userId}`); 
  };
  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 flex flex-col pt-20 ">
      <div className="flex flex-1 p-5">
        {/* Main OtherProfile Content */}
        <main className="flex-1 bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          {/* User Info Block */}
          <div className="mb-8 p-6 border border-gray-300 dark:border-gray-700 rounded-lg flex items-center space-x-4">
            {/* User Avatar */}
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
              <img
                src={user?.avatar}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            {/* User Details */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user?.username}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              {/* Buttons for Follow and Message */}
              <div className="mt-4 flex space-x-4">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none transition">
                  Theo dõi
                </button>
                <button className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none transition">
                  Nhắn tin
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information and Posts in Two Columns */}
          <div className="grid grid-cols-10 gap-6">
            {/* Personal Information Section */}
            <div className="col-span-3 p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">About</h2>
              <p>Phone: {user?.phone}</p>
              <p>Address: {user?.address}</p>
              <p>Date of birth: {user?.birthday}</p>
              <p>Sex: {user?.sex}</p>
              <p>Point: {user?.point}</p>
              <p>Email: {user?.email}</p>
            </div>
            {/* User's Posts Section */}
            <div className="col-span-7 p-4 border border-gray-300 dark:border-gray-700 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Posts</h2>
              {posts.length ? (
                <NewsFeed
                  posts={posts}
                  handleRedirect={(postId) => console.log(`Redirect to post ${postId}`)} 
                  handleRedirectToProfile={handleRedirectToProfile}
                  handleLike={handleLike}
                  handleAddComment={handleAddComment}
                  setPosts={setPosts} // Pass setPosts for handling likes and comments
                />
              ) : (
                <p>No post</p>
              )}
            </div>
          
          </div>
        </main>
      </div>
    </div>
  );
};

export default OtherProfile;
