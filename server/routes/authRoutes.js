import express from "express";
import { signup,login, verifyEmail } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/verify-email", verifyEmail);

router.post("/login", login);

export default router;
