import { Router } from "express";
import { createPost, deletePost, getPosts } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getPostLikes, likePost, unlikePost } from "../controllers/likeController";

const router = Router();

router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.delete("/:id", authMiddleware, deletePost);
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/unlike', authMiddleware, unlikePost);
router.get('/:id/likes', getPostLikes);

export default router;
