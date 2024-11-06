import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  userId?: any;
}
// get user in4 by username
// export const getUserByUsername = async (req: Request, res: Response) => {
//   const { username } = req.params;

//   try {
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }
//     res.status(200).json(user);
//   } catch (err) {
//     console.error("Error fetching user by username:", err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// get all user
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find()
      .populate('posts', 'content') 
      .select('-password'); 
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// search user by username
export const searchUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.query; 

  try {
    const users = await User.find({ username: { $regex: username, $options: 'i' } })
      .select('-password');

    res.json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get user follow
export const getUserFollowersAndFollowings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; 

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const currentUser = await User.findById(userId)
      .populate('followers', 'username avatar')
      .populate('followings', 'username avatar')
      .select('followers followings');

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.json( currentUser );
  } catch (error) {
    console.error('Error fetching followers and followings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//edit profile
export const editProfile = async (req: AuthRequest, res: Response) => {
  const { username,  phone, sex, birthday, address, avatar, imgcover } = req.body;

  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // update
    user.username = username || user.username;
    user.phone = phone || user.phone;
    user.sex = sex || user.sex;
    user.birthday = birthday || user.birthday;
    user.address = address || user.address;
    user.avatar = avatar || user.avatar;
    user.imgcover = imgcover || user.imgcover;

    await user.save();
    console.log('User profile updated');
    res.json(user); 
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error updating user profile:", err.message);
      res.status(500).json({ msg: "Server error", error: err.message });
    } else {
      console.error("Unknown error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
};

//get user profile by id
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId)
      .populate({
        path: 'posts',
        populate: [
          { 
            path: 'user',
            select: 'avatar username', 
          },
          { 
            path: 'tag', 
            select: 'tagname', 
          },
        ],
      })
      .select('-password'); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//follow user
export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id: targetUserId } = req.params;  
    const userId = req.userId; 

    if (!mongoose.Types.ObjectId.isValid(targetUserId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // check already following or not
    if (currentUser.followings.includes(targetUserId as any)) {
      return res.status(400).json({ message: "You are already following this user" });
    }

    currentUser.followings.push(targetUserId as any);
    targetUser.followers.push(userId);

    // check friend
    const isMutualFollow = targetUser.followings.includes(userId);

    if (isMutualFollow) {
      currentUser.friend.push(targetUserId as any);
      targetUser.friend.push(userId);
    }

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      message: isMutualFollow ? "You are now friends!" : "Followed successfully",
      followings: currentUser.followings,
      followers: targetUser.followers,
      friends: isMutualFollow ? currentUser.friend : [],
    });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// unfollow
export const unfollowUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id: targetUserId } = req.params; 
    const userId = req.userId;  

    if (!mongoose.Types.ObjectId.isValid(targetUserId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const currentUser = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!currentUser.followings.includes(targetUserId as any)) {
      return res.status(400).json({ message: "You are not following this user" });
    }

    // unfollow
    currentUser.followings = currentUser.followings.filter(
      (followingId) => followingId.toString() !== targetUserId
    );
    targetUser.followers = targetUser.followers.filter(
      (followerId) => followerId.toString() !== userId
    );

    await currentUser.save();
    await targetUser.save();

    return res.status(200).json({
      message: "Unfollowed successfully",
      followings: currentUser.followings,
      followers: targetUser.followers,
    });
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update status
export const updateStatus = async (req: AuthRequest, res: Response) => {
  const { isOnline } = req.body; 
  const userId = req.userId; // Lấy userId từ req.userId

  // Lưu thời gian hiện tại
  const lastActive = isOnline ? null : new Date().toISOString(); 

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isOnline, lastActive }, 
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

//update status
export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  const { isOnline } = req.body; 
  const userId = req.userId; 
  const lastActive = new Date();

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isOnline, lastActive }, 
      { new: true } 
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Status updated successfully", user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//get friends with status
export const getFriendsWithStatus = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;  

  try {
    const user = await User.findById(userId).populate("friend", "username avatar isOnline lastActive");  

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user.friend);
  } catch (err) {
    console.error("Error fetching friends:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

//suggest friend
export const suggestFriend = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; 

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const currentUser = await User.findById(userId).populate<{ friend: IUser[] }>('friend');

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = currentUser.friend.map(friend => friend.id.toString());

    // suggest all user except fr 
    const suggestedUsers = await User.find({
      _id: { $nin: [...friends, userId] }, 
    }).select('username avatar');

    res.json(suggestedUsers);
  } catch (error) {
    console.error('Error fetching suggested users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
