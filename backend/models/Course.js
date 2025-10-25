import mongoose from 'mongoose';

// Define the lesson schema
const lessonSchema = new mongoose.Schema({
  id: String,
  title: String,
  duration: String,
  completed: { type: Boolean, default: false },
  playing: { type: Boolean, default: false },
  type: String // 'video' or 'document'
});

// Define module schema
const moduleSchema = new mongoose.Schema({
  id: String,
  title: String,
  lessons: [lessonSchema],
  tools: [String],
  activities: [String],
  assignment: String,
  activity: String
});

// Define key concept schema
const keyConceptSchema = new mongoose.Schema({
  title: String,
  description: String,
  borderColor: String,
  bgColor: String,
  textColor: String,
  descriptionColor: String
});

// Define current lesson schema
const currentLessonSchema = new mongoose.Schema({
  id: String,
  title: String,
  module: String,
  videoUrl: String,
  content: {
    introduction: String,
    keyConcepts: [keyConceptSchema]
  }
});

// Define main course schema
const courseSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  rating: { type: Number, required: true },
  students: { type: String, required: true },
  lessonsCount: { type: String, required: true }, // ✅ renamed from 'lessons'
  price: { type: String, required: true },
  image: { type: String, required: true },
  categoryColor: { type: String, required: true },
  isBookmarked: { type: Boolean, default: false },

  // CoursePreview fields
  tags: [String],
  subtitle: String,
  instructor: String,
  lastUpdated: String,
  language: String,
  subtitles: Boolean,
  duration: String,
  reviews: Number,
  thumbnail: String,
  whatYouLearn: [String],
  curriculum: [{
    title: String,
    goal: String,
    topics: [String],
    tools: [String],
    activities: [String],
    assignment: String,
    activity: String
  }],
  priceDetails: {
    current: Number,
    original: Number,
    discount: String
  },
  countdown: {
    hours: Number,
    minutes: Number,
    seconds: Number
  },
  features: [{ icon: String, text: String }],

  // Learning progress
  modules: [moduleSchema],
  course: {
    title: String,
    subtitle: String,
    logo: String,
    progress: Number
  },
  currentLesson: currentLessonSchema,

  // Stats / Dashboard fields
  statsCards: [{
    icon: String,
    value: String,
    label: String,
    bgColor: String,
    iconBg: String
  }],
  courseCards: [{
    id: Number,
    title: String,
    status: String,
    progress: Number,
    lessons: String,
    level: String,
    levelColor: String,
    backgroundGradient: String,
    backgroundImage: String,
    buttonStyle: String,
    buttonText: String
  }],
  popularCourses: [{
    id: Number,
    title: String,
    category: String,
    categoryColor: String,
    lessons: String,
    level: String,
    price: String,
    rating: String,
    students: String,
    image: String,
    isBookmarked: Boolean
  }]
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
