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

const app = express();
const server = http.createServer(app); // create http server

// User status
interface UserStatus {
  [userId: string]: {
    isOnline: boolean;
    socketId: string;
  };
}
const userStatus: UserStatus = {};

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
      updateUserStatus(userId, false); // Cập nhật trạng thái offline cho người dùng trong DB
      delete userStatus[userId]; 
      console.log(`User ${userId} is offline.`);
    }
    console.log('Người dùng đã ngắt kết nối: ', socket.id);
  });

  // chat
  socket.on('sendMessage', (data) => {
    io.emit('newMessage', data); 
  });

  socket.on('sendNotification', async (data) => {
    const { postId, type, username, userId } = data;
  
    try {
      const post = await Post.findById(postId)
        .populate<{ user: IUser }>('user') 
        .lean();
  
      if (!post || !post.user) {
        console.log(`Post not found or has no owner: ${postId}`);
        return;
      }
  
      // Truy cập `post.user._id` vì TypeScript giờ đã hiểu `user` là một đối tượng `User`
      const ownerUserId = post.user._id.toString();
      const message = type === 'like'
        ? `${username} liked your post.`
        : `${username} commented on your post.`;
  
      const notification = new Notification({
        userId: userId,  
        ownerUserId: ownerUserId, 
        message,
        postId,
        type,
      });
      await notification.save();
  
      const ownerSocket = userStatus[ownerUserId];
      if (ownerSocket && ownerSocket.isOnline) {
        io.to(ownerSocket.socketId).emit('newNotification', { message, postId });
        console.log(`Sent notification to user ${ownerUserId}`);
      } else {
        console.log(`User ${ownerUserId} is offline; notification saved.`);
      }
    } catch (error) {
      console.error(`Error in sendNotification for post ${postId}:`, error);
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
