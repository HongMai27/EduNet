import { Request, Response } from "express";
import Comment from "../models/commentModal";
import Post from "../models/postModal";
import mongoose from "mongoose";


interface AuthRequest extends Request {
    userId?: any;
  }
// get cmt 
export const getComments = async (req: Request, res: Response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    const post = await Post.findById(req.params.id).populate({
      path: 'comments.user',  
      select: 'username avatar content date', 
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json({ comments: post.comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//add cmt
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      console.log(' Add cmt: Invalid user ID')
      return res.status(400).json({ message: 'Invalid user ID' });
    
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      console.log(' Add cmt: post not found')
      return res.status(404).json({ message: 'Post not found' });
    }

    const { content, image } = req.body;

    if (!content || content.trim() === '') {
      console.log(' Add cmt: Comment content is required')
      return res.status(400).json({ message: 'Comment content is required' });
    }

    post.comments.push({
      user: userId,
      content,
      image: image || null,
      date: new Date().toISOString(),
      _id: undefined
    });

    

    await post.save();
    console.log(' Add cmt: Comment added')
    return res.status(200).json({ message: 'Comment added', comments: post.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//delete cmt
export const deleteComment = async (req: Request, res: Response) => {
  const { id, commentId } = req.params; 

  try {
      const post = await Post.findById(id);
      if (!post) {
          console.log("Received postId:", id);
          return res.status(404).json({ msg: "Post not found" });
      }

      // Tìm vị trí của bình luận trong mảng
      const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
      if (commentIndex === -1) {
          return res.status(404).json({ msg: "Comment not found" });
      }

      post.comments.splice(commentIndex, 1); 
      await post.save(); 

      console.log('Comment deleted');
      return res.status(200).json({ msg: "Comment deleted successfully", comments: post.comments });
  } catch (err: unknown) {
      if (err instanceof Error) {
          console.error("Error deleting comment:", err.message);
          return res.status(500).json({ msg: "Server error", error: err.message });
      } else {
          console.error("Unknown error:", err);
          return res.status(500).json({ msg: "Server error" });
      }
  }
};

//edit cmt
export const editComment = async (req: Request, res: Response) => {
  const { id, commentId } = req.params; 
  const { content, image } = req.body; 

  try {
      const post = await Post.findById(id);
      if (!post) {
          return res.status(404).json({ msg: "Post not found" });
      }

      const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);

      if (commentIndex === -1) {
          return res.status(404).json({ msg: "Comment not found" });
      }

      // Cập nhật bình luận
      post.comments[commentIndex].content = content || post.comments[commentIndex].content; 
      post.comments[commentIndex].image = image || post.comments[commentIndex].image; 
      post.comments[commentIndex].date = new Date().toISOString(); 

      await post.save();

      return res.status(200).json({ msg: "Comment updated successfully", comments: post.comments });
  } catch (err: unknown) {
      if (err instanceof Error) {
          console.error("Error editing comment:", err.message);
          return res.status(500).json({ msg: "Server error", error: err.message });
      } else {
          console.error("Unknown error:", err);
          return res.status(500).json({ msg: "Server error" });
      }
  }
};