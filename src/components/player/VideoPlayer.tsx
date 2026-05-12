import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { StreamType } from '../../types';
import { cn } from '../../lib/utils';
import { AlertCircle, Maximize, Play, Volume2, Pause, Settings, Monitor, VolumeX, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoPlayerProps {
  type: StreamType;
  source: string;
  autoplay?: boolean;
}

export default function VideoPlayer({ type, source, autoplay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsPiPSupported(
      document.pictureInPictureEnabled && 
      !videoRef.current?.disablePictureInPicture
    );

    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => setIsPiPActive(true);
    const handleLeavePiP = () => setIsPiPActive(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);

    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('canplay', handlePlaying);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('canplay', handlePlaying);
    };
  }, []);

  useEffect(() => {
    setError(null);
    setIsLoading(true);

    if (type === StreamType.M3U8 && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(source);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          if (autoplay) videoRef.current?.play().catch(console.error);
        });
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setError('Stream could not be loaded. Please try again later.');
            setIsLoading(false);
          }
        });
        return () => hls.destroy();
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = source;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          if (autoplay) videoRef.current?.play().catch(console.error);
        });
      } else {
        setError('Your browser does not support HLS streaming.');
      }
    } else {
      setIsLoading(false);
    }
  }, [type, source, autoplay]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
      setIsMuted(value === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      videoRef.current.muted = newMuted;
      if (!newMuted && volume === 0) {
        setVolume(0.5);
        videoRef.current.volume = 0.5;
      }
    }
  };

  const changeSpeed = () => {
    const speeds = [0.5, 1, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackSpeed(nextSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const togglePiP = async () => {
    try {
      if (videoRef.current !== document.pictureInPictureElement) {
        await videoRef.current?.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (err) {
      console.error('PiP failed', err);
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  if (error) {
    return (
      <div className="aspect-video bg-zinc-900 flex flex-col items-center justify-center border border-white/5 rounded-2xl p-8 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-white/60 font-medium italic">{error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl group"
    >
      {(isLoading || isBuffering) && (
        <div className={cn(
          "absolute inset-0 z-10 flex flex-col items-center justify-center transition-colors duration-300",
          isLoading ? "bg-black" : "bg-black/40 backdrop-blur-[2px]"
        )}>
          <div className="relative">
            <div className="w-12 h-12 border-4 border-white/10 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 animate-pulse">
            {isLoading ? "Loading HD Stream" : "Buffering..."}
          </span>
        </div>
      )}

      {type === StreamType.M3U8 && (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={togglePlay}
          />

          {/* Custom Controls UI */}
          <AnimatePresence>
            {showControls && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 flex flex-col justify-between p-6 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none"
              >
                <div className="flex justify-between items-start pointer-events-auto">
                   <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center">
                    <span className="w-2 h-2 bg-neon-lime rounded-full mr-2 shadow-[0_0_8px_rgba(204,255,0,0.5)] animate-pulse" />
                    Live HD
                  </div>
                  {isPiPSupported && (
                    <button 
                      onClick={togglePiP} 
                      className={cn(
                        "p-2 rounded-full transition-all duration-300",
                        isPiPActive 
                          ? "bg-neon-lime text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]" 
                          : "bg-white/5 hover:bg-white/20 text-white"
                      )}
                      title={isPiPActive ? "Exit Picture-in-Picture" : "Enable Picture-in-Picture"}
                    >
                      <Monitor size={16} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 pointer-events-auto">
                  <div className="flex items-center gap-4">
                    <button onClick={togglePlay} className="p-3 bg-neon-lime text-black rounded-full hover:scale-110 transition-transform">
                      {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                    
                    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full group/volume">
                       <button onClick={toggleMute} className="text-white/60 hover:text-white transition-colors">
                         {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                       </button>
                       <input 
                         type="range" 
                         min="0" 
                         max="1" 
                         step="0.05" 
                         value={isMuted ? 0 : volume}
                         onChange={handleVolumeChange}
                         className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-neon-lime"
                       />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={changeSpeed}
                      className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-black text-white hover:border-neon-lime transition-colors"
                    >
                      {playbackSpeed}x
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 bg-white/5 hover:bg-white/20 rounded-full transition-colors text-white">
                      <Maximize size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {type === StreamType.YOUTUBE && (
        <iframe
          src={`https://www.youtube.com/embed/${source}${autoplay ? '?autoplay=1' : ''}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}

      {type === StreamType.IFRAME && (
        <div 
          className="w-full h-full"
          dangerouslySetInnerHTML={{ __html: source }}
        />
      )}
    </div>
  );
}
