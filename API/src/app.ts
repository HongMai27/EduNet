import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoute";
import postRoutes from "./routes/postRoute";


dotenv.config();
const app = express();
app.use(express.json({ limit: '10mb' }));
// Kết nối MongoDB
connectDB();

app.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Route mặc định cho đường dẫn gốc
app.get("/", (req, res) => {
  res.send("Welcome to the EduNet API");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
