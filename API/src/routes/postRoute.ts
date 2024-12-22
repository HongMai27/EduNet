import { Router } from "express";
import { createPost, deletePost, editPost, getPostById, getPosts, getSavedPosts, savePost, unsavePost } from "../controllers/postController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getPostLikes, likePost, unlikePost } from "../controllers/likeController";
import { addComment, deleteComment, editComment, getComments,  } from "../controllers/commentController";
import { addTag, getTags  } from "../controllers/tagController";
import { createGroup, getGroupDetails, getGroups, updateGroupInfoAndAddMembers } from "../controllers/groupController";
import { createReport, getAllReports, getReportById, getReports } from "../controllers/reportedController";

const router = Router();
router.get('/groupdetail/:id', getGroupDetails)
router.get("/reports", getReports);
router.get('/reports/:id', getReportById);  
router.get('/getallreport', getAllReports)
router.get("/group", getGroups);

//post
router.post("/", authMiddleware, createPost);
router.get("/", getPosts);
router.get("/tag", getTags);
router.get('/:id', getPostById);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, editPost);

//save post
router.post('/save-post/:id', authMiddleware, savePost);
router.post('/unsave/:id', authMiddleware, unsavePost);
router.get('/getsaved/:id', authMiddleware, getSavedPosts)

//report
router.post("/reports", authMiddleware, createReport);

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

//group
router.post('/group', authMiddleware, createGroup);
router.put('/group/:id', authMiddleware, updateGroupInfoAndAddMembers);


export default router;
