import express from 'express';
import { getUserProfile,getAllUsers,updateUserLocation,updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get current user profile
router.get('/me', protect, getUserProfile);


// Update current user profile
router.put('/me', protect, updateUserProfile);
//get location
router.put("/location", protect, updateUserLocation);

router.get("/", getAllUsers);
export default router;
 