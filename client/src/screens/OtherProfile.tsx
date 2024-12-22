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
import useSocket from '../hooks/useSocket';
import { FaEnvelope, FaUserCheck } from 'react-icons/fa';
import { useChat } from '../stores/ChatMiniContext';
import ChatMini from '../components/Forms/ChatMini';

const OtherProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();
  const { handleLike } = useLike({ socket });
  const { handleAddComment } = useAddcmt();
  const { openChat, closeChat, receiverId, isOpen } = useChat(); 


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

  const handleDeletePost = (postId: string) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
  };

  const handleMessageClick = (friendId: string) => {
    openChat(friendId); // Mở chat với ID bạn bè đã chọn
  };

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 mt-20 dark:bg-gray-800">
        <main className="flex-1 bg-white dark:bg-gray-800 dark:text-gray-100 ">
          <div className="grid grid-cols-10 gap-6">
          <div className="col-span-3 p-4 border border-gray-300 dark:border-gray-700 rounded-lg h-[calc(100vh-160px)] self-start bg-white dark:bg-gray-800 flex flex-col items-center justify-between relative">
            {/* Cover Image */}
            <div 
            className="w-full h-36 bg-cover bg-center rounded-t-lg" 
            style={{ backgroundImage: `url('https://png.pngtree.com/thumb_back/fh260/background/20210115/pngtree-blue-gradient-web-ui-background-image_518658.jpg')`,}}
            >
            </div>

            {/* Avatar */}
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer relative -mt-14 border-4 border-white">
              <img
                src={user?.avatar}
                alt="User Avatar"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center">
              <h1 className="text-3xl font-bold text-center">{user?.username}</h1>
            </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="w-24 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 flex items-center justify-center">
              <FaUserCheck className="mr-2" />
              Friend
            </button>
            <button 
            className="w-24 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center"
            onClick={() => {
              if (user?._id) {
                handleMessageClick(user._id);
              } else {
                console.log("User ID is undefined");
              }
            }} >
              <FaEnvelope className="mr-2" />
              Chat
            </button>
          </div>

            {/* Info Details */}
            <div className="text-gray-600 dark:text-gray-400 mb-4">
              <p>Phone: {user?.phone}</p>
              <p>Address: {user?.address}</p>
              <p>Date of birth: {user?.birthday}</p>
              <p>Sex: {user?.sex}</p>
              <p>Point: {user?.point}</p>
              <p>Email: {user?.email}</p>
            </div>
          </div>

            <div className="col-span-7 p-4 border border-gray-300 dark:border-gray-700 rounded-lg overflow-auto h-[calc(100vh-160px)]">
              <h2 className="text-2xl font-bold mb-4">Posts</h2>

              {posts.length ? (
                <NewsFeed
                  posts={posts}
                  userAvatar={user?.avatar}
                  handleRedirect={(postId) => console.log(`Redirect to post ${postId}`)}
                  handleRedirectToProfile={() => {}}
                  handleLike={(postId, isLiked) => handleLike(postId, isLiked, setPosts, userId!)}
                  handleAddComment={handleAddComment}
                  setPosts={setPosts}
                  userId={userId!}
                  socket={socket}
                  onDeletePost={handleDeletePost}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <img
                    src="https://cdn.dribbble.com/users/2460221/screenshots/14347554/no-post.png" 
                    alt="No posts"
                    className="w-3/4 max-w-4xl opacity-70"
                  />
                </div>
              )}
            </div>
          </div>
        </main>

      {/* Chat Mini Component - will be rendered through context */}
      {isOpen && receiverId && (
        <ChatMini 
          receiverId={receiverId} 
          isOpen={isOpen} 
          onClose={closeChat} 
        />
      )}
    </div>
  );
};

export default OtherProfile;
