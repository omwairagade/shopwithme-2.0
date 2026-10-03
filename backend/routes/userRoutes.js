import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  getUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/', protect, admin, getUsers);
router.put('/:id/role', protect, admin, updateUserRole);
router.delete('/:id', protect, admin, deleteUser);

export default router;
