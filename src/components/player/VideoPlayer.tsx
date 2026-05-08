import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { StreamType } from '../../types';
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
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-neon-lime border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Buffering Stream</span>
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
                  <button onClick={togglePiP} className="p-2 bg-white/5 hover:bg-white/20 rounded-full transition-colors text-white">
                    <Monitor size={16} />
                  </button>
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
