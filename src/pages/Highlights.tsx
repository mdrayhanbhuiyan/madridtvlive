import { useData } from '../context/DataContext';
import { Play } from 'lucide-react';
import { motion } from 'motion/react';

export default function Highlights() {
  const { highlights, loading } = useData();

  if (loading) return <div className="flex-grow flex items-center justify-center"><div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter glow-lime mb-2">Match Highlights</h1>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Relive the best moments</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {highlights.length > 0 ? highlights.map((high) => (
          <motion.div
            key={high.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group cursor-pointer"
          >
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 bg-zinc-900 border border-white/5">
              <img src={high.thumbnail} alt={high.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-neon-lime flex items-center justify-center text-black shadow-[0_0_20px_var(--color-neon-lime)] transform group-hover:scale-110 transition-transform">
                  <Play size={28} fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-white/50 border border-white/10">
                  {high.category}
                </span>
                {high.duration && (
                  <span className="bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-[#CCFF00] border border-[#CCFF00]/20">
                    {high.duration}
                  </span>
                )}
              </div>
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white/80 group-hover:text-neon-lime transition-colors line-clamp-2">{high.title}</h3>
            <span className="text-[10px] font-mono text-white/20 mt-2 block">{new Date(high.createdAt).toLocaleDateString()}</span>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center text-white/20 font-black uppercase italic text-2xl tracking-tighter">
            No Highlights Available
          </div>
        )}
      </div>
    </div>
  );
}
