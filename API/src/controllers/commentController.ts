import { Request, Response } from "express";
import Comment from "../models/commentModal";
import Post from "../models/postModal";

interface AuthRequest extends Request {
    userId?: any;
  }
// get cmt 
export const getComments = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).populate('comments'); 

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.comments || post.comments.length === 0) {
      return res.status(200).json({ comments: [] });
    }

    return res.status(200).json({ comments: post.comments });
  } catch (error) {
    console.error('Get comments: Error retrieving comments', error);
    return res.status(500).json({ message: 'Error retrieving comments' });
  }
};


//add cmt
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      console.log('Add cmt: Invalid user ID');
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      console.log('Add cmt: Post not found');
      return res.status(404).json({ message: 'Post not found' });
    }

    const { content, image } = req.body;

    if (!content || content.trim() === '') {
      console.log('Add cmt: Comment content is required');
      return res.status(400).json({ message: 'Comment content is required' });
    }

    // Tạo comment mới trong bảng Comment
    const newComment = new Comment({
      postID: post._id,
      user: userId,
      avatar: req.user.avatar, 
      username: req.user.username, 
      content,
      image: image || null,
      date: new Date(),
    });

    await newComment.save();

    await Post.findByIdAndUpdate(
      post._id,
      { $push: { comments: newComment._id } }, 
      { new: true }
    );

    console.log('Add cmt: Comment added successfully');
    return res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Add cmt: Error adding comment', error);
    return res.status(500).json({ message: 'Error adding comment' });
  }
};



//delete cmt
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; 
    const { commentId, id } = req.params;
    

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Post user ID:", post.user.toString());
    console.log("Comment user ID:", comment.user.toString());
    console.log("Request user ID:", userId);

    if (comment.user.toString() !== userId && post.user.toString() !== userId) {
      return res.status(403).json({ message: "You do not have permission to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);

    await Post.findByIdAndUpdate(
      id,
      { $pull: { comments: commentId } }, 
      { new: true }
    );

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Delete comment error:", error);
    return res.status(500).json({ message: "Error deleting comment" });
  }
};

//edit cmt
export const editComment = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId; 
    const { commentId, id } = req.params; 
    const { content, image } = req.body; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (comment.user.toString() != userId && post.user.toString() != userId) {
      return res.status(403).json({ message: "You do not have permission to edit this comment" });
    }

    // update comment
    if (content) {
      comment.content = content;
    }
    if (image) {
      comment.image = image;
    }

    await comment.save();
    console.log('Edit comment success')

    return res.status(200).json({ message: "Comment edited successfully", comment });
  } catch (error) {
    console.error("Edit comment error:", error);
    return res.status(500).json({ message: "Error editing comment" });
  }
};