import { useData } from '../../context/DataContext';
import { motion } from 'motion/react';

export default function NewsTicker() {
  const { news } = useData();

  if (news.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="h-10 bg-[#CCFF00] flex items-center overflow-hidden border-y border-black/10 relative shadow-[0_0_20px_rgba(204,255,0,0.1)] z-30"
    >
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#CCFF00] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#CCFF00] to-transparent z-10" />
      
      <div className="flex whitespace-nowrap h-full items-center">
        <div className="flex animate-marquee hover:[animation-play-state:paused] gap-16 whitespace-nowrap text-black text-[11px] font-black uppercase tracking-[0.1em] items-center cursor-default">
          <div className="flex gap-16 items-center">
            {news.map((item) => (
              <span key={item.id} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full" />
                {item.title}
              </span>
            ))}
          </div>
          <div className="flex gap-16 items-center">
            {news.map((item) => (
              <span key={`${item.id}-dup`} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-black rounded-full" />
                {item.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
