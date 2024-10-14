import { Router } from "express";
import { register, login, googleLogin } from "../controllers/authController";
import { followUser, getAllUser,  getFriendsWithStatus,  getUserFollowersAndFollowings, getUserProfile, suggestFriend, unfollowUser, updateStatus } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMess, sendMess } from "../controllers/messageController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get('/', getAllUser)
router.get('/user/:id', getUserProfile);
// router.get('/profiles/:username', getUserByUsername);
router.post('/google-login', googleLogin);
router.put('/follow/:id', authMiddleware, followUser);
router.put('/unfollow/:id', authMiddleware, unfollowUser);
router.put('/updatestatus', authMiddleware, updateStatus)
router.get('/friend', authMiddleware, getFriendsWithStatus)
router.get('/suggest', authMiddleware, suggestFriend)
router.get('/getfollow', authMiddleware, getUserFollowersAndFollowings)
router.post('/:id/messages/:receiverId',authMiddleware, sendMess);
router.get('/:id/messages/:receiverId', authMiddleware, getMess);


export default router;
