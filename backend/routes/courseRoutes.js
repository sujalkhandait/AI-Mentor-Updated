import express from 'express';
import {
  getCourses,
  getCourseById,
  getCourseLearningData,
  getStatsCards,
  getMyCourses,
  addCourse,
  deleteCourse
} from '../controllers/courseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getCourses);
router.route('/:id').get(getCourseById);
router.route('/stats/cards').get(getStatsCards);

// Protected routes
router.route('/my-courses').get(protect, getMyCourses);
router.route('/:id/learning').get(protect, getCourseLearningData);

// Admin routes
router.route('/').post(protect, addCourse);
router.route('/:id').delete(protect, deleteCourse);

export default router;
