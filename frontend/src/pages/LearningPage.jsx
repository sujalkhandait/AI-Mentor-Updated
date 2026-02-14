import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAIVideo } from "../service/aiService";

import {
  ChevronLeft,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ChevronRight,
  ChevronDown,
  Check,
  Circle,
  FileText,
  CloudCog,
} from "lucide-react";

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function Learning() {
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const { user, updateUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [learningData, setLearningData] = useState(null);
  const [expandedModule, setExpandedModule] = useState("module-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [celebritySearch, setCelebritySearch] = useState("");

  // Captions state
  const [captions, setCaptions] = useState([]);
  const [activeCaption, setActiveCaption] = useState("");
  const celebrities = ["Salman Khan", "Modi ji", "SRK"];

  // map celebrities to local videos and vtt files
  const celebrityVideoMap = {
    "Salman Khan": { video: "/vdo1.mp4", vtt: "/vdo1.vtt" },
    "Modi ji": { video: "/vdo2.mp4", vtt: "/vdo2.vtt" },
    SRK: { video: "/vdo1.mp4", vtt: "/vdo1.vtt" },
  };

  const [selectedCelebrity, setSelectedCelebrity] = useState(null);

  // When user requested single-word subtitles for the Reactjs paragraph,
  // we'll split into words and compute word-by-word cues when video duration is known.
  // const Reactjs_PARAGRAPH = `Reactjs is a high-level, object-oriented programming language that was originally developed by Sun Microsystems in 1995 and is now owned by Oracle Corporation. It is designed to be platform-independent, meaning that Reactjs code can run on any device that has a Reactjs Virtual Machine (JVM), making it highly versatile for developing cross-platform applications. Reactjs emphasizes object-oriented principles, such as encapsulation, inheritance and polymorphism, which allow developers to create modular, reusable and maintainable code. It has a strong memory management system, including automatic garbage collection, which reduces the likelihood of memory leaks.`;

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [aiVideoUrl, setAiVideoUrl] = useState(null);
  const [isAIVideoLoading, setIsAIVideoLoading] = useState(false);
  const [generatedTextContent, setGeneratedTextContent] = useState("");

  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);



  useEffect(() => {
    // Check if user has purchased this course
    // const hasPurchased = user?.purchasedCourses?.some(course => course.courseId === parseInt(courseId));
    // if (!hasPurchased) {
    //   navigate('/courses');
    //   return;
    // }

    const fetchLearningData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/courses/${courseId}/learning`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const courseData = await response.json();
          console.log(courseData);
          setLearningData(courseData);
          // Load user's progress for this course
          const userProgress = user?.purchasedCourses?.find(
            (course) => course.courseId === parseInt(courseId)
          )?.progress;
          if (userProgress) {
            setExpandedModule(
              userProgress.currentLesson?.moduleTitle || "module-1"
            );
            // Set current lesson based on progress
            const currentLesson = userProgress.currentLesson;
            if (currentLesson) {
              // Find and set the current lesson
              const lesson = courseData.modules
                .flatMap((module) => module.lessons)
                .find((l) => l.id === currentLesson.lessonId);
              if (lesson) {
                setLearningData((prev) => ({
                  ...prev,
                  currentLesson: lesson,
                }));
              }
            }
          }
        } else {
          console.error(
            "Failed to fetch course learning data, using local fallback"
          );
          // Fallback local data so the learning page works without backend
          const fallback = {
            course: {
              id: parseInt(courseId),
            },
            modules: [
              {
                id: "module-1",
                title: "Module 1",
                lessons: [
                  {
                    id: 1,
                    title: "Introduction to Reactjs",
                    type: "video",
                    duration: "0:10",
                    videoUrl: "/vdo1.mp4",
                    content: {
                      introduction:
                        "Reactjs is a high-level, object-oriented programming language that was originally developed by Sun Microsystems in 1995 and is now owned by Oracle Corporation. It is designed to be platform-independent, meaning that Reactjs code can run on any device that has a Reactjs Virtual Machine (JVM), making it highly versatile for developing cross-platform applications. Reactjs emphasizes object-oriented principles, such as encapsulation, inheritance and polymorphism, which allow developers to create modular, reusable and maintainable code. It has a strong memory management system, including automatic garbage collection, which reduces the likelihood of memory leaks.",
                      keyConcepts: [],
                    },
                  },
                  {
                    id: 2,
                    title: "Reactjs: Advanced Concepts",
                    type: "video",
                    duration: "0:12",
                    videoUrl: "/vdo2.mp4",
                    content: {
                      introduction:
                        "Continuation video for Reactjs advanced concepts.",
                      keyConcepts: [],
                    },
                  },
                ],
              },
            ],
            currentLesson: {
              id: 1,
            },
          };

          // If we have user progress, try to set the exact lesson from fallback
          const userProgress = user?.purchasedCourses?.find(
            (course) => course.courseId === parseInt(courseId)
          )?.progress;
          if (userProgress && userProgress.currentLesson) {
            const lesson = fallback.modules
              .flatMap((m) => m.lessons)
              .find((l) => l.id === userProgress.currentLesson.lessonId);
            if (lesson) {
              setLearningData({ ...fallback, currentLesson: lesson });
            } else {
              setLearningData(fallback);
            }
          } else {
            setLearningData(fallback);
          }
        }
      } catch (error) {
        console.error(
          "Error fetching learning data, using local fallback:",
          error
        );
        const fallback = {
          course: {
            id: parseInt(courseId),
            title: "Local Demo Course",
          },
          modules: [
            {
              id: "module-1",
              title: "Module 1",
              lessons: [
                {
                  id: 1,
                  title: "Introduction to Reactjs",
                  type: "video",
                  duration: "0:10",
                  videoUrl: "/vdo1.mp4",
                  content: {
                    introduction:
                      "Reactjs is a high-level, object-oriented programming language that was originally developed by Sun Microsystems in 1995 and is now owned by Oracle Corporation. It is designed to be platform-independent, meaning that Reactjs code can run on any device that has a Reactjs Virtual Machine (JVM), making it highly versatile for developing cross-platform applications. Reactjs emphasizes object-oriented principles, such as encapsulation, inheritance and polymorphism, which allow developers to create modular, reusable and maintainable code. It has a strong memory management system, including automatic garbage collection, which reduces the likelihood of memory leaks.",
                    keyConcepts: [],
                  },
                },
                {
                  id: 2,
                  title: "Reactjs: Advanced Concepts",
                  type: "video",
                  duration: "0:12",
                  videoUrl: "/vdo2.mp4",
                  content: {
                    introduction:
                      "Continuation video for Reactjs advanced concepts.",
                    keyConcepts: [],
                  },
                },
              ],
            },
          ],
          currentLesson: {
            id: 1,
          },
        };

        // If we have user progress, try to set the exact lesson from fallback
        const userProgress = user?.purchasedCourses?.find(
          (course) => course.courseId === parseInt(courseId)
        )?.progress;
        if (userProgress && userProgress.currentLesson) {
          const lesson = fallback.modules
            .flatMap((m) => m.lessons)
            .find((l) => l.id === userProgress.currentLesson.lessonId);
          if (lesson) {
            setLearningData({ ...fallback, currentLesson: lesson });
          } else {
            setLearningData(fallback);
          }
        } else {
          setLearningData(fallback);
        }
      }
    };
    fetchLearningData();
  }, [courseId, user, navigate]);

  // Load and parse VTT captions (simple parser) when selectedCelebrity changes
  useEffect(() => {
    const loadCaptions = async () => {
      try {
        const vttPath =
          (selectedCelebrity &&
            celebrityVideoMap[selectedCelebrity] &&
            celebrityVideoMap[selectedCelebrity].vtt) ||
          "/vdo_subtitles.vtt";
        const res = await fetch(vttPath);
        if (!res.ok) {
          setCaptions([]);
          return;
        }
        const text = await res.text();
        const blocks = text.replace(/\r\n/g, "\n").split(/\n\n+/).slice(1); // skip WEBVTT header
        const cues = blocks
          .map((block) => {
            const lines = block
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean);
            if (lines.length < 2) return null;
            const timeLine = lines[0];
            const textLines = lines.slice(1).join(" ");
            const match = timeLine.match(
              /(\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}\.\d{3})/
            );
            if (!match) return null;
            const toSeconds = (s) => {
              const [hh, mm, rest] = s.split(":");
              const [ss, ms] = rest.split(".");
              return (
                parseInt(hh) * 3600 +
                parseInt(mm) * 60 +
                parseInt(ss) +
                parseFloat("0." + ms)
              );
            };
            return {
              start: toSeconds(match[1]),
              end: toSeconds(match[2]),
              text: textLines,
            };
          })
          .filter(Boolean);
        setCaptions(cues);
      } catch (err) {
        console.warn("Could not load captions:", err);
        setCaptions([]);
      }
    };

    loadCaptions();
  }, [selectedCelebrity]);

  // Ensure when currentLesson changes we load its video into the player
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !learningData?.currentLesson) return;

    const loadVideo = async () => {
      if (selectedCelebrity) {
        setIsAIVideoLoading(true);
        try {
          const payload = {
            celebrity: selectedCelebrity.split(" ")[0].toLowerCase(),
            course: learningData?.course?.title || learningData?.modules?.[0]?.title || "React JS",
            topic: learningData.currentLesson.title || learningData?.modules?.[0]?.lessons?.[0]?.title || "Welcome to the lesson"
          };
          const data = await getAIVideo(payload);
          console.log("🎬 Received AI Video data:", data);
          if (data && data.videoUrl) {
            setAiVideoUrl(data.videoUrl);
            if (data.textContent) {
              console.log("📝 Setting generated text content:", data.textContent.substring(0, 100));
              setGeneratedTextContent(data.textContent);
            } else {
              console.log("⚠️ No textContent in response");
            }
            v.pause();
            v.src = data.videoUrl;
            v.load();
            const p = v.play();
            if (p && typeof p.then === "function") {
              p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            } else {
              setIsPlaying(true);
            }
          }
        } catch (error) {
          console.error("Error generating AI video on lesson change:", error);
          const src =
            celebrityVideoMap[selectedCelebrity]?.video ||
            learningData.currentLesson.videoUrl;
          if (src) {
            v.pause();
            v.src = src;
            v.load();
            const p = v.play();
            if (p && typeof p.then === "function") {
              p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            } else {
              setIsPlaying(true);
            }
          }
        } finally {
          setIsAIVideoLoading(false);
        }
      } else {
        setIsAIVideoLoading(false);
        setGeneratedTextContent(""); // Clear generated text when no celebrity is selected
        const src = learningData.currentLesson.videoUrl;
        if (src) {
          v.pause();
          v.src = src;
          v.load();
          setIsPlaying(false); // Lessons don't autoplay by default unless celebrity is selected
        }
      }
    };

    loadVideo();
  }, [learningData?.currentLesson, selectedCelebrity]);

  // If selectedCelebrity is Salman Khan and the user wants the Reactjs paragraph
  // shown word-by-word, create per-word cues when video metadata (duration) is available.
  // useEffect(() => {
  //   const v = videoRef.current;
  //   if (!v) return;

  //   const createWordCues = () => {
  //     if (selectedCelebrity !== "Salman Khan") return;
  //     const words = Reactjs_PARAGRAPH.split(/\s+/).filter(Boolean);
  //     if (
  //       !words.length ||
  //       !v.duration ||
  //       !isFinite(v.duration) ||
  //       v.duration <= 0
  //     )
  //       return;
  //     const per = v.duration / words.length;
  //     const cues = words.map((w, i) => ({
  //       start: i * per,
  //       end: (i + 1) * per,
  //       text: w,
  //     }));
  //     setCaptions(cues);
  //   };

  //   // If metadata already loaded, create cues immediately
  //   if (v.duration && isFinite(v.duration) && v.duration > 0) {
  //     createWordCues();
  //   }

  //   v.addEventListener("loadedmetadata", createWordCues);
  //   return () => v.removeEventListener("loadedmetadata", createWordCues);
  // }, [selectedCelebrity, videoRef.current]);

  const { modules, currentLesson } = learningData || {};

  if (!learningData) {
    return <div>Loading...</div>;
  }

  // Flatten modules into a single lessons list and compute current index
  const allLessons = (modules || []).flatMap((module) => module.lessons || []);
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === currentLesson?.id
  );

  const completeLesson = async (lessonId) => {
    // Check if lesson is already completed
    const courseProgress = user?.purchasedCourses?.find(
      (course) => course.courseId === parseInt(courseId)
    )?.progress;
    const isAlreadyCompleted = courseProgress?.completedLessons?.some(
      (cl) => cl.lessonId === lessonId
    );

    if (isAlreadyCompleted) {
      console.log("Lesson already completed, skipping");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await fetch("/api/users/course-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: parseInt(courseId),
          completedLesson: { lessonId },
        }),
      });
    } catch (error) {
      console.error("Error marking lesson completed:", error);
    }

    // Also update current lesson pointer
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/users/course-progress", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: parseInt(courseId),
          currentLesson: {
            lessonId,
            moduleTitle: expandedModule,
          },
        }),
      });
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  const toggleModule = (id) => {
    setExpandedModule((prev) => (prev === id ? null : id));
  };

  const handleLessonClick = (lesson) => {
    // update current lesson locally and let useEffect handle video loading
    setLearningData((prev) => ({ ...prev, currentLesson: lesson }));
  };

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      handleLessonClick(prevLesson);
    }
  };

  const handleNext = async () => {
    if (currentLessonIndex >= allLessons.length - 1) return;
    setIsNavigating(true);
    // mark current as completed
    if (currentLesson?.id) await completeLesson(currentLesson.id);
    const nextLesson = allLessons[currentLessonIndex + 1];
    handleLessonClick(nextLesson);
    setIsNavigating(false);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const p = videoRef.current.play();
        if (p && typeof p.then === "function") {
          p.then(() => setIsPlaying(true)).catch((err) => {
            console.warn("Play was blocked:", err);
            setIsPlaying(false);
          });
        } else {
          setIsPlaying(true);
        }
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      const currentTime = videoRef.current.currentTime;
      setDuration(duration);
      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100);
      // update visible caption overlay
      if (captions.length > 0) {
        const cue = captions.find(
          (c) => currentTime >= c.start && currentTime <= c.end
        );
        setActiveCaption(cue ? cue.text : "");
      }
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage * 100);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 mt-16">
        {/* Sidebar - Left */}
        <aside className="w-80 pt-7.25 bg-white border-r border-gray-200 overflow-y-auto hidden lg:block">
          <div className="p-6">
            <button
              onClick={() => navigate("/courses")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Courses</span>
            </button>

            <h1 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
              {learningData?.course?.title || learningData?.title || "Course"}
            </h1>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  Celebrities
                </h3>
                <div className="relative mb-4">
                  <input
                    type="search"
                    placeholder="Search celebrities..."
                    value={celebritySearch}
                    onChange={(e) => setCelebritySearch(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  {celebrities
                    .filter((c) =>
                      c.toLowerCase().includes(celebritySearch.trim().toLowerCase())
                    )
                    .map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          if (selectedCelebrity === c) {
                            setSelectedCelebrity(null);
                            setAiVideoUrl(null);
                          } else {
                            setSelectedCelebrity(c);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 ${
                          selectedCelebrity === c
                            ? "bg-blue-600 border-blue-600 text-white shadow-md"
                            : "bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:bg-blue-50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-350 mx-auto p-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Center: Video Player */}
              <div className="pt-3 xl:col-span-2 space-y-6">
                <div
                  ref={playerContainerRef}
                  className="relative bg-black rounded-xl overflow-hidden shadow-2xl group ring-1 ring-gray-200"
                  style={{ aspectRatio: "16/9" }}
                >
                  {isAIVideoLoading && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-white text-sm font-medium">Generating AI Video...</p>
                    </div>
                  )}
                  {currentLesson?.youtubeUrl ? (
                    <iframe
                      key={currentLesson.id}
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                        currentLesson.youtubeUrl
                      )}?autoplay=0&rel=0`}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLesson.title}
                    ></iframe>
                  ) : (
                    <video
                      ref={videoRef}
                      src={
                        aiVideoUrl ||
                        (selectedCelebrity &&
                          celebrityVideoMap[selectedCelebrity] &&
                          celebrityVideoMap[selectedCelebrity].video) ||
                        currentLesson?.videoUrl
                      }
                      className="w-full h-full object-contain"
                      onTimeUpdate={handleProgress}
                      onLoadedMetadata={handleProgress}
                      onEnded={() => setIsPlaying(false)}
                      playsInline
                      preload="metadata"
                    />
                  )}

                  {/* Caption overlay */}
                  {activeCaption && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-12 px-6 py-3 bg-black/80 text-white rounded-lg max-w-[80%] text-center backdrop-blur-sm">
                      <p className="text-lg font-medium leading-relaxed">{activeCaption}</p>
                    </div>
                  )}
                </div>

                {/* Module List Accordion - Moved below video */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {modules?.map((module, mIdx) => (
                    <div key={module.id} className="border-b border-gray-100 last:border-0">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-bold text-gray-800">
                          Module {mIdx + 1}: {module.title}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                            expandedModule === module.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expandedModule === module.id && (
                        <div className="bg-gray-50/50 p-2 space-y-1">
                          {module.lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => handleLessonClick(lesson)}
                              className={`w-full flex items-center gap-4 p-4 rounded-lg text-left transition-all ${
                                currentLesson?.id === lesson.id
                                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                                  : "hover:bg-white text-gray-600"
                              }`}
                            >
                              <div className="shrink-0">
                                {lesson.type === "video" ? (
                                  <Play className={`w-4 h-4 ${currentLesson?.id === lesson.id ? "text-blue-600" : "text-gray-400"}`} />
                                ) : (
                                  <FileText className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`text-sm font-semibold ${currentLesson?.id === lesson.id ? "text-blue-900" : "text-gray-800"}`}>
                                  {lesson.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{lesson.duration}</p>
                              </div>
                              <div className="shrink-0">
                                {user?.purchasedCourses
                                  ?.find((c) => c.courseId === parseInt(courseId))
                                  ?.progress?.completedLessons?.some((cl) => cl.lessonId === lesson.id) ? (
                                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-green-600" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Info Panel and Controls */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {currentLesson?.title || "Selecting Lesson..."}
                    </h2>
                    <div className="text-gray-600 text-sm leading-relaxed max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      <p className="whitespace-pre-wrap">
                        {(() => {
                          const displayText = generatedTextContent || 
                                            currentLesson?.content?.introduction || 
                                            "Learn the fundamentals and advanced concepts of this topic in this comprehensive lesson.";
                          console.log("🖥️ Displaying text:", displayText.substring(0, 100));
                          console.log("🖥️ generatedTextContent:", generatedTextContent?.substring(0, 50));
                          return displayText;
                        })()}
                      </p>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="flex items-center justify-center w-12 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      
                      <div className="flex-1 bg-gray-100 h-1.5 rounded-full relative group cursor-pointer" onClick={handleSeek}>
                        <div 
                          className="absolute h-full bg-red-500 rounded-full transition-all duration-100"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
                        </div>
                      </div>

                      <button onClick={toggleFullscreen} className="p-2 text-gray-500 hover:text-gray-800 transition-colors bg-gray-50 rounded-lg">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                      <button onClick={toggleMute} className="text-gray-500 hover:text-gray-800">
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button
                      onClick={handlePrevious}
                      disabled={currentLessonIndex <= 0}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentLessonIndex >= allLessons.length - 1 || isNavigating}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                      {isNavigating ? "Loading..." : "Next"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
