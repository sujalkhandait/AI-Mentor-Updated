import express from "express";
import {
  getCourses,
  getCourseById,
  getCourseLearningData,
  getStatsCards,
  getMyCourses,
  addCourse,
  deleteCourse,
  updateLessonVideo,
  addSubtopics,
  addLessons,
  addModules,
} from "../controllers/courseController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =======================
   PUBLIC ROUTES
======================= */
router.route("/").get(getCourses);

/* =======================
   PROTECTED ROUTES
======================= */
router.route("/stats/cards").get(protect, getStatsCards);
router.route("/my-courses").get(protect, getMyCourses);

/* =======================
   COURSE LEARNING
======================= */
router.route("/:id/learning").get(protect, getCourseLearningData);

/* =======================
   ADMIN / MANAGEMENT
======================= */
router.route("/").post(protect, addCourse);
router.route("/:id").delete(protect, deleteCourse);
router.route("/:courseId/modules").post(protect, addModules);
router.route("/:courseId/modules/:moduleId/lessons").post(protect, addLessons);
router
  .route("/:courseId/lessons/:lessonId/video")
  .put(protect, updateLessonVideo);
router.route("/:courseId/subtopics").post(protect, addSubtopics);

/* =======================
   DYNAMIC (KEEP LAST)
======================= */
router.route("/:id").get(getCourseById);

export default router;
