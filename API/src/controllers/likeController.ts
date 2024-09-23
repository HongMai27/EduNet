// controllers/likeController.ts
import { Request, Response } from 'express';
import Post from '../models/postModal';
import User from '../models/userModel';

interface AuthRequest extends Request {
    userId?: any;
  }
  export const likePost = async (req: AuthRequest, res: Response) => {
    try {
      console.log('Request user:', req.userId); 
      const userId = req.userId; 
  
      if (!userId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const post = await Post.findById(req.params.id);
      console.log('Post found:', post); // Log the post object
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
  
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        await post.save();
  
        console.log('Likes after change:', post.likes); 
        return res.status(200).json({ message: 'Post liked', likes: post.likes });
      }
  
      return res.status(400).json({ message: 'Already liked' });
    } catch (error) {
      console.error('Error liking post:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  export const unlikePost = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId;
  
      if (!userId) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const post = await Post.findById(req.params.id);
      console.log('Post found:', post); // Log the post object
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      if (post.likes.includes(userId)) {
        // If the user has liked the post, remove their ID from the likes array
        post.likes = post.likes.filter(like => like.toString() !== userId.toString());
        await post.save();
  
        console.log('Likes after change:', post.likes); 
        return res.status(200).json({ message: 'Post unliked', likes: post.likes });
      }
  
      return res.status(400).json({ message: 'Not liked yet' });
    } catch (error) {
      console.error('Error unliking post:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
//get post likes
export const getPostLikes = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('likes', 'username'); 
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ likes: post.likes });
  } catch (error) {
    console.error('Error getting likes:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
