import { Router } from "express";
import { register, login, googleLogin, forgotPassword, changePassword } from "../controllers/authController";
import { editProfile, followUser, getAllUser,  getFriendsWithStatus,  getUserFollowersAndFollowings, getUserProfile, getUserbyId, searchUserByUsername, suggestFriend, unfollowUser, updateStatus, updateUserStatus } from "../controllers/userController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getMess, sendMess } from "../controllers/messageController";
import { deleteNotification, getNotifications, markAsRead, sendNotification } from "../controllers/notificationController";
import { suggestFriends } from "../controllers/geolocationController";

const router = Router();
    
//login, register, forgetpass, resetpass
router.post("/register", register);
router.post("/login", login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.put('/change-pass', authMiddleware, changePassword)

//profile
router.get('/', getAllUser)
router.get('/userinfor/:id', getUserbyId)
router.get('/user/:id', getUserProfile);
router.put('/user/:id', authMiddleware, editProfile)
router.put("/update-status", authMiddleware, updateUserStatus);

//follow, friend
router.put('/follow/:id', authMiddleware, followUser);
router.put('/unfollow/:id', authMiddleware, unfollowUser);
router.put('/updatestatus', authMiddleware, updateStatus)
router.get('/friend', authMiddleware, getFriendsWithStatus)
router.get('/suggest', authMiddleware, suggestFriend)
router.get('/suggest-friends', suggestFriends)

router.get('/getfollow', authMiddleware, getUserFollowersAndFollowings)

//chat
router.post('/:id/messages/:receiverId',authMiddleware, sendMess);
router.get('/:id/messages/:receiverId', authMiddleware, getMess);

//notifiaction
// router.get('/notifications/:userId', authMiddleware, getNotifications);
router.post('/notifications', authMiddleware, sendNotification)
router.get('/notifications/:id', authMiddleware, getNotifications)
router.put('/notifications/:id', authMiddleware, markAsRead)
router.delete('/notifications/:id', authMiddleware, deleteNotification)





//search
router.get('/users/search', searchUserByUsername); 
export default router;
