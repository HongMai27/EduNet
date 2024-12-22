import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoute";
import postRoutes from "./routes/postRoute";
import uploadRouter from './middlewares/upload';
import http from 'http';
import { Server } from 'socket.io';
import cookieSession from "cookie-session";
import passport from "passport";
import './middlewares/passport-setup';
import Notification from "./models/notificationModel";
import User, { IUser } from "./models/userModel"; 
import Post from "./models/postModel";
import axios from "axios";

const app = express();
const server = http.createServer(app); // create http server

// User status
interface UserStatus {
  [userId: string]: {
    isOnline: boolean;
    socketId: string;
  };
}
export const userStatus: UserStatus = {};

app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_SECRET || "your_cookie_session_secret"],
    maxAge: 24 * 60 * 60 * 1000, // 24h
  })
);

// create passport
app.use(passport.initialize());
app.use(passport.session());

// Routes Google login
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/'); 
});

// Socket.IO for chat, call and notification
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  
  },
});

export {io};

io.on('connection', (socket) => {
  console.log('Người dùng đã kết nối: ', socket.id);

  socket.on('registerUser', (userId: string) => {
    userStatus[userId] = { isOnline: true, socketId: socket.id };
    updateUserStatus(userId, true); 
    console.log(`User ${userId} is online.`);
  });
  

  // disconnect
  socket.on('disconnect', () => {
    const userId = Object.keys(userStatus).find(key => userStatus[key].socketId === socket.id);
    
    if (userId) {
      userStatus[userId].isOnline = false;
      updateUserStatus(userId, false); 
      delete userStatus[userId]; 
      console.log(`User ${userId} is offline.`);
    }
    console.log('Người dùng đã ngắt kết nối: ', socket.id);
  });

  // chat
  socket.on('sendMessage', (data) => {
    io.emit('newMessage', data); 
  });


  // send noti
  socket.on('sendNotification', async (data) => {
    console.log('Received data:', data);
    const { postId, type, username, userId, avatar } = data;
  
    try {
      const post = await Post.findById(postId).populate<{ user: IUser }>('user').lean();
  
      if (!post || !post.user) {
        console.log(`Post not found or has no owner: ${postId}`);
        return;
      }
  
      const ownerId = post.user._id.toString();
      if (userId === ownerId) {
        console.log(`Notification not sent. User ${userId} is the owner of the post ${postId}.`);
        return;
      }
      
      const message =
      type === 'like'
        ? `${username} liked your post.`
        : type === 'comment'
        ? `${username} commented on your post.`
        : type === 'share'
        ? `${username} shared your post.`
        : type === 'save'
        ? `${username} saved your post.`
        : type === 'reported'
        ? `${username} deleted your post because of reported`
        : type === 'follow'
        ? `${username} started following you.`
        : 'You have a new notification.';

  
      // Lưu thông báo vào database
      const notification = new Notification({
        userId,
        ownerId,
        username,
        avatar,
        message,
        postId,
        type,
      });
      await notification.save();
  
      // Gọi API để lấy trạng thái isOnline của ownerId
      const response = await axios.get(`http://localhost:5000/api/auth/user/${ownerId}`);
      const { isOnline } = response.data; 
  
      if (isOnline) {
        io.to(userStatus[userId]?.socketId).emit('newNotification', {
          message,
          postId,
          username,
          avatar,
          type,
          senderId: userId,
        });
        console.log(`Notification sent to owner ${ownerId}`);
      } else {
        console.log(`Owner ${ownerId} is offline. Notification saved.`);
      }
    } catch (error) {
      console.error(`Error sending notification for post ${postId}:`, error);
    }
  });
  

  // Video Call Events
  socket.on('startVideoCall', ({ receiverId, offer }) => {
    socket.to(receiverId).emit('videoCall', { offer, senderId: socket.id });
  });

  socket.on('answerVideoCall', ({ receiverId, answer }) => {
    socket.to(receiverId).emit('videoCallAnswer', { answer, senderId: socket.id });
  });
});

// update status database
const updateUserStatus = async (userId: string, isOnline: boolean) => {
  try {
    await User.findByIdAndUpdate(userId, { isOnline });
    console.log(`Updated status for user ${userId}: ${isOnline}`);
  } catch (error) {
    console.error(`Error updating status for user ${userId}:`, error);
  }
};

// limit upload file
app.use(express.json({ limit: '10mb' }));


connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], 
  credentials: true,
}));

app.use(express.json());

app.use((req, res, next) => { 
  console.log(`Incoming ${req.method} request to ${req.url} `);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use('/api', uploadRouter);

const PORT = process.env.PORT; 
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
