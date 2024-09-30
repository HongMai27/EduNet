import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostForm from "../components/Forms/CreatePostForm";
import useLike from "../hooks/useLike";
import { useAuth } from "../stores/AuthContext";
import { useUser } from "../hooks/useUserInfor";
import useAddcmt from "../hooks/useAddcmt";
import { fetchPosts } from "../services/postService"; 
import { IPost } from "../types/IPost";
import NewsFeed from "../components/Forms/Newfeed";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { handleLike } = useLike();
  const { handleAddComment } = useAddcmt();
  const { userId } = useAuth();
  const { user } = useUser(userId);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch {
        setError("Failed to fetch posts");
      }
    };

    loadPosts();
  }, []);

  const handlePostCreated = async () => {
    const fetchedPosts = await fetchPosts();
    setPosts(fetchedPosts);
  };

  const handleRedirect = (postId: string) => {
    navigate(`/detail/${postId}`);
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <div className="flex-1 flex flex-col pl-64 pr-64 p-5">
        <main className="flex-1 overflow-y-auto p-5">
          <header className="mb-8 mt-20">
            <h1 className="text-3xl font-bold">
              Welcome <span className="text-blue-500 uppercase">{user?.username}</span> to the EduNet
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              See what your friends are up to today!
            </p>
          </header>

          {/* Create new post */}
          <PostForm onPostCreated={handlePostCreated} />

          {/* Newsfeeds */}
          <NewsFeed 
            posts={posts} 
            handleRedirect={handleRedirect} 
            handleLike={handleLike} 
            handleAddComment={handleAddComment} 
            setPosts={setPosts} 
          />
        </main>
      </div>
    </div>
  );
};

export default Home;
