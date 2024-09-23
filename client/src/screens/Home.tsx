import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { differenceInDays, differenceInHours, differenceInMinutes, format } from "date-fns";
import { vi } from "date-fns/locale";
import { IPost } from "../types/IPost";
import PostForm from "../components/Forms/CreatePostForm";
import DropdownMenuButton from "../components/Forms/DropdownMenu";
import PostActions from "../components/Forms/PostActions";
import useLike from "../hooks/useLike";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = localStorage.getItem('currentUserId') || '';
  const { handleLike } = useLike();

  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get("http://localhost:5000/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sortedPosts = response.data.sort((a: IPost, b: IPost) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setPosts(sortedPosts);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError("Unauthorized access. Please log in again.");
        } else if (err.response?.status === 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("Failed to fetch posts");
        }
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePostCreated = async () => {
    await fetchPosts();
  };

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

  

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <div className="flex-1 flex flex-col pl-64 pr-64 p-5">
        <main className="flex-1 overflow-y-auto p-5">
          <header className="mb-8 mt-20">
            <h1 className="text-3xl font-bold">Welcome to the EduNet</h1>
            <p className="text-gray-600 dark:text-gray-400">
              See what your friends are up to today!
            </p>
          </header>

          {/* Create new post */}
          <PostForm onPostCreated={handlePostCreated} />

          {/* Newsfeeds */}
          <section className="space-y-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                    <img src={post.user?.avatar} className="w-full h-full rounded-full object-cover" alt={post.user?.username} />
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
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Home;
