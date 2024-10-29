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
import Button from "../components/Forms/Button";
import Modal from "../components/Modals/CreatePostModal";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const { handleLike } = useLike();
  const { handleAddComment } = useAddcmt();
  const { userId } = useAuth();
  const { user } = useUser(userId);
  const navigate = useNavigate();

  // Load posts
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

  // Handle post create
  const handlePostCreated = async () => {
    const fetchedPosts = await fetchPosts();
    setPosts(fetchedPosts);
    setIsModalVisible(false);  
  };

  // Handle redirect to detail
  const handleRedirect = (postId: string) => {
    navigate(`/detail/${postId}`);
  };

  // Handle redirect to profile
  const handleRedirectToProfile = (userId: string) => {
    navigate(`/profiles/${userId}`); 
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex">
      <div className="flex-1 flex flex-col pl-72 pr-72 p-5">
        <main className="flex-1 overflow-y-auto p-5">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mt-20 mb-8 ">
          <header className="mb-8 ">
            <h1 className="text-3xl font-bold">
              Welcome <span className="text-blue-500 uppercase">{user?.username}</span> to the EduNet
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              See what your friends are up to today!
            </p>
          </header>

          <Button
            className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 "
            onClick={() => setIsModalVisible(true)}  
          >
            Post
          </Button>
          </div>
          {/* Create Post Modal */}
          <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
            <PostForm onPostCreated={handlePostCreated} />
          </Modal>

          {/* Newsfeeds */}
          <NewsFeed 
            posts={posts} 
            handleRedirect={handleRedirect} 
            handleRedirectToProfile={handleRedirectToProfile}
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
