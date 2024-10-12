import React, { useEffect, useState } from 'react';
import { addFriend, fetchFollow, fetchFriends, fetchSuggest, unfriend } from '../../services/userService';
import { IUser } from '../../types/IUser';
import useFormattedTimestamp from '../../hooks/useFormatTimestamp';
import axios from 'axios';

const RightSidebar: React.FC<{ className?: string }> = ({ className }) => {
  const [friends, setFriends] = useState<IUser[]>([]);
  const [suggestions, setSuggestions] = useState<IUser[]>([]); 
  const [followings, setFollowings] = useState<IUser[]>([]);
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { formatTimestamp } = useFormattedTimestamp();

  // Fetch list fr
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

  // Fetch suggest
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
    loadSuggestions(); // Fetch initial suggestions
    // const intervalId = setInterval(loadSuggestions, 10000); 
    // return () => clearInterval(intervalId); // Cleanup
  }, []);
  

  // fetch follow
  useEffect(() => {
    const loadFollows = async () => {
      try {
        const response = await fetchFollow();
        // Get arr followings from response
        setFollowings(Array.isArray(response.followings) ? response.followings : []);
      } catch (error) {
        console.error('Error fetching followings:', error);
        setError('Error fetching followings');
      }
    };

    loadFollows(); // Fetch initial followings
    // const intervalId = setInterval(loadFollows, 100000); 
    // return () => clearInterval(intervalId);
  }, []);
  
  //check isfollowing
  const isFollowing = (userId: string) => {
    return followings.some(following => following._id === userId);
  };
  
  const isFollower = (userId: string) => {
    return followers.some(follower => follower._id === userId);
  };

  // handleAddFriend để follow user
  const handleAddFriend = async (targetUserId: string) => {
    try {
      const response = await addFriend(targetUserId);
      alert(response.message);
  
      // Update suggestions locally
      setSuggestions(prevSuggestions =>
        prevSuggestions.map(user => {
          if (user._id === targetUserId) {
            const updatedFollowing = Array.isArray(user.following)
              ? [...user.following, user._id] // Append user._id if following exists
              : [user._id]; // Initialize following with user._id if not an array
  
            return { ...user, following: updatedFollowing };
          }
          return user;
        })
      );
      window.location.reload(); 
      // Immediately fetch updated suggestions
      // const updatedSuggestions = await fetchSuggest(); // Fetch new suggestions
      // setSuggestions(updatedSuggestions); // Update suggestions state
  
    } catch (error) {
      console.error("Error following user:", error);
      alert("Error adding friend. Please try again.");
    }
  };
  
  
  
  //handle unfollow
  const handleUnfollow = async (targetUserId: string) => {
    try {
      const response = await unfriend(targetUserId);
      alert(response.message); 
  
      setSuggestions(prevSuggestions =>
        prevSuggestions.map(user => {
          if (user._id === targetUserId) {
            const updatedFollowing = Array.isArray(user.following)
              ? user.following.filter(id => id !== targetUserId) // Remove targetUserId from following
              : []; // If following is not an array, initialize as empty
  
            return { ...user, following: updatedFollowing };
          }
          return user;
        })
      );
      window.location.reload(); 
    } catch (error) {
      // Enhanced error logging
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
    <div className={`fixed right-0 w-64 h-screen bg-white dark:bg-gray-800 p-4 mt-20 shadow-md ${className}`}>
      {/* Friends */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Friends</h2>
        {error && <p className="text-red-500">{error}</p>}
        {friends.length === 0 ? (
          <p className="text-gray-500">You have no friends! Let make friends with suggested</p> // Message when there are no friends
        ) : (
          <ul className="space-y-4">
            {friends.map(friend => (
              <li key={friend._id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                <img src={friend.avatar} alt={`${friend.username}'s avatar`} className="w-8 h-8 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-black dark:text-white">{friend.username}</span>
                  <span className={`text-sm ${friend.isOnline ? 'text-green-500' : 'text-gray-500'}`}>
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
            <li key={suggestedFriend._id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <img src={suggestedFriend.avatar} alt={`${suggestedFriend.username}'s avatar`} className="w-8 h-8 rounded-full" />

              <div className="flex flex-col w-full">
                <span className="text-black dark:text-white">{suggestedFriend.username}</span>
                <div className="flex space-x-2 mt-1">
                  {/* Check if the user is a follower first */}
                  {isFollower(suggestedFriend._id) ? ( // Check if the user is a follower of the suggested friend
                    <button
                      className="bg-blue-500 text-white text-sm py-1 px-2 rounded hover:bg-blue-600"
                      onClick={() => handleAddFriend(suggestedFriend._id)} 
                    >
                      Accept
                    </button>
                  ) : (
                    isFollowing(suggestedFriend._id) ? (
                      <span 
                        className="bg-green-500 text-white text-sm py-1 px-2 rounded cursor-pointer"
                        onClick={() => handleUnfollow(suggestedFriend._id)} 
                      >
                        Following 
                      </span>
                    ) : (
                      <button
                        className="bg-blue-500 text-white text-sm py-1 px-2 rounded hover:bg-blue-600"
                        onClick={() => handleAddFriend(suggestedFriend._id)} 
                      >
                        Add Friend
                      </button>
                    )
                  )}

                  {/* Message Button */}
                  <button className="bg-gray-500 text-white text-sm py-1 px-2 rounded hover:bg-gray-600">
                    Message
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>



    </div>
  );
};

export default RightSidebar;
