import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ChevronLeft, ChevronRight, Subtitles } from "lucide-react";

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
  // Control states and handlers
  isPlaying,
  volume,
  isMuted,
  progress,
  isFullscreen,
  duration,
  currentTime,
  togglePlay,
  handleVolumeChange,
  toggleMute,
  handleSeek,
  toggleFullscreen,
  formatTime,
  // Navigation
  handlePrevious,
  handleNext,
  currentLessonIndex,
  allLessonsLength
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  const [showCaptions, setShowCaptions] = useState(true);

  const handlePlayStart = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    const videoElement = videoRef?.current;
    if (videoElement) {
      videoElement.addEventListener('play', handlePlayStart);
      return () => {
        videoElement.removeEventListener('play', handlePlayStart);
      };
    }
  }, [videoRef]);

  // Auto-hide controls after 3 seconds of inactivity
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  const handleMouseMove = () => {
    resetControlsTimeout();
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  return (
    <div className="xl:col-span-2">
      <div
        ref={playerContainerRef}
        className="relative bg-black rounded-lg overflow-hidden group"
        style={{ aspectRatio: "16/9" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Video/iframe */}
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
            className="w-full h-full object-contain bg-black cursor-pointer"
            onTimeUpdate={handleProgress}
            onLoadedMetadata={handleProgress}
            controls={false}
            playsInline
            onClick={handleVideoClick}
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white mt-2 text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Center Play/Pause Button */}
        {!currentLesson?.youtubeUrl && (
          <div 
            className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <button
              onClick={togglePlay}
              className="pointer-events-auto bg-black/50 hover:bg-black/70 rounded-full p-6 transition-all transform hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-12 h-12 text-white" />
              ) : (
                <Play className="w-12 h-12 text-white ml-1" />
              )}
            </button>
          </div>
        )}

        {/* Caption Overlay */}
        {activeCaption && showCaptions && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-md text-sm max-w-4xl text-center">
            {activeCaption}
          </div>
        )}

        {/* YouTube-style Controls Overlay */}
        {!currentLesson?.youtubeUrl && (
          <div 
            className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ paddingTop: '60px', paddingBottom: '8px' }}
          >
            {/* Progress Bar */}
            <div className="px-4 pb-2">
              <div
                className="w-full h-1 bg-gray-600/50 rounded-full cursor-pointer hover:h-1.5 transition-all group/progress"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-red-600 rounded-full relative group-hover/progress:bg-red-500"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>

            {/* Controls Row */}
            <div className="px-4 pb-2 flex items-center justify-between text-white">
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                {/* Previous/Next */}
                <button
                  onClick={handlePrevious}
                  disabled={currentLessonIndex <= 0}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Previous lesson"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentLessonIndex >= allLessonsLength - 1}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Next lesson"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Volume Control */}
                <div className="flex items-center gap-2 group/volume">
                  <button onClick={toggleMute} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/volume:w-20 transition-all cursor-pointer accent-red-600"
                  />
                </div>

                {/* Time Display */}
                <span className="text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Caption Toggle */}
                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`hover:bg-white/20 p-2 rounded-full transition-colors ${
                    showCaptions ? 'bg-white/20' : ''
                  }`}
                  title={showCaptions ? 'Hide captions' : 'Show captions'}
                >
                  <Subtitles className="w-5 h-5" />
                </button>
                
                <button
                  onClick={toggleFullscreen}
                  className="hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;