import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';
import {
  createJob,
  updateJob,
  deleteJob,
  getAllJobs,
  getJobById
} from '../controllers/adminController.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Validation rules
const jobValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('company').notEmpty().withMessage('Company is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('salary').notEmpty().withMessage('Salary is required'),
  body('jobType').isIn(['full-time', 'part-time', 'contract']).withMessage('Invalid job type'),
  body('category').notEmpty().withMessage('Category is required'),
  body('experienceLevel').isIn(['entry', 'mid', 'senior', 'executive']).withMessage('Invalid experience level'),
  body('description').notEmpty().withMessage('Description is required')
];

router.get('/jobs', getAllJobs);
router.get('/jobs/:id', getJobById);
router.post('/jobs', jobValidation, createJob);
router.put('/jobs/:id', jobValidation, updateJob);
router.delete('/jobs/:id', deleteJob);

export default router;
