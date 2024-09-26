import { Router } from "express";
import { createPost, deletePost, editPost, getPosts } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getPostLikes, likePost, unlikePost } from "../controllers/likeController";
import { addComment, editComment, getComments } from "../controllers/commentController";

const router = Router();

//post
router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, editPost);


//like, unlike
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/unlike', authMiddleware, unlikePost);
router.get('/:id/likes', getPostLikes);

//comment
router.post('/:id/comment', authMiddleware, addComment);
router.get('/:id/comment', getComments);
router.delete('/:id/comment/:commentId', authMiddleware,  deletePost);
router.put('/:id/comment/:commentId', editComment);

export default router;
