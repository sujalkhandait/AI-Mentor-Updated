import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const migrateCourses = async () => {
  try {
    // Read JSON files
    const coursesPath = path.join(__dirname, '../../frontend/public/data/courses.json');
    const coursePreviewsPath = path.join(__dirname, '../../frontend/public/data/coursePreviews.json');
    const learningPath = path.join(__dirname, '../../frontend/public/data/learning.json');

    const coursesData = JSON.parse(fs.readFileSync(coursesPath, 'utf8'));
    const coursePreviewsData = JSON.parse(fs.readFileSync(coursePreviewsPath, 'utf8'));
    const learningData = JSON.parse(fs.readFileSync(learningPath, 'utf8'));

    console.log('✅ Read JSON files successfully');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('🧹 Cleared existing courses');

    for (const coursePreview of coursePreviewsData.courses) {
      const learningInfo = learningData[coursePreview.id.toString()];
      const courseInfo = coursesData.popularCourses?.find(c => c.id === coursePreview.id);

      // Ensure lessons are arrays, not strings
      if (learningInfo?.modules) {
        for (const module of learningInfo.modules) {
          if (typeof module.lessons === 'string') {
            try {
              module.lessons = JSON.parse(module.lessons);
            } catch {
              module.lessons = [];
            }
          }
        }
      }

      const courseData = {
        id: coursePreview.id,
        title: coursePreview.title,
        category: courseInfo?.category || coursePreview.category || 'General',
        level: courseInfo?.level || coursePreview.level || 'Beginner',
        rating: coursePreview.rating,
        students: coursePreview.students,
        lessonsCount: courseInfo?.lessons || coursePreview.lessons || '0 lessons',
        price: courseInfo?.price || `₹${coursePreview.priceDetails?.current || 0}`,
        image: courseInfo?.image || coursePreview.thumbnail,
        categoryColor: courseInfo?.categoryColor || 'bg-blue-100 text-blue-600',
        isBookmarked: courseInfo?.isBookmarked || false,

        tags: coursePreview.tags,
        subtitle: coursePreview.subtitle,
        instructor: coursePreview.instructor,
        lastUpdated: coursePreview.lastUpdated,
        language: coursePreview.language,
        subtitles: coursePreview.subtitles,
        duration: coursePreview.duration,
        reviews: coursePreview.reviews,
        thumbnail: coursePreview.thumbnail,
        whatYouLearn: coursePreview.whatYouLearn,
        curriculum: coursePreview.curriculum,
        priceDetails: coursePreview.priceDetails,
        countdown: coursePreview.countdown,
        features: coursePreview.features,

        // From learning.json
        modules: learningInfo?.modules || [],
        course: learningInfo?.course || {
          title: coursePreview.title,
          subtitle: 'Complete Course',
          logo: '/AI_Tutor_New_UI/Dashboard/logo.png',
          progress: 0
        },
        currentLesson: learningInfo?.currentLesson || null,

        statsCards: coursePreview.id === 1 ? coursesData.statsCards : [],
        courseCards: coursesData.courseCards?.filter(c => c.id === coursePreview.id) || [],
        popularCourses: coursesData.popularCourses?.filter(c => c.id === coursePreview.id) || []
      };

      const course = new Course(courseData);
      await course.save();
      console.log(`✅ Migrated course: ${coursePreview.title}`);
    }

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

connectDB().then(() => migrateCourses());
