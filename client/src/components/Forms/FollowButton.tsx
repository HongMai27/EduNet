import React from 'react';

interface FollowButtonProps {
  isFollower: boolean;        
  isFollowing: boolean;        
  onAddFriend: () => void;     
  onUnfollow: () => void;     
}

const FollowButton: React.FC<FollowButtonProps> = ({ isFollower, isFollowing, onAddFriend, onUnfollow }) => {
  return (
    <div className="flex align-middle">
      {isFollower ? (
        <button
          className="bg-blue-500 text-white text-sm py-1 px-2 rounded hover:bg-blue-600"
          onClick={onAddFriend}
        >
          Accept
        </button>
      ) : (
        isFollowing ? (
          <span
            className="bg-green-500 text-white text-sm py-1 px-2 rounded cursor-pointer w-20"
            onClick={onUnfollow}
          >
            Following
          </span>
        ) : (
          <button
            className="bg-blue-500 text-white text-sm py-1 px-2 rounded hover:bg-blue-600"
            onClick={onAddFriend}
          >
            Add Friend
          </button>
        )
      )}
    </div>
  );
};

export default FollowButton;
