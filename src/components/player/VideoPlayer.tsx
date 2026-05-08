import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { StreamType } from '../../types';
import { AlertCircle, Maximize, Play, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  type: StreamType;
  source: string;
  autoplay?: boolean;
}

export default function VideoPlayer({ type, source, autoplay = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  if (error) {
    return (
      <div className="aspect-video bg-zinc-900 flex flex-col items-center justify-center border border-white/5 rounded-2xl p-8 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-white/60 font-medium italic">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {isLoading && (
        <div className="absolute inset-0 z-10 bg-black flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-4 border-neon-lime border-t-transparent rounded-full animate-spin mb-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Buffering Stream</span>
        </div>
      )}

      {type === StreamType.M3U8 && (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          playsInline
        />
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

      {/* Decorative Overlays */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-white/50 flex items-center">
          <span className="w-2 h-2 bg-neon-lime rounded-full mr-2 shadow-[0_0_8px_var(--color-neon-lime)]" />
          Live HD
        </div>
      </div>
    </div>
  );
}
