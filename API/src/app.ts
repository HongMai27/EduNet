import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoute";
import postRoutes from "./routes/postRoute";
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();
const app = express();
const server = http.createServer(app); // create http server

// create instance Socket.IO and connect to server  
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // Frontend URL
    methods: ["GET", "POST"],
  },
});
io.on('connection', (socket) => {
  console.log('Người dùng đã kết nối: ', socket.id);

  // Nhận tin nhắn từ client và phát đến tất cả các client khác
  socket.on('send_message', (data) => {
    io.emit('receive_message', data); // Phát sự kiện đến tất cả các client
  });

  // Khi người dùng ngắt kết nối
  socket.on('disconnect', () => {
    console.log('Người dùng đã ngắt kết nối: ', socket.id);
  });
});

// limit for upload file
app.use(express.json({ limit: '10mb' }));

// connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.get("/", (req, res) => {
  res.send("Welcome to the EduNet API");
});

// when 1 user connect
// io.on('connection', (socket) => { //listen event
//   console.log('A user connected:', socket.id);

//   socket.on('sendMessage', (messageData) => {
//     const { conversationId, senderId, content } = messageData;

//     // Validate message data
//     if (!conversationId || !senderId || !content) {
//       console.error("Invalid message data");
//       return; // Invalid data, do not proceed
//     }

//     const newMessage = {  
//       conversationId,
//       senderId,
//       content,
//       timestamp: new Date(),
//     };

//     const message = new Message(newMessage);
//     message.save()
//       .then(() => {
//         io.in(conversationId).emit('newMessage', newMessage); // send to participants
//       })
//       .catch(err => {
//         console.error("Error saving message:", err);
//       });
//   });

//   socket.on('joinConversation', (conversationId) => { //participants join conversation
//     socket.join(conversationId);
//     console.log(`User joined conversation: ${conversationId}`);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

const PORT = process.env.PORT || 5000; // Default to 5000 if PORT not set
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
