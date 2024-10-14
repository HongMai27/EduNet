import React, { useEffect, useState } from 'react';
import { useAuth } from '../stores/AuthContext';
import { IUser } from '../types/IUser';
import { IPost } from '../types/IPost';
import useLike from '../hooks/useLike';
import Loader from '../components/Forms/Loader';
import useAddcmt from '../hooks/useAddcmt';
import { fetchFriends, fetchUserById } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import useFormattedTimestamp from '../hooks/useFormatTimestamp';
import Chat from '../components/Forms/Chat';

const ChatPage: React.FC = () => {
  const { userId } = useAuth();
  const [friends, setFriends] = useState<IUser[]>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null); 
  const [error, setError] = useState<string | null>(null);
  const { handleLike } = useLike();
  const { handleAddComment } = useAddcmt();
  const navigate = useNavigate();
  const { formatTimestamp } = useFormattedTimestamp();


  useEffect(() => {
    const loadFriends = async () => {
      try {
        const friendsData = await fetchFriends(); 
        setFriends(friendsData);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Error fetching friends');
      }
    };
    loadFriends();
  }, []);


  

  return (
    <div className=" dark:bg-gray-900 dark:text-gray-100 flex flex-col  ">
      <div className="flex ">
        <main className="flex-1 bg-white dark:bg-gray-800 dark:text-gray-100  shadow-md ">
          <div className="grid grid-cols-10 gap-6">
            {/* List fr */}
            <div className="col-span-2 fixed w-72 h-screen bg-white dark:bg-gray-800 p-4 mt-20 shadow-md overflow-y-auto  rounded-lg  ">
              <h2 className="text-2xl font-bold mb-4">Messages</h2>
              <div className="mb-4">
                {error && <p className="text-red-500">{error}</p>}
                {friends.length === 0 ? (
                  <p className="text-gray-500">You have no friends! Let make friends with suggested</p>
                ) : (
                  <ul className="space-y-4">
                     {friends.map(friend => (
                        <li
                          key={friend._id}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() => setSelectedFriendId(friend._id)} // Thêm hàm onClick
                        >
                          <img src={friend.avatar} alt={`${friend.username}'s avatar`} className="w-8 h-8 rounded-full" />
                          <div className="flex flex-col">
                            <span className="text-black dark:text-white">{friend.username}</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
            
            {/* conversation*/}
            <div className="col-span-8 p-4 mt-20 rounded-lg ml-80  w-full min-w-max min-h-screen">
              {selectedFriendId ? (
                <Chat receiverId={selectedFriendId} />
              ) : (
                <p>Please select a friend to start chatting</p>
              )}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ChatPage;
