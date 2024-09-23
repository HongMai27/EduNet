import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../stores/AuthContext';
import { IUser } from '../types/IUser';
import { IPost } from '../types/IPost';
import DropdownMenuButton from '../components/Forms/DropdownMenu';
import PostActions from '../components/Forms/PostActions';
import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns';
import { vi } from "date-fns/locale";
import useLike from '../hooks/useLike';


const Profile: React.FC = () => {
  const { userId } = useAuth();
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { handleLike } = useLike();

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('No user ID found');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<IUser>(`http://localhost:5000/api/auth/user/${userId}`);
        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();

    const minutesAgo = differenceInMinutes(now, date);
    const hoursAgo = differenceInHours(now, date);
    const daysAgo = differenceInDays(now, date);

    if (minutesAgo < 60) {
      return minutesAgo === 0 ? "Just now" : `${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} hours ago`;
    } else if (daysAgo < 1) {
      return "Today";
    } else {
      return format(date, "dd-MM 'at' HH:mm", { locale: vi });
    }
  };
  if (loading) return <p>Loading...</p>;
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

          {/* User's Posts */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            {user?.posts.length ? (
            [...user.posts]
              .sort((a: IPost, b: IPost) => new Date(b.date).getTime() - new Date(a.date).getTime()) 
              .map((post: IPost) => (
                <div
                  key={post._id}
                  className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <span className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                      {post.user?.username?.charAt(0).toUpperCase() || ""}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{post.user?.username}</h2>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatTimestamp(post.date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-block px-2 py-1 text-sm text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-900">
                      {post.tag}
                    </span>
                    <DropdownMenuButton post={post} />
                  </div>
                </div>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 text-justify">
                  {post.content}
                </p>
                {post.image && (
                  <div className="mb-4 flex justify-center">
                    <img src={post.image} alt="Post" />
                  </div>
                )}
                {/* PostActions component */}
                <PostActions
                  postId={post._id}
                  likes={post.likes || []}
                  onLike={(postId, isLiked) => handleLike(postId, isLiked, setPosts)}
                />
              </div>
              ))
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
