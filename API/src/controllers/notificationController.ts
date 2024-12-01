import { Request, Response } from 'express';
import Notification from '../models/notificationModel';

interface AuthRequest extends Request {
    userId?: any;
  }

  export const getNotifications = async (req: AuthRequest, res: Response) => {
    const userId = req.params.userId; // Lấy userId từ tham số URL
  
    try {
      // Kiểm tra nếu userId không hợp lệ
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      // Lấy tất cả thông báo của người dùng theo userId
      const notifications = await Notification.find({ userId })
      .sort({ timestamp: -1 }) 
      .populate('postId', 'content')  
      .populate('userId', 'username avatar')  
      .populate('ownerId', 'username avatar') 
      .exec();
  
      if (!notifications) {
        return res.status(404).json({ message: "No notifications found" });
      }
  
      // Trả về thông báo dưới dạng JSON
      return res.status(200).json(notifications);
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error", error });
    }
  };
