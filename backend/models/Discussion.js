import mongoose from "mongoose";

const replySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: true, // ✅ ensure reply.id() works correctly
  }
);

const discussionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    replies: [replySchema],
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    hasAISuggestion: {
      type: Boolean,
      default: false,
    },
    aiSuggestion: {
      text: String,
    },
  },
  {
    timestamps: true,
  }
);

// 🔥 Performance index for sorting
discussionSchema.index({ createdAt: -1 });

const Discussion = mongoose.model("Discussion", discussionSchema);
export default Discussion;
