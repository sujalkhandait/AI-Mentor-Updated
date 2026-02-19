import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  Reply,
  Image as ImageIcon,
  Code,
  AtSign,
  Bot,
  Bookmark,
} from "lucide-react";

const DiscussionsPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Recent");
  const [questionTitle, setQuestionTitle] = useState("");
  const [questionDescription, setQuestionDescription] = useState("");
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = ["Recent", "Unanswered", "My Doubts", "Popular"];

  // Fetch discussions from API
  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/discussions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch discussions");
      }

      const data = await response.json();
      setDiscussions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async (title, description) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create discussion");
      }

      const newDiscussion = await response.json();
      setDiscussions([newDiscussion, ...discussions]);
    } catch (err) {
      setError(err.message);
    }
  };

  const addReply = async (discussionId, text) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/discussions/${discussionId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      const updatedDiscussion = await response.json();
      setDiscussions(
        discussions.map((d) => (d._id === discussionId ? updatedDiscussion : d))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const [discussions, setDiscussions] = useState([]);
  const [myCourses, setMyCourses] = useState([]);

  // Function to map purchased courses to display format
  const mapPurchasedCoursesToDisplay = async (purchasedCourses) => {
    if (!purchasedCourses || purchasedCourses.length === 0) return [];

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/courses/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const coursesData = await response.json();

      return purchasedCourses
        .map((purchasedCourse, index) => {
          const courseCard = coursesData.find(
            (card) => card.id === purchasedCourse.courseId
          );
          if (!courseCard) return null;

          const completedLessons =
            purchasedCourse.progress?.completedLessons?.length || 0;
          const totalLessons =
            parseInt(courseCard.lessons.split(" of ")[1]) || 1;
          const progress = Math.round((completedLessons / totalLessons) * 100);

          const currentLesson = purchasedCourse.progress?.currentLesson;
          const subtitle = currentLesson
            ? `Lesson ${currentLesson.lessonId}: ${currentLesson.moduleTitle}`
            : courseCard.lessons;

          // Map courseId to image paths
          const imageMap = {
            1: "AI_Tutor_New_UI/Discussion_Room/react_fundamentals.png",
            2: "AI_Tutor_New_UI/Discussion_Room/python_for_ai.png",
            3: "AI_Tutor_New_UI/Discussion_Room/digital_marketing.png",
          };

          const progressColorMap = {
            1: "bg-indigo-600",
            2: "bg-purple-600",
            3: "bg-cyan-600",
          };

          return {
            title: purchasedCourse.courseTitle,
            subtitle: subtitle,
            progress: progress,
            lessons: `${completedLessons}/${totalLessons}`,
            image:
              imageMap[purchasedCourse.courseId] ||
              "AI_Tutor_New_UI/Discussion_Room/react_fundamentals.png",
            progressColor:
              progressColorMap[purchasedCourse.courseId] || "bg-indigo-600",
            isActive: index === 0, // First course is active
          };
        })
        .filter((course) => course !== null);
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };

  // Load dynamic courses data
  useEffect(() => {
    const loadCourses = async () => {
      if (user && user.purchasedCourses) {
        const dynamicCourses = await mapPurchasedCoursesToDisplay(
          user.purchasedCourses
        );
        setMyCourses(dynamicCourses);
      }
    };
    loadCourses();
  }, [user]);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!questionTitle.trim() || !questionDescription.trim()) return;

    await createDiscussion(questionTitle, questionDescription);
    setQuestionTitle("");
    setQuestionDescription("");
  };

  const handleReply = async (discussionId) => {
    if (!replyText.trim()) return;
    await addReply(discussionId, replyText);
    setReplyText("");
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50 flex flex-col">
=======
    <div className="min-h-screen bg-canvas-alt flex flex-col">
>>>>>>> upstream/main
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        activePage="discussions"
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex transition-all duration-300 mt-10 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-80"
        }`}
      >
        {/* Discussion Content */}
<<<<<<< HEAD
        <main className="flex-1 bg-gray-50 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* Ask a Question Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
=======
        <main className="flex-1 bg-canvas-alt p-4 sm:p-6">
          <div className="max-w-4xl pt-12 mx-auto space-y-4 sm:space-y-6">
            {/* Ask a Question Section */}
            <div className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-main mb-4">
>>>>>>> upstream/main
                Ask a Question
              </h2>
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title of your question..."
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
<<<<<<< HEAD
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
=======
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-main placeholder-muted"
>>>>>>> upstream/main
                />
                <textarea
                  placeholder="Describe your doubt in detail..."
                  value={questionDescription}
                  onChange={(e) => setQuestionDescription(e.target.value)}
                  rows={4}
<<<<<<< HEAD
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
=======
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-main placeholder-muted"
>>>>>>> upstream/main
                />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                      type="button"
<<<<<<< HEAD
                      className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-800"
=======
                      className="flex items-center space-x-1 sm:space-x-2 text-muted hover:text-main"
>>>>>>> upstream/main
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span className="text-sm">Image</span>
                    </button>
                    <button
                      type="button"
<<<<<<< HEAD
                      className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-800"
=======
                      className="flex items-center space-x-1 sm:space-x-2 text-muted hover:text-main"
>>>>>>> upstream/main
                    >
                      <Code className="w-4 h-4" />
                      <span className="text-sm">Code</span>
                    </button>
                    <button
                      type="button"
<<<<<<< HEAD
                      className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-800"
=======
                      className="flex items-center space-x-1 sm:space-x-2 text-muted hover:text-main"
>>>>>>> upstream/main
                    >
                      <AtSign className="w-4 h-4" />
                      <span className="text-sm">Mention</span>
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-orange-500 to-teal-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Post Question
                  </button>
                </div>
              </form>
            </div>

            {/* Filter Tabs */}
<<<<<<< HEAD
            <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm">
=======
            <div className="bg-card rounded-xl border border-border p-2 shadow-sm">
>>>>>>> upstream/main
              <div className="flex space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-orange-500 to-teal-500 text-white"
<<<<<<< HEAD
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
=======
                        : "text-muted hover:text-main hover:bg-canvas-alt"
>>>>>>> upstream/main
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Discussion Threads */}
            <div className="space-y-4 sm:space-y-6">
              {loading ? (
                <div className="text-center py-8">Loading discussions...</div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : discussions.length === 0 ? (
<<<<<<< HEAD
                <div className="text-center py-8 text-gray-500">
=======
                <div className="text-center py-8 text-muted">
>>>>>>> upstream/main
                  No discussions yet. Be the first to ask a question!
                </div>
              ) : (
                discussions.map((discussion) => (
                  <div
                    key={discussion._id}
<<<<<<< HEAD
                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm"
=======
                    className="bg-card rounded-xl border border-border p-4 sm:p-6 shadow-sm"
>>>>>>> upstream/main
                  >
                    {/* Discussion Header */}
                    <div className="flex items-start space-x-3 sm:space-x-4 mb-4">
                      <img
                        src="/ui/avatar-4.png"
                        alt={discussion.user.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
<<<<<<< HEAD
                          <span className="font-medium text-gray-900">
=======
                          <span className="font-medium text-main">
>>>>>>> upstream/main
                            {discussion.user.name}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Beginner
                            </span>
<<<<<<< HEAD
                            <span className="text-sm text-gray-500">
=======
                            <span className="text-sm text-muted">
>>>>>>> upstream/main
                              {new Date(discussion.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
<<<<<<< HEAD
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {discussion.title}
                        </h3>
                        <p className="text-gray-700 mb-4">
                          {discussion.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500">
=======
                        <h3 className="text-lg font-medium text-main mb-2">
                          {discussion.title}
                        </h3>
                        <p className="text-muted mb-4">
                          {discussion.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                          <button className="flex items-center space-x-2 text-muted hover:text-red-500">
>>>>>>> upstream/main
                            <Heart className="w-4 h-4" />
                            <span className="text-sm">
                              {discussion.likes.length}
                            </span>
                          </button>
<<<<<<< HEAD
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500">
=======
                          <button className="flex items-center space-x-2 text-muted hover:text-blue-500">
>>>>>>> upstream/main
                            <Reply className="w-4 h-4" />
                            <span className="text-sm">
                              {discussion.replies.length} replies
                            </span>
                          </button>
<<<<<<< HEAD
                          <button className="flex items-center space-x-2 text-gray-600 hover:text-yellow-500">
=======
                          <button className="flex items-center space-x-2 text-muted hover:text-yellow-500">
>>>>>>> upstream/main
                            <Bookmark className="w-4 h-4" />
                            <span className="text-sm">Save</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* AI Suggestion */}
                    {discussion.hasAISuggestion && (
<<<<<<< HEAD
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
=======
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
>>>>>>> upstream/main
                        <div className="flex items-start space-x-3">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full p-2">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
<<<<<<< HEAD
                            <h4 className="font-medium text-gray-900 mb-1">
                              AI Suggestion
                            </h4>
                            <p className="text-sm text-gray-700">
=======
                            <h4 className="font-medium text-main mb-1">
                              AI Suggestion
                            </h4>
                            <p className="text-sm text-muted">
>>>>>>> upstream/main
                              {discussion.aiSuggestion.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Responses */}
                    {discussion.replies &&
                      discussion.replies.map((reply, index) => (
                        <div
                          key={index}
<<<<<<< HEAD
                          className="ml-4 sm:ml-8 border-l-2 border-gray-100 pl-4 sm:pl-6 mb-4"
=======
                          className="ml-4 sm:ml-8 border-l-2 border-border pl-4 sm:pl-6 mb-4"
>>>>>>> upstream/main
                        >
                          <div className="flex items-start space-x-3">
                            <img
                              src="/ui/avatar-4.png"
                              alt={reply.user.name}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
<<<<<<< HEAD
                                <span className="font-medium text-gray-900">
=======
                                <span className="font-medium text-main">
>>>>>>> upstream/main
                                  {reply.user.name}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Beginner
                                  </span>
<<<<<<< HEAD
                                  <span className="text-sm text-gray-500">
=======
                                  <span className="text-sm text-muted">
>>>>>>> upstream/main
                                    {new Date(reply.createdAt).toLocaleString()}
                                  </span>
                                </div>
                              </div>
<<<<<<< HEAD
                              <p className="text-gray-700 mb-2">{reply.text}</p>
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
=======
                              <p className="text-muted mb-2">{reply.text}</p>
                              <div className="flex items-center space-x-4">
                                <button className="flex items-center space-x-1 text-muted hover:text-red-500">
>>>>>>> upstream/main
                                  <Heart className="w-3 h-3" />
                                  <span className="text-xs">
                                    {reply.likes.length}
                                  </span>
                                </button>
<<<<<<< HEAD
                                <button className="text-xs text-gray-600 hover:text-blue-500">
=======
                                <button className="text-xs text-muted hover:text-blue-500">
>>>>>>> upstream/main
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {/* Reply Input */}
                    <div className="ml-4 sm:ml-8 flex items-start space-x-3">
                      <img
                        src="/ui/avatar-4.png"
                        alt="Your avatar"
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                      />
                      <div className="flex-1">
                        <textarea
                          placeholder="Write your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          rows={3}
<<<<<<< HEAD
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm"
=======
                          className="w-full px-3 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-sm text-main placeholder-muted"
>>>>>>> upstream/main
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleReply(discussion._id)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>

        {/* My Courses Sidebar */}
<<<<<<< HEAD
        <aside className="w-80 bg-white border-l border-gray-200 p-6 hidden xl:block">
          <h2 className="text-xl font-bold text-gray-900 mb-6">My courses</h2>
=======
        <aside className="w-80 mt-8 bg-card border-l border-border p-6 hidden xl:block">
          <h2 className="text-xl font-bold text-main mb-6">My courses</h2>
>>>>>>> upstream/main
          <div className="space-y-4">
            {myCourses.map((course, index) => (
              <div
                key={index}
                className={`rounded-xl p-4 border shadow-sm ${
                  course.isActive
<<<<<<< HEAD
                    ? "bg-teal-50 border-teal-200"
                    : "bg-white border-gray-200"
=======
                    ? "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800"
                    : "bg-card border-border"
>>>>>>> upstream/main
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
<<<<<<< HEAD
                    <h3 className="font-medium text-gray-900 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {course.subtitle}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{course.lessons}</span>
                      <span className="text-gray-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
=======
                    <h3 className="font-medium text-main mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted mb-2">
                      {course.subtitle}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted">{course.lessons}</span>
                      <span className="text-muted">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-input rounded-full h-2 mt-2">
>>>>>>> upstream/main
                      <div
                        className={`h-2 rounded-full ${course.progressColor}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DiscussionsPage;
