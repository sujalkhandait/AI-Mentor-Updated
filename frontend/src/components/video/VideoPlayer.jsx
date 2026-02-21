import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Subtitles } from "lucide-react";

const VideoPlayer = ({
  currentLesson,
  aiVideoUrl,
  selectedCelebrity,
  celebrityVideoMap,
  activeCaption,
  playerContainerRef,
  videoRef,
  handleProgress,
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
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = React.useRef(null);

  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Reset timer whenever play state changes
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    } else {
      resetControlsTimeout();
    }
  }, [isPlaying]);

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

  return (
    <div
      ref={playerContainerRef}
      className="relative bg-black rounded-lg overflow-hidden shadow-lg mb-6 aspect-video"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video */}
      <video
        ref={videoRef}
        src={
          aiVideoUrl ||
          (selectedCelebrity && celebrityVideoMap[selectedCelebrity]?.video) ||
          currentLesson?.videoUrl
        }
        className="w-full h-full object-contain"
        onTimeUpdate={handleProgress}
        onLoadedMetadata={handleProgress}
        controls={false}
        playsInline
        onClick={togglePlay}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-2 text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Caption Overlay */}
      {activeCaption && showCaptions && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center px-4">
          <div className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg text-center max-w-3xl text-sm leading-snug shadow-xl">
            {activeCaption}
          </div>
        </div>
      )}

      {/* Custom Video Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Progress Bar */}
          <div
            className="w-full bg-gray-600 rounded-full h-1.5 cursor-pointer mb-3 hover:h-2 transition-all"
            onClick={handleSeek}
          >
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="hover:text-blue-400 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="hover:text-blue-400 transition-colors"
                >
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
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCaptions(prev => !prev)}
                className={`transition-colors ${showCaptions ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                title={showCaptions ? 'Hide captions' : 'Show captions'}
              >
                <Subtitles className="w-6 h-6" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="hover:text-blue-400 transition-colors"
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
    </div>
  );
};

export default VideoPlayer;