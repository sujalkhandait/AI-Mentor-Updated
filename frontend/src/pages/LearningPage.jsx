import { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAIVideo } from "../service/aiService";
import VideoPlayer from "../components/video/VideoPlayer";

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  Circle,
  FileText,
  CloudCog,
  Play,
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

  // map celebrities to videos and vtt files
  const celebrityVideoMap = {
    "Salman Khan": { video: "http://localhost:5000/videos/salman.mp4", vtt: "http://localhost:5000/videos/salman.vtt" },
    "Modi ji": { video: "http://localhost:5000/videos/modi.mp4", vtt: "http://localhost:5000/videos/modi.vtt" },
    SRK: { video: "http://localhost:5000/videos/srk.mp4", vtt: "http://localhost:5000/videos/srk.vtt" },
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
  const transcriptContainerRef = useRef(null);
  const activeCaptionRef = useRef(null);

  // Auto-scroll transcript to keep active caption visible
  useEffect(() => {
    if (activeCaptionRef.current && transcriptContainerRef.current) {
      const container = transcriptContainerRef.current;
      const activeElement = activeCaptionRef.current;

      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const elementTop = activeElement.offsetTop - container.offsetTop;
      const elementBottom = elementTop + activeElement.clientHeight;

      // Scroll if element is not fully visible
      if (elementTop < containerTop || elementBottom > containerBottom) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime]);


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
                    title: "Introduction to React",
                    type: "video",
                    duration: "0:10",
                    youtubeUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
                    content: {
                      introduction:
                        "React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and the open-source community. React allows developers to create reusable UI components and manage the state of their applications efficiently.",
                      keyConcepts: [],
                    },
                  },
                  {
                    id: 2,
                    title: "React: Advanced Concepts",
                    type: "video",
                    duration: "0:12",
                    youtubeUrl: "https://www.youtube.com/watch?v=4UZrsTqkcW4",
                    content: {
                      introduction:
                        "Advanced React concepts including hooks, context, and performance optimization techniques.",
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
        // Use the same fallback as above
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
                  title: "Introduction to React",
                  type: "video",
                  duration: "0:10",
                  youtubeUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
                  content: {
                    introduction:
                      "React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and the open-source community. React allows developers to create reusable UI components and manage the state of their applications efficiently.",
                    keyConcepts: [],
                  },
                },
                {
                  id: 2,
                  title: "React: Advanced Concepts",
                  type: "video",
                  duration: "0:12",
                  youtubeUrl: "https://www.youtube.com/watch?v=4UZrsTqkcW4",
                  content: {
                    introduction:
                      "Advanced React concepts including hooks, context, and performance optimization techniques.",
                    keyConcepts: [],
                  },
                },
              ],
            },
          ],
          currentLesson: {
            id: 1,
            title: "Introduction to React",
            type: "video",
            duration: "0:10",
            youtubeUrl: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
            content: {
              introduction:
                "React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and the open-source community. React allows developers to create reusable UI components and manage the state of their applications efficiently.",
              keyConcepts: [],
            },
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
      console.log("🔍 Loading captions for celebrity:", selectedCelebrity);
      try {
        // Prioritize AI-generated text if available
        if (generatedTextContent && videoRef.current?.duration) {
          console.log("🤖 Generating captions from AI text");
          const sentences = generatedTextContent
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(Boolean);

          const videoDuration = videoRef.current.duration;
          const timePerSentence = videoDuration / sentences.length;

          const generatedCaptions = sentences.map((sentence, index) => ({
            start: index * timePerSentence,
            end: (index + 1) * timePerSentence,
            text: sentence,
          }));

          console.log(`✅ Generated ${generatedCaptions.length} captions from AI text`);
          setCaptions(generatedCaptions);
          return;
        }

        // Fallback to VTT file if AI text not available
        const vttPath =
          selectedCelebrity &&
          celebrityVideoMap[selectedCelebrity] &&
          celebrityVideoMap[selectedCelebrity].vtt;

        if (vttPath) {
          console.log("📄 Trying to load VTT from:", vttPath);
          const res = await fetch(vttPath);
          if (res.ok) {
            console.log("✅ VTT file loaded successfully");
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
            console.log(`✅ Parsed ${cues.length} captions from VTT`);
            setCaptions(cues);
            return;
          } else {
            console.log("⚠️ VTT file not found");
          }
        }

        console.log("❌ No captions available - no AI text and no VTT");
        setCaptions([]);
      } catch (err) {
        console.warn("❌ Could not load captions:", err);
        setCaptions([]);
      }
    };

    loadCaptions();
  }, [selectedCelebrity, generatedTextContent, videoRef.current?.duration]);

  // Ensure when currentLesson changes we load its video into the player
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !learningData?.currentLesson) return;

    const loadVideo = async () => {
      if (selectedCelebrity) {
        setIsAIVideoLoading(true);
        setGeneratedTextContent("");
        try {
          const payload = {
            celebrity: selectedCelebrity.split(" ")[0].toLowerCase(),
            course: learningData?.course?.title || learningData?.modules?.[0]?.title || "React JS",
            topic: learningData.currentLesson.title || learningData?.modules?.[0]?.lessons?.[0]?.title || "Welcome to the lesson"
          };
          const data = await getAIVideo(payload);
          if (data && data.videoUrl) {
            setAiVideoUrl(data.videoUrl);
            setGeneratedTextContent(data.textContent || "");
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
          setGeneratedTextContent("");
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
        setGeneratedTextContent("");
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

  // Generate captions when video metadata loads
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const handleMetadataLoaded = () => {
      if (generatedTextContent && v.duration && !captions.length) {
        const sentences = generatedTextContent
          .split(/[.!?]+/)
          .map(s => s.trim())
          .filter(Boolean);

        const videoDuration = v.duration;
        const timePerSentence = videoDuration / sentences.length;

        const generatedCaptions = sentences.map((sentence, index) => ({
          start: index * timePerSentence,
          end: (index + 1) * timePerSentence,
          text: sentence,
        }));

        setCaptions(generatedCaptions);
      }
    };

    v.addEventListener('loadedmetadata', handleMetadataLoaded);

    // Also try to generate immediately if metadata already loaded
    if (v.duration && generatedTextContent && !captions.length) {
      handleMetadataLoaded();
    }

    return () => {
      v.removeEventListener('loadedmetadata', handleMetadataLoaded);
    };
  }, [generatedTextContent]);


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
    <div className="min-h-screen bg-gray-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Sidebar */}
      <div className="fixed left-0 top-16 bottom-0 w-80 bg-white border-r border-gray-200 overflow-y-auto z-10">
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {learningData?.course?.title || learningData?.title || "Course"}
            </h2>
            <button
              onClick={() => navigate("/courses")}
              className="text-gray-400 hover:text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Celebrities
            </h3>
            <div className="mb-3">
              <input
                type="search"
                placeholder="Search celebrities..."
                value={celebritySearch}
                onChange={(e) => setCelebritySearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex flex-col gap-2">
              {celebrities
                .filter((c) =>
                  c.toLowerCase().includes(celebritySearch.trim().toLowerCase())
                )
                .map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      if (selectedCelebrity === c) {
                        // Toggle off if same celebrity clicked again
                        setSelectedCelebrity(null);
                        setAiVideoUrl(null);
                      } else {
                        setSelectedCelebrity(c);
                      }
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg border ${selectedCelebrity === c
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-900"
                      }`}
                  >
                    {c}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="ml-80 p-6">
        <div className="mb-6">
          {(() => {
            const completedCount =
              user?.purchasedCourses?.find(
                (course) => course.courseId === parseInt(courseId)
              )?.progress?.completedLessons?.length || 0;
            const totalCount = allLessons.length;
            const progressPercent = Math.min(
              (completedCount / totalCount) * 100,
              100
            );
            console.log("Progress calculation:", {
              completedCount,
              totalCount,
              progressPercent,
            });
            return (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round(progressPercent)}% Complete
                </p>
              </>
            );
          })()}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="xl:col-span-2 space-y-4 mt-3">
            <VideoPlayer
              currentLesson={currentLesson}
              aiVideoUrl={aiVideoUrl}
              selectedCelebrity={selectedCelebrity}
              celebrityVideoMap={celebrityVideoMap}
              activeCaption={activeCaption}
              playerContainerRef={playerContainerRef}
              videoRef={videoRef}
              handleProgress={handleProgress}
              getYouTubeVideoId={getYouTubeVideoId}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              progress={progress}
              isFullscreen={isFullscreen}
              duration={duration}
              currentTime={currentTime}
              togglePlay={togglePlay}
              handleVolumeChange={handleVolumeChange}
              toggleMute={toggleMute}
              handleSeek={handleSeek}
              toggleFullscreen={toggleFullscreen}
              formatTime={formatTime}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
              currentLessonIndex={currentLessonIndex}
              allLessonsLength={allLessons.length}
            />
          </div>

          {/* Lesson Content */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-0">
                {currentLesson?.title || "Select a Lesson"}
              </h3>
            </div>
            {/* Transcript Section */}
            {captions.length > 0 && !currentLesson?.youtubeUrl && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Transcript
                </h3>
                <div
                  ref={transcriptContainerRef}
                  className="max-h-96 overflow-y-auto space-y-2 pr-2 scroll-smooth"
                >
                  {captions.map((caption, index) => {
                    const isActive = currentTime >= caption.start && currentTime <= caption.end;
                    return (
                      <div
                        key={index}
                        ref={isActive ? activeCaptionRef : null}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${isActive
                            ? 'bg-blue-50 border-l-4 border-blue-600'
                            : 'hover:bg-gray-50'
                          }`}
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = caption.start;
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          <span className={`text-xs font-mono ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
                            }`}>
                            {formatTime(caption.start)}
                          </span>
                          <p className={`text-sm flex-1 ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700'
                            }`}>
                            {caption.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {(() => {
            const q = searchQuery.trim().toLowerCase();
            const filteredModules = (modules || [])
              .map((module) => ({
                ...module,
                lessons: module.lessons.filter((lesson) =>
                  lesson.title.toLowerCase().includes(q)
                ),
              }))
              .filter((m) => m.lessons.length > 0);

            if (q && filteredModules.length === 0) {
              return (
                <p className="text-sm text-gray-500">
                  No results for "{searchQuery}"
                </p>
              );
            }

            return (
              <div>
                {(filteredModules.length > 0 ? filteredModules : modules || []).map((module) => (
                  <div
                    key={module.id}
                    className="border border-gray-200 rounded-lg"
                  >
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">
                        {module.title}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${expandedModule === module.id ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {expandedModule === module.id && (
                      <div className="px-4 pb-4 space-y-2">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-gray-50 ${currentLesson?.id === lesson.id
                              ? "bg-blue-50 border border-blue-200"
                              : ""
                              }`}
                          >
                            {lesson.type === "video" ? (
                              <Play className="w-4 h-4 text-gray-400" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-400" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {lesson.duration}
                              </p>
                            </div>
                            {user?.purchasedCourses
                              ?.find(
                                (course) => course.courseId === parseInt(courseId)
                              )
                              ?.progress?.completedLessons?.some(
                                (cl) => cl.lessonId === lesson.id
                              ) ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Circle className="w-4 h-4 text-gray-300" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}