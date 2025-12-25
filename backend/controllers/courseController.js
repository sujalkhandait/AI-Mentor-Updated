import Course from "../models/Course.js";

// @desc    Get all courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      "id title category categoryColor lessons level price rating students image isBookmarked"
    );
    res.json(courses);
  } catch (error) {
    console.error("GET COURSES ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findOne({ id: Number(req.params.id) });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get learning data for a course
const getCourseLearningData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const courseId = Number(req.params.id);
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id);

    if (
      !user ||
      !user.purchasedCourses?.some((c) => Number(c.courseId) === courseId)
    ) {
      return res
        .status(403)
        .json({ message: "Access denied. Course not purchased." });
    }

    const course = await Course.findOne(
      { id: courseId },
      "id title modules course"
    );
    if (!course) {
      return res
        .status(404)
        .json({ message: "Course learning data not found" });
    }

    const purchasedCourse = user.purchasedCourses.find(
      (pc) => Number(pc.courseId) === courseId
    );

    const currentLesson = purchasedCourse?.progress?.currentLesson || null;

    res.json({
      ...course.toObject(),
      currentLesson,
    });
  } catch (error) {
    console.error("LEARNING DATA ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get stats cards
const getStatsCards = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalCourses = user.purchasedCourses?.length || 0;
    const completedCourses =
      user.purchasedCourses?.filter(
        (c) => c.progress?.completedLessons?.length > 0
      ).length || 0;

    const totalHours = user.analytics?.totalHours || 0;

    const statsCards = [
      {
        icon: "/AI_Tutor_New_UI/Icons/play_button.svg",
        value: `${totalCourses - completedCourses}`,
        label: "Courses in Progress",
        bgColor: "bg-purple-50",
        iconBg: "bg-purple-100",
      },
      {
        icon: "/AI_Tutor_New_UI/Icons/check_mark.svg",
        value: `${completedCourses}`,
        label: "Completed",
        bgColor: "bg-green-50",
        iconBg: "bg-green-100",
      },
      {
        icon: "/AI_Tutor_New_UI/Icons/time_spent.svg",
        value: `${Math.round(totalHours)}h`,
        label: "Learning Hours",
        bgColor: "bg-blue-50",
        iconBg: "bg-blue-100",
      },
    ];

    res.json({ statsCards });
  } catch (error) {
    console.error("STATS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get my courses
const getMyCourses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const purchasedCourseIds = user.purchasedCourses.map((c) =>
      Number(c.courseId)
    );

    const courses = await Course.find({ id: { $in: purchasedCourseIds } });

    const coursesWithProgress = courses.map((course) => {
      const pc = user.purchasedCourses.find(
        (c) => Number(c.courseId) === course.id
      );
      const courseData = course.toObject();

      const totalLessons = parseInt(courseData.lessons?.split(" ")[0]) || 0;
      const completedLessons = pc?.progress?.completedLessons?.length || 0;

      courseData.progress =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      courseData.status =
        completedLessons === totalLessons && totalLessons > 0
          ? "Completed"
          : completedLessons > 0
          ? "In Progress"
          : "Not Started";

      courseData.lessons = `${completedLessons} of ${totalLessons} lessons`;

      return courseData;
    });

    res.json(coursesWithProgress);
  } catch (error) {
    console.error("MY COURSES ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ====================
// STUB FUNCTIONS (to prevent export errors)
// ====================

const addCourse = async (req, res) => {
  res.status(501).json({ message: "addCourse not implemented yet" });
};

const deleteCourse = async (req, res) => {
  res.status(501).json({ message: "deleteCourse not implemented yet" });
};

const updateLessonVideo = async (req, res) => {
  res.status(501).json({ message: "updateLessonVideo not implemented yet" });
};

const addSubtopics = async (req, res) => {
  res.status(501).json({ message: "addSubtopics not implemented yet" });
};

const addLessons = async (req, res) => {
  res.status(501).json({ message: "addLessons not implemented yet" });
};

const addModules = async (req, res) => {
  res.status(501).json({ message: "addModules not implemented yet" });
};

// ====================
// EXPORTS
// ====================

export {
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
};
