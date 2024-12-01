import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

interface AuthRequest extends Request {
  userId?: string;
  user?: { avatar: string; username: string; role: 'admin' | 'user'};
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as { userId: string };
    req.userId = decoded.userId;
    const user = await User.findById(req.userId).select('avatar username role'); 

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = {
      avatar: user.avatar,
      username: user.username,
      role: user.role, 
    };

    console.log("User attached to request:", req.user.username);  

    next(); 
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

