import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { IPost } from "../types/IPost";
import PostForm from "../components/Forms/CreatePostForm";
import DropdownMenuButton from "../components/Forms/DropdownMenu";
import PostActions from "../components/Forms/PostActions";
import useLike from "../hooks/useLike";
import useFormattedTimestamp from "../hooks/useFormatTimestamp";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleLike } = useLike();
  const { formatTimestamp } = useFormattedTimestamp();

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
                  <div 
                    className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4"
                    onClick={() => console.log(post)}
                  >
                  <img src={post.user?.avatar} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
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
