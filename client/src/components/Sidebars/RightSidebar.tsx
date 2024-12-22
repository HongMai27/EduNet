import React, { useEffect, useState } from 'react';
import { addFriend, fetchFollow, fetchFriends, fetchSuggest, unfriend } from '../../services/userService';
import { IUser } from '../../types/IUser';
import useFormattedTimestamp from '../../hooks/useFormatTimestamp';
import axios from 'axios';
import FollowButton from '../Forms/FollowButton';
import { useNavigate } from 'react-router-dom'; 
import ChatMini from '../Forms/ChatMini';
import { useChat } from '../../stores/ChatMiniContext'; 
import { toast } from 'react-toastify';

const RightSidebar: React.FC<{ className?: string }> = ({ className }) => {
  const [friends, setFriends] = useState<IUser[]>([]);
  const [suggestions, setSuggestions] = useState<IUser[]>([]);
  const [followings, setFollowings] = useState<IUser[]>([]);
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { formatTimestamp } = useFormattedTimestamp();
  const { openChat, closeChat, receiverId, isOpen } = useChat(); 
  const navigate = useNavigate();


  // Load friends
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

  // Load suggested friends
  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const suggestionsData = await fetchSuggest();
        setSuggestions(suggestionsData);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setError('Error fetching suggestions');
      }
    };
    loadSuggestions();
  }, []);

  // Load followings
  useEffect(() => {
    const loadFollows = async () => {
      try {
        const response = await fetchFollow();
        const followingsData = Array.isArray(response.followings) ? response.followings : [];
        const followersData = Array.isArray(response.followers) ? response.followers : [];
  
        // Log dữ liệu followings và followers
        console.log('Followings:', followingsData);
        console.log('Followers:', followersData);
  
        setFollowings(followingsData);
        setFollowers(followersData);
      } catch (error) {
        console.error('Error fetching followings:', error);
        setError('Error fetching followings');
      }
    };
  
    loadFollows();
  }, []);


    // Handle redirect to profile
    const handleRedirectToProfile = (userId: string) => {
      navigate(`/profiles/${userId}`); 
    };
  const handleMessageClick = (friendId: string) => {
    openChat(friendId); // Mở chat với ID bạn bè đã chọn
  };

  // Check following, follower
  const isFollowing = (userId: string) => {
    return followings.some(following => following._id === userId);
  };

  const isFollower = (userId: string) => {
    return followers.some(follower => follower._id === userId);
  };

  // Handle add friend
  const handleAddFriend = async (targetUserId: string) => {
    try {
      const response = await addFriend(targetUserId);
      toast.success(response.message);
    } catch (error) {
      console.error("Error following user:", error);
      alert("Error adding friend. Please try again.");
    }
  };

  // Handle unfriend
  const handleUnfollow = async (targetUserId: string) => {
    try {
      const response = await unfriend(targetUserId);
      alert(response.message);
      window.location.reload();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error unfollowing user:", error.response?.data || error.message);
        alert(`Error: ${error.response?.data?.message || "Unauthorized. Please check your credentials."}`);
      } else {
        console.error("Unexpected error:", error);
        alert("Unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={`fixed right-0 w-72 h-screen bg-white dark:bg-gray-800 p-4 mt-20 shadow-md ${className}`}>
      {/* Friends */}
      <div className="mb-4" >
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Friends</h2>
        {error && <p className="text-red-500">{error}</p>}
        {friends.length === 0 ? (
          <p className="text-gray-500">You have no friends! Let make friends with suggested</p>
        ) : (
          <ul className="space-y-4">
            {friends.map(friend => (
              <li 
              key={friend._id} 
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => handleRedirectToProfile(friend._id)}
              >
                <img src={friend.avatar} alt={`${friend.username}'s avatar`} className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-black dark:text-white">{friend.username}</span>
                  <span className={`text-xs ${friend.isOnline ? 'text-green-500' : 'text-gray-500'}`}>
                    {friend.isOnline ? 'Online' : `Last Active: ${formatTimestamp(friend.lastActive)}`}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Suggested Friends */}
      <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Suggested Friends</h2>
        {error && <p className="text-red-500">{error}</p>}
        <ul className="space-y-4">
          {suggestions.map(suggestedFriend => (
            <li key={suggestedFriend._id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <img src={suggestedFriend.avatar} alt={`${suggestedFriend.username}'s avatar`} className="w-8 h-8 rounded-full" onClick={() => handleRedirectToProfile(suggestedFriend._id)}/>
              <div className="flex flex-col w-full">
                <span className="text-black dark:text-white">{suggestedFriend.username}</span>
                <div className="flex space-x-2 mt-1 w-full"> 
                  {/* Follow Button */}
                  <FollowButton
                    isFollower={isFollower(suggestedFriend._id)}
                    isFollowing={isFollowing(suggestedFriend._id)}
                    onAddFriend={() => handleAddFriend(suggestedFriend._id)}
                    onUnfollow={() => handleUnfollow(suggestedFriend._id)}
                  />
                  {/* Message Button */}
                  <button 
                    className="bg-gray-500 text-white text-sm py-1 px-2 rounded w-1/2 hover:bg-gray-600"
                    onClick={() => handleMessageClick(suggestedFriend._id)} 
                  >
                    Message
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

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

export default RightSidebar;
