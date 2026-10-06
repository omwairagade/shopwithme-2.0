import express from 'express';
import multer from 'multer';
import { protect, admin } from '../middleware/auth.js';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', protect, admin, upload.single('image'), uploadImage);

export default router;
