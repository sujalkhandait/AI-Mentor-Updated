import Course from '../models/Course.js';

// @desc    Get all courses (popular courses for explore tab)
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, 'id title category categoryColor lessons level price rating students image isBookmarked');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get course by ID (detailed course preview)
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
      const course = await Course.findOne({ id: req.params.id });
      if (course) {
        res.json(course);
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

// @desc    Get learning data for a course
// @route   GET /api/courses/:id/learning
// @access  Private (user must have purchased the course)
const getCourseLearningData = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    // Check if user has purchased this course
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    if (!user || !user.purchasedCourses.some(course => course.courseId == courseId)) {
      return res.status(403).json({ message: 'Access denied. Course not purchased.' });
    }

    const course = await Course.findOne({ id: courseId }, 'id title modules course currentLesson');
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course learning data not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get stats cards data
// @route   GET /api/courses/stats/cards
// @access  Public
const getStatsCards = async (req, res) => {
  try {
    // Find a document that actually has statsCards data.
    const course = await Course.findOne({ 'statsCards.0': { $exists: true } }, 'statsCards');

    if (course && course.statsCards && course.statsCards.length > 0) {
      res.json({ statsCards: course.statsCards });
    } else {
      res.status(404).json({ message: 'Stats cards not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get course cards for "My Courses" section
// @route   GET /api/courses/my-courses
// @access  Private
const getMyCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user's purchased courses
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const purchasedCourseIds = user.purchasedCourses.map(course => course.courseId);

    // Get course data for purchased courses
    const courses = await Course.find(
      { id: { $in: purchasedCourseIds } },
      'id title status progress lessons level levelColor backgroundGradient backgroundImage buttonStyle buttonText image rating students'
    );

    // Add progress data from user model
    const coursesWithProgress = courses.map(course => {
      const purchasedCourse = user.purchasedCourses.find(pc => pc.courseId === course.id);
      const courseData = course.toObject();

      if (purchasedCourse) {
        const totalLessons = courseData.lessons ? parseInt(courseData.lessons.split(' ')[0]) : 0;
        const completedLessons = purchasedCourse.progress?.completedLessons?.length || 0;

        courseData.progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        courseData.status = completedLessons === totalLessons && totalLessons > 0 ? 'Completed' :
                           completedLessons > 0 ? 'In Progress' : 'Not Started';
        courseData.lessons = `${completedLessons} of ${totalLessons} lessons`;
      }

      return courseData;
    });

    res.json(coursesWithProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new course
// @route   POST /api/courses
// @access  Private/Admin
const addCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
        return res.status(400).json({ message: 'Course with this ID already exists.' });
    }
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ id: req.params.id });

    if (course) {
      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};


export { getCourses, getCourseById, getCourseLearningData, getStatsCards, getMyCourses, addCourse, deleteCourse };
