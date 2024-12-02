import React, { useEffect, useState } from 'react';
import { IUser } from '../types/IUser';
import { fetchFollow, fetchFriends } from '../services/userService'; 
import useFormattedTimestamp from '../hooks/useFormatTimestamp';

const FriendPage: React.FC = () => {
    const [friends, setFriends] = useState<IUser[]>([]); 
    const [suggestions, setSuggestions] = useState<IUser[]>([]); 
    const [followings, setFollowings] = useState<IUser[]>([]); 
    const [followers, setFollowers] = useState<IUser[]>([]); 
    const [error, setError] = useState<string | null>(null);
    const { formatTimestamp } = useFormattedTimestamp();

    //load friends
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
    // Load followers and followings từ API
    useEffect(() => {
        const loadFollowData = async () => {
            try {
                const response = await fetchFollow(); // Lấy dữ liệu từ API
                if (response) {
                    setFollowers(response.followers || []); // Lưu danh sách followers
                    setFollowings(response.followings || []); // Lưu danh sách followings
                }
            } catch (error) {
                console.error('Error fetching followers and followings:', error);
                setError('Error fetching followers and followings');
            }
        };
        loadFollowData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8 mt-20">
            <div className="grid grid-cols-4 gap-4">
                {/* Cột Friends */}
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="font-bold text-lg mb-4">Friends</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    {friends.length === 0 ? (
                        <p className="text-gray-500">You have no friends! Let's make friends with suggested</p>
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

                {/* Cột Followers */}
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="font-bold text-lg mb-4">Followers</h2>
                    {followers.length === 0 ? (
                        <p className="text-gray-500">No followers yet!</p>
                    ) : (
                        <ul className="space-y-4">
                            {followers.map(follower => (
                                <li key={follower._id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <img src={follower.avatar} alt={`${follower.username}'s avatar`} className="w-8 h-8 rounded-full" />
                                    <span className="text-black dark:text-white">{follower.username}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Cột Followings */}
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="font-bold text-lg mb-4">Followings</h2>
                    {followings.length === 0 ? (
                        <p className="text-gray-500">You are not following anyone yet!</p>
                    ) : (
                        <ul className="space-y-4">
                            {followings.map(following => (
                                <li key={following._id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <img src={following.avatar} alt={`${following.username}'s avatar`} className="w-8 h-8 rounded-full" />
                                    <span className="text-black dark:text-white">{following.username}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Cột Suggestions */}
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="font-bold text-lg mb-4">Suggestions</h2>
                    <ul className="space-y-4">
                        {suggestions.length === 0 ? (
                            <p className="text-gray-500">No suggestions available.</p>
                        ) : (
                            suggestions.map(suggestion => (
                                <li key={suggestion._id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <img src={suggestion.avatar} alt={`${suggestion.username}'s avatar`} className="w-8 h-8 rounded-full" />
                                    <span className="text-black dark:text-white">{suggestion.username}</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FriendPage;
