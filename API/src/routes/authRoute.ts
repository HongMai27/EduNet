import { Router } from "express";
import { register, login } from "../controllers/authController";
import { getAllUser, getUserProfile } from "../controllers/userController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get('/', getAllUser)
router.get('/user/:id', getUserProfile);


export default router;
