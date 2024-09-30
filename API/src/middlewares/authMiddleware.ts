import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

interface AuthRequest extends Request {
  userId?: string;
  user?: { avatar: string; username: string };
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: string };
    req.userId = decoded.userId;
    const user = await User.findById(req.userId).select('avatar username'); 

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = {
      avatar: user.avatar,
      username: user.username,
    };

    next(); 
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
