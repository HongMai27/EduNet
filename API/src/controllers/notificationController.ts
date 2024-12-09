// import { Request, Response } from 'express';
// import Notification from '../models/notificationModel';

// interface AuthRequest extends Request {
//     userId?: any;
//   }

//   export const getNotifications = async (req: AuthRequest, res: Response) => {
//     const userId = req.params.userId; // Lấy userId từ tham số URL

//     try {
//       // Kiểm tra nếu userId không hợp lệ
//       if (!userId) {
//         return res.status(400).json({ message: "User ID is required" });
//       }
  
//       // Lấy tất cả thông báo của người dùng theo userId
//       const notifications = await Notification.find({ userId })
//       .sort({ timestamp: -1 }) 
//       .populate('postId', 'content')  
//       .populate('userId', 'username avatar')  
//       .populate('ownerId', 'username avatar') 
//       .exec();
  
//       if (!notifications) {
//         return res.status(404).json({ message: "No notifications found" });
//       }
  
//       // Trả về thông báo dưới dạng JSON
//       return res.status(200).json(notifications);
  
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Server error", error });
//     }
//   };

import { Request, Response } from 'express';
import Notification from '../models/notificationModel';
import Post from '../models/postModel';
import { IUser } from '../models/userModel';
import { io, userStatus } from '../app';

interface AuthRequest extends Request {
  userId?: string;
}

// 2.1 Gửi thông báo
export const sendNotification = async (req: AuthRequest, res: Response) => {
  const { userId, postId, type, message } = req.body; // Dữ liệu từ client

  try {
    // Tìm bài viết để xác định `ownerId`
    const post = await Post.findById(postId).populate<{ user: IUser }>('user').lean();

    if (!post || !post.user) {
      return res.status(404).json({ message: 'Post not found or owner not exists' });
    }

    const ownerId = post.user._id.toString(); // Người sở hữu bài viết
    if (ownerId === userId) {
      // Không gửi thông báo nếu ownerId và userId giống nhau (hành động của chính người dùng)
      return res.status(400).json({ message: 'Cannot notify self' });
    }

    // Tạo thông báo
    const notification = new Notification({
      userId, // Người thực hiện hành động
      ownerId, // Người nhận thông báo
      postId,
      message,
      type,
    });

    await notification.save();

    // Gửi thông báo realtime nếu `ownerId` online
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

// 2.2 Lấy danh sách thông báo của người dùng
export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.params.id; // ID người dùng đang đăng nhập

  try {
    const notifications = await Notification.find({ ownerId: userId })
      .sort({ createdAt: -1 }) // Sắp xếp thông báo mới nhất
      .lean();

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
};

// 2.3 Đánh dấu thông báo là đã đọc
export const markAsRead = async (req: AuthRequest, res: Response) => {
  const notificationId = req.params.id; // ID thông báo

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

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
