import { Request, Response } from 'express';
import Notification from '../models/notificationModel';

interface AuthRequest extends Request {
    userId?: any;
  }

export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params; 
    const notifications = await Notification.find({ userId }) 
      .populate('postId', 'content') 
      .sort({ timestamp: -1 }); 

    res.json(notifications); 
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error' }); 
  }
};
