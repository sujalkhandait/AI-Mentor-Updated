import express from "express";
import {
  getUserAnalytics,
  recordStudySession,
} from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getUserAnalytics);
router.route("/study-session").post(protect, recordStudySession);

export default router;
