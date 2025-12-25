import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      default: "user",
    },
    bio: {
      type: String,
      default: "",
    },

    purchasedCourses: [
      {
        courseId: Number,
        courseTitle: String,
        purchaseDate: {
          type: Date,
          default: Date.now,
        },
        progress: {
          completedLessons: [
            {
              lessonId: String,
              completedAt: {
                type: Date,
                default: Date.now,
              },
            },
          ],
          currentLesson: {
            lessonId: String,
            moduleTitle: String,
          },
        },
      },
    ],

    analytics: {
      totalHours: { type: Number, default: 0 },
      daysStudied: { type: Number, default: 0 },
      studySessions: [
        {
          date: Date,
          hours: Number,
        },
      ],
      lastStudyDate: { type: Date, default: null },
      attendance: { type: Number, default: 0 },
      avgMarks: { type: Number, default: 0 },
      dailyHours: { type: Number, default: 0 },
      totalCourses: { type: Number, default: 0 },
      completedCourses: { type: Number, default: 0 },
      certificates: { type: Number, default: 0 },
    },

    learningHoursChart: [
      {
        date: String,
        hours: Number,
      },
    ],

    // ✅ MOVED INSIDE SCHEMA
    settings: {
      notifications: {
        emailNotifications: { type: Boolean, default: true },
        pushNotifications: { type: Boolean, default: true },
        courseUpdates: { type: Boolean, default: true },
        discussionReplies: { type: Boolean, default: true },
      },
      security: {
        twoFactorAuth: { type: Boolean, default: false },
        loginAlerts: { type: Boolean, default: true },
      },
      appearance: {
        theme: {
          type: String,
          enum: ["light", "dark", "auto"],
          default: "light",
        },
        language: { type: String, default: "en" },
      },
    },
  },
  {
    timestamps: true,
  }
);

// ✅ SAFE password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // 🔥 VERY IMPORTANT
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
