import React, { useEffect, useState } from 'react';
import { useAuth } from '../stores/AuthContext';
import { IUser } from '../types/IUser';
import { IPost } from '../types/IPost';
import useLike from '../hooks/useLike';
import Loader from '../components/Forms/Loader';
import useAddcmt from '../hooks/useAddcmt';
import { fetchUserById } from '../services/userService';
import NewsFeed from '../components/Forms/Newfeed';

const Profile: React.FC = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { handleLike } = useLike();
  const { handleAddComment } = useAddcmt();

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

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-gray-100 flex flex-col pt-16">
      <div className="flex flex-1 pl-64 pr-64 p-5">
        {/* Main Profile Content */}
        <main className="flex-1 bg-white dark:bg-gray-800 dark:text-gray-100 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-8">
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full mr-4">
              <img src={user?.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.username}</h1>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* User's Posts - Using NewsFeed component */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            {posts.length ? (
              <NewsFeed
                posts={posts}
                handleRedirect={(postId) => console.log(`Redirect to post ${postId}`)} // Handle redirection
                handleLike={handleLike}
                handleAddComment={handleAddComment}
                setPosts={setPosts} // Pass setPosts for handling likes and comments
              />
            ) : (
              <p>No posts available.</p>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
