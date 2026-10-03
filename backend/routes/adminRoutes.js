import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(admin);

router.get('/stats', getDashboardStats);

export default router;