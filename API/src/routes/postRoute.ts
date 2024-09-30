import { Router } from "express";
import { createPost, deletePost, editPost, getPostById, getPosts } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getPostLikes, likePost, unlikePost } from "../controllers/likeController";
import { addComment, deleteComment, editComment, getComments,  } from "../controllers/commentController";
import { addTag, getTags  } from "../controllers/tagController";

const router = Router();

//post
router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.get("/tag", getTags);
router.get('/:id', getPostById);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, editPost);


//like, unlike
router.post('/:id/like', authMiddleware, likePost);
router.post('/:id/unlike', authMiddleware, unlikePost);
router.get('/:id/likes', getPostLikes);

//comment
router.post('/:id/comment', authMiddleware, addComment);
router.get('/:id/comment', getComments);
router.delete('/:id/comment/:commentId', authMiddleware,  deleteComment);
router.put('/:id/comment/:commentId', authMiddleware, editComment);

//tag route
router.post('/addtag', addTag);

export default router;
