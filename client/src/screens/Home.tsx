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
import Modal from "../components/Modals/CreatePostModal";
import useSocket from "../hooks/useSocket";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const socket = useSocket();
  const { handleLike } = useLike({ socket });
  const { handleAddComment } = useAddcmt();
  const { userId: currentUserId, avatar, username } = useAuth();
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

  const handleDeletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  // Handle post create
  const handlePostCreated = async () => {
    const fetchedPosts = await fetchPosts();
    setPosts(fetchedPosts);
    setIsModalVisible(false);  
  };

  // Handle redirect to profile
  const handleRedirectToProfile = (userId: string) => {
    if (userId === currentUserId) {
      navigate(`/profile`);  
    } else {
      navigate(`/profiles/${userId}`); 
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex" style={{
      backgroundImage: `url('https://media.istockphoto.com/id/1367756031/vector/light-blue-watercolor-background-illustration.jpg?s=612x612&w=0&k=20&c=qiJl7j-2terwHd-1YJxiFIo1VJx6l6IsmoqlgeypQ7c=')`,
    }}>
      <div className="flex-1 flex flex-col pl-72 pr-72 p-5">
        <main className="flex-1 overflow-y-auto p-5">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mt-20 mb-8">
          <header className="mb-4">
            <h1 className="text-3xl font-bold">
              Welcome <span className="text-blue-500 uppercase">{username}</span> to EduNet
            </h1>
          </header>
          <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 h-12 rounded-3xl border border-gray-300 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center space-x-2"
                onClick={() => setIsModalVisible(true)}
            >
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">
                <img src={avatar ?? ''}
                className="w-full h-full rounded-full object-cover"/>
              </div>
              <input
                type="text"
                placeholder="What's on your mind?"
                className="flex-1 p-2 bg-transparent border-none focus:outline-none text-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

          {/* Create Post Modal */}
          <Modal isVisible={isModalVisible} onClose={() => setIsModalVisible(false)}>
            <PostForm onPostCreated={handlePostCreated} />
          </Modal>

          {/* Newsfeeds */}
          <NewsFeed
                posts={posts}
                handleRedirect={(postId) => console.log(`Redirect to post ${postId}`)}
                handleRedirectToProfile={handleRedirectToProfile}
                handleLike={(postId, isLiked) => handleLike(postId, isLiked, setPosts, currentUserId!)}
                handleAddComment={handleAddComment}
                setPosts={setPosts}
                userId={currentUserId!} 
                socket={socket}  
                onDeletePost={handleDeletePost}
              />
        </main>
      </div>
    </div>
  );
};

export default Home;
