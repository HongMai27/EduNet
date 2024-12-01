import { Request, Response } from "express";
import Post from "../models/postModel";
import User from "../models/userModel";
import Tag from "../models/tagModel";
import Comment from "../models/commentModel";
import mongoose from "mongoose";

interface AuthRequest extends Request {
  userId?: string;
}
// getallpost
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("user", "username avatar")
      .populate("tag", "tagname")
      .sort({ date: -1 }); 
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};



//get post by id
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params; 
  try {
    const post = await Post.findById(id)
      .populate("user", "username avatar")
      .populate("tag", "tagname")
      .populate({
        path: "comments", 
        populate: { 
          path: "user", 
          select: "username avatar" 
        }
      })
      .sort({ date: -1 }); 
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// create post
export const createPost = async (req: AuthRequest, res: Response) => {
  const { content, image, video, doc, visibility, tag } = req.body; 
  const userId = req.userId;

  const date = new Date();
  const postVisibility = visibility || "public";

  try {
    if (!tag || typeof tag !== 'string') {
      console.log('Create post: Tag is required and must be a valid string.')
      return res.status(400).json({ msg: "Tag is required and must be a valid string." });
    }

    const existingTag = await Tag.findOne({ tagname: tag });
    if (!existingTag) {
      console.log('Create post: Tag does not exist. Please select a valid tag.')
      return res.status(400).json({ msg: "Tag does not exist. Please select a valid tag." });
    }

    // Tạo post mới
    const post = new Post({
      user: userId,
      content,
      image: image || null, 
      video: video || null,   
      doc: doc || null,      
      date,
      tag: existingTag._id,   
      visibility: postVisibility,
    });

    await post.save();

    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: post._id } },
      { new: true }
    );

    await Tag.findByIdAndUpdate(
      existingTag._id,
      { $push: { posts: post._id } },
      { new: true }
    );

    console.log("Posted");
    res.status(201).json(post);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error creating post:", err.message);
      res.status(500).json({ msg: "Server error", error: err.message });
    } else {
      console.error("Unknown error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
};


export const deletePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; 

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }


    if (req.user.role === "admin" || post.user.toString() === req.userId) {
      await Post.deleteOne({ _id: id });
      await Comment.deleteMany({ postID: id });

      const user = await User.findById(post.user);
      if (user) {
        user.posts = user.posts.filter((postId) => postId.toString() !== id); 
        await user.save();  
      }

      return res.status(200).json({ msg: "Post deleted successfully" });
    } else {
      return res.status(403).json({ msg: "Unauthorized" });
    }
  } catch (err) {
    console.error("Error deleting post:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

//edit post
export const editPost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; 
  const { content, image, visibility, tag } = req.body; 

  try {
    // find by id post & check auth
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }
    post.content = content || post.content; 
    post.image = image || post.image;       
    post.visibility = visibility || post.visibility; 
    post.tag = tag || post.tag;             

    await post.save(); 
    console.log('Post updated');
    res.json(post); 
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error updating post:", err.message);
      res.status(500).json({ msg: "Server error", error: err.message });
    } else {
      console.error("Unknown error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
};

//save post
export const savePost = async (req: AuthRequest, res: Response) => {
  const userId = req.userId; 
  const { id } = req.params;  

  if (!userId || !id) {
    return res.status(400).json({ message: "User ID or Post ID is missing" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user or post ID" });
    }

    const user = await User.findById(userId);  
    const post = await Post.findById(id);     

    if (!user || !post) {
      return res.status(404).json({ message: "User or Post not found" });
    }

    if (user.savedPosts.includes(post.id)) {
      return res.status(400).json({ message: "Post already saved" });
    }

    user.savedPosts.push(post.id);  
    await user.save();

    return res.status(200).json({ message: "Post saved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Unsave post
export const unsavePost = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  const { id } = req.params;

  if (!userId || !id) {
    return res.status(400).json({ message: "User ID or Post ID is missing" });
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user or post ID" });
    }

    const user = await User.findById(userId);  
    const post = await Post.findById(id);

    if (!user || !post) {
      return res.status(404).json({ message: "User or Post not found" });
    }

    const postId = new mongoose.Types.ObjectId(id); 
    const savedPosts = user.savedPosts.map(savedPostId => savedPostId.toString());

    if (!savedPosts.includes(postId.toString())) {
      return res.status(400).json({ message: "Post not saved" });
    }

    user.savedPosts = user.savedPosts.filter(savedPostId => savedPostId.toString() !== postId.toString());
    await user.save();

    return res.status(200).json({ message: "Post unsaved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

//get save posts
export const getSavedPosts = async (req: AuthRequest, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  try {
    // Kiểm tra xem userId có hợp lệ không
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId)
      .populate({
        path: 'savedPosts', // Lấy các bài viết đã lưu
        populate: { 
          path: 'user', // Đưa thông tin người dùng vào mỗi bài viết
          select: 'username avatar' // Chỉ lấy username và avatar của người dùng
        }
      });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Trả về các bài viết đã lưu của người dùng
    res.status(200).json(user.savedPosts);
  } catch (error) {
    console.error('Error:', error);  // In chi tiết lỗi ra console
    return res.status(500).json({ message: "Server error", error });
  }
};