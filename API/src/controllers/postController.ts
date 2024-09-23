import { Request, Response } from "express";
import Post from "../models/postModal";
import User from "../models/userModel";

interface AuthRequest extends Request {
  userId?: string;
}
// getpost
export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ date: -1 }); 
    res.json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

//create post
export const createPost = async (req: AuthRequest, res: Response) => {
  const { content, image, visibility, tag } = req.body;
  const userId = req.userId; // Lấy ID người dùng từ yêu cầu

  const date = new Date();
  const postVisibility = visibility || "public"; 

  try {
    const post = new Post({
      user: userId,
      content,
      image,
      date,
      tag,
      visibility: postVisibility,
    });
    await post.save();
    await User.findByIdAndUpdate(
      userId,
      { $push: { posts: post._id } }, // Thêm ID bài đăng vào danh sách bài đăng của người dùng
      { new: true } // Trả về tài liệu mới sau khi cập nhật
    );

    console.log('Posted');
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