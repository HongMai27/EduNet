import { Request, Response } from "express";
import Post from "../models/postModal";
import User from "../models/userModel";
import Tag from "../models/tagModal";

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

//create post
export const createPost = async (req: AuthRequest, res: Response) => {
  const { content, image, visibility, tag } = req.body;
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

    const post = new Post({
      user: userId,
      content,
      image,
      date,
      tag: [existingTag._id],  
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


//delete post
export const deletePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; 

  try {
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    console.log("Post user ID:", post.user.toString());
    console.log("Request user ID:", req.userId);

    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    await Post.deleteOne({ _id: id });
    res.status(200).json({ msg: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post:", err); 
    res.status(500).json({ msg: "Server error" });
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