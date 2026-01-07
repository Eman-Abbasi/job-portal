import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { uploadResume } from '../middleware/upload.js';
import {
  getProfile,
  updateProfile,
  uploadResume as uploadResumeController,
  getResumes,
  deleteResume,
  downloadResume
} from '../controllers/userController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', uploadResume.single('resume'), uploadResumeController);
router.get('/resume', getResumes);
router.delete('/resume/:id', deleteResume);
router.get('/resume/:id/download', downloadResume);

export default router;
