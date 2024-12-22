
import { Request, Response } from 'express';
import Notification from '../models/notificationModel';
import Post from '../models/postModel';
import { IUser } from '../models/userModel';
import { io, userStatus } from '../app';

interface AuthRequest extends Request {
  userId?: string;
}

// send noti
export const sendNotification = async (req: AuthRequest, res: Response) => {
  const { userId, postId, type, message, username, avatar } = req.body; 

  try {
    const post = await Post.findById(postId).populate<{ user: IUser }>('user').lean();

    if (!post || !post.user) {
      return res.status(404).json({ message: 'Post not found or owner not exists' });
    }

    const ownerId = post.user._id.toString(); 
    if (ownerId === userId) {
      return res.status(400).json({ message: 'Cannot notify self' });
    }

    const notification = new Notification({
      userId, 
      ownerId,
      username,
      avatar,
      postId,
      message,
      type,
    });

    await notification.save();
  
    const receiverSocket = userStatus[userId];
    if (receiverSocket && receiverSocket.isOnline) {
      io.to(receiverSocket.socketId).emit('newNotification', {
        message,
        type,
        userId,
      });
    } else {
      console.log(`User ${userId} is offline or not registered.`);
    }

        res.status(200).json({ message: 'Notification sent', notification });
      } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Error sending notification', error });
      }
    };

// get noti
export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.params.id; 

  try {
    const notifications = await Notification.find({ ownerId: userId })
      .sort({ createdAt: -1 }) 
      .lean();

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

// Đánh dấu đã đọc
export const markAsRead = async (req: AuthRequest, res: Response) => {
  const notificationId = req.params.id; 

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    console.log('marked as read')
    res.status(200).json({ message: 'Notification marked as read', updatedNotification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read', error });
  }
};

// 2.4 Xóa thông báo
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  const notificationId = req.params.id;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(notificationId);

    if (!deletedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted', deletedNotification });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification', error });
  }
};
