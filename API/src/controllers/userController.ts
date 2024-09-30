import { Request, Response } from 'express';
import User from '../models/userModel';


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

//get user profile
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
