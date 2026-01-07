import express from 'express';
import {
  getJobs,
  getJobById,
  applyToJob,
  bookmarkJob,
  markNotInterested,
  getBookmarkedJobs,
  getAppliedJobs,
  getNotInterestedJobs
} from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/:id/apply', authenticate, applyToJob);
router.post('/:id/bookmark', authenticate, bookmarkJob);
router.post('/:id/not-interested', authenticate, markNotInterested);
router.get('/bookmarked/list', authenticate, getBookmarkedJobs);
router.get('/applied/list', authenticate, getAppliedJobs);
router.get('/not-interested/list', authenticate, getNotInterestedJobs);

export default router;
