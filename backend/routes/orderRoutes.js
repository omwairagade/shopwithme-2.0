import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
