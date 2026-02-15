import React, { useState, useEffect } from 'react';

const VideoPlayer = ({
  currentLesson,
  aiVideoUrl,
  selectedCelebrity,
  celebrityVideoMap,
  activeCaption,
  playerContainerRef,
  videoRef,
  handleProgress,
  getYouTubeVideoId,
  isAIVideoLoading,
}) => {


  const [isBuffering, setIsBuffering] = useState(false);

  // Handle native video loading states
  useEffect(() => {
    const v = videoRef?.current;
    if (!v) return;

    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onLoadStart = () => setIsBuffering(true);

    v.addEventListener("waiting", onWaiting);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("loadstart", onLoadStart);

    return () => {
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("loadstart", onLoadStart);
    };
  }, [videoRef]);

  // Unified loading state: either AI is being generated OR the video is buffering bytes
  const showLoading = isAIVideoLoading || isBuffering;

  return (
    <div className="xl:col-span-2">
      <div
        ref={playerContainerRef}
        className="relative bg-black rounded-lg overflow-hidden group"
        style={{ aspectRatio: "16/9" }}
      >
        {/* ===== KEEP YOUR EXISTING VIDEO / IFRAME CODE INSIDE ===== */}

        {currentLesson?.youtubeUrl ? (
          <iframe
            key={currentLesson.id}
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(
              currentLesson.youtubeUrl
            )}`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={currentLesson.title}
          />
        ) : (
          <video
            ref={videoRef}
            src={
              aiVideoUrl ||
              (selectedCelebrity &&
                celebrityVideoMap[selectedCelebrity]?.video) ||
              currentLesson?.videoUrl
            }
            className="w-full h-full object-contain bg-black"
            onTimeUpdate={handleProgress}
            onLoadedMetadata={handleProgress}
            controls={false}
            playsInline
          />
        )}

        {/* Loading Overlay (Original Style) */}
        {showLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white mt-2 text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Caption Overlay */}
        {activeCaption && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-md text-sm">
            {activeCaption}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;