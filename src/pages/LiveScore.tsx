import { useEffect, useState, useRef } from 'react';
import { getFootballLiveScores, getCricketLiveScores, getNBALiveScores, FootballScore, CricketScore } from '../services/api';
import WidgetArea from '../components/widgets/WidgetArea';
import { Trophy, Activity, Target, Zap, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ScoreUpdate {
  id: string;
  type: 'home' | 'away';
  timestamp: number;
}

export default function LiveScore() {
  const [football, setFootball] = useState<FootballScore[]>([]);
  const [cricket, setCricket] = useState<CricketScore[]>([]);
  const [nba, setNba] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [updates, setUpdates] = useState<ScoreUpdate[]>([]);
  
  const prevScores = useRef<Record<string, { home: string | number, away: string | number }>>({});

  useEffect(() => {
    const fetchData = async () => {
      const [f, c, n] = await Promise.all([
        getFootballLiveScores(),
        getCricketLiveScores(),
        getNBALiveScores()
      ]);

      // Detect score changes
      const newUpdates: ScoreUpdate[] = [];
      const now = Date.now();

      f.forEach(match => {
        const prev = prevScores.current[match.id];
        if (prev) {
          if (match.homeScore !== prev.home) newUpdates.push({ id: match.id, type: 'home', timestamp: now });
          if (match.awayScore !== prev.away) newUpdates.push({ id: match.id, type: 'away', timestamp: now });
        }
        prevScores.current[match.id] = { home: match.homeScore, away: match.awayScore };
      });

      if (newUpdates.length > 0) {
        setUpdates(prev => [...prev, ...newUpdates]);
        setTimeout(() => {
          setUpdates(prev => prev.filter(u => now - u.timestamp < 3000));
        }, 3000);
      }

      setFootball(f);
      setCricket(c);
      setNba(n);
      setLoading(false);
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Faster polling for demo
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'All', icon: Activity, color: 'text-white' },
    { id: 'Football', icon: Trophy, color: 'text-neon-lime' },
    { id: 'Cricket', icon: Target, color: 'text-white' },
    { id: 'Basketball', icon: Zap, color: 'text-neon-pink' }
  ];

  const filteredFootball = football.filter(f => 
    (selectedCategory === 'All' || selectedCategory === 'Football') && 
    (f.home.toLowerCase().includes(searchQuery.toLowerCase()) || f.away.toLowerCase().includes(searchQuery.toLowerCase()) || f.league.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCricket = cricket.filter(c => 
    (selectedCategory === 'All' || selectedCategory === 'Cricket') && 
    (c.teamA.toLowerCase().includes(searchQuery.toLowerCase()) || c.teamB.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredNBA = nba.filter(n => 
    (selectedCategory === 'All' || selectedCategory === 'Basketball') && 
    (n.home.toLowerCase().includes(searchQuery.toLowerCase()) || n.away.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const isUpdating = (id: string, type: 'home' | 'away') => {
    return updates.some(u => u.id === id && u.type === type);
  };

  if (loading) return <div className="flex-grow flex items-center justify-center"><div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex-grow flex flex-col relative">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-xl border-b border-white/5 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shrink-0",
                  selectedCategory === cat.id 
                    ? "bg-white text-black border-white" 
                    : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                )}
              >
                <cat.icon size={14} className={selectedCategory === cat.id ? 'text-black' : cat.color} />
                {cat.id}
              </button>
            ))}
          </div>

          <div className="relative group max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#CCFF00] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search teams, leagues..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:border-[#CCFF00] focus:ring-1 focus:ring-[#CCFF00] outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-12 w-full">
        <div className="flex-grow space-y-16 overflow-visible">
          <AnimatePresence mode="popLayout">
            {/* Football Section */}
            {filteredFootball.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <div className="flex items-center justify-between mb-8 border-l-4 border-neon-lime pl-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">World Football</h2>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Major Leagues & Cups</p>
                  </div>
                  <Trophy className="text-neon-lime opacity-20" size={32} />
                </div>
                
                <div className="space-y-4">
                  {filteredFootball.map((f, idx) => (
                    <motion.div 
                      key={f.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors group"
                    >
                      <div className="flex items-center space-x-6 flex-grow">
                        <div className="text-center w-28">
                          <span className="block text-sm font-black uppercase tracking-tighter truncate group-hover:text-neon-lime transition-colors">{f.home}</span>
                        </div>
                        
                        <div className="bg-black/40 px-8 py-3 rounded-2xl flex items-center space-x-6 border border-white/5 relative overflow-hidden">
                          <motion.span 
                            animate={isUpdating(f.id, 'home') ? { scale: [1, 1.5, 1], color: ['#CCFF00', '#fff', '#CCFF00'] } : {}}
                            className={cn("text-4xl font-black italic tracking-tighter", isUpdating(f.id, 'home') ? "text-white" : "text-neon-lime")}
                          >
                            {f.homeScore}
                          </motion.span>
                          <span className="text-white/10 font-black italic text-2xl">:</span>
                          <motion.span 
                            animate={isUpdating(f.id, 'away') ? { scale: [1, 1.5, 1], color: ['#CCFF00', '#fff', '#CCFF00'] } : {}}
                            className={cn("text-4xl font-black italic tracking-tighter", isUpdating(f.id, 'away') ? "text-white" : "text-neon-lime")}
                          >
                            {f.awayScore}
                          </motion.span>
                          
                          {(isUpdating(f.id, 'home') || isUpdating(f.id, 'away')) && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: [0, 0.2, 0] }}
                              className="absolute inset-0 bg-[#CCFF00] pointer-events-none"
                            />
                          )}
                        </div>

                        <div className="text-center w-28">
                          <span className="block text-sm font-black uppercase tracking-tighter truncate group-hover:text-neon-lime transition-colors">{f.away}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-8 justify-between md:justify-end shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-1">{f.league}</span>
                          <div className="flex items-center gap-2">
                             {f.time !== 'FT' && <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />}
                             <span className={cn("text-xs font-mono font-bold", f.time === 'FT' ? 'text-white/40' : 'text-neon-blue')}>{f.time}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Cricket Section */}
            {filteredCricket.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className="mt-16"
              >
                <div className="flex items-center justify-between mb-8 border-l-4 border-white pl-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">International Cricket</h2>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Live Ball-by-ball Coverage</p>
                  </div>
                  <Target className="text-white opacity-20" size={32} />
                </div>
                
                <div className="space-y-6">
                  {filteredCricket.map((c, idx) => (
                    <motion.div 
                      key={c.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-zinc-900 border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-all group overflow-hidden relative"
                    >
                      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                         <Target size={120} />
                      </div>
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center space-x-3">
                           <h3 className="text-xl font-black uppercase italic tracking-tighter">{c.teamA} <span className="text-white/20 not-italic mx-2">VS</span> {c.teamB}</h3>
                           <span className={cn(
                             "text-[9px] font-black uppercase px-2.5 py-1 rounded-lg tracking-widest",
                             c.status === 'Live' ? 'bg-red-600 text-white animate-pulse' : 'bg-white/10 text-white/40'
                           )}>
                             {c.status}
                           </span>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20 bg-white/5 px-3 py-1 rounded-full border border-white/5">{c.venue}</span>
                      </div>
                      <div className="bg-black/60 p-6 rounded-2xl border border-white/5 font-mono text-neon-lime text-xl tracking-tighter shadow-inner relative z-10">
                        {c.scores}
                        {c.status === 'Live' && (
                          <motion.span 
                            animate={{ opacity: [1, 0.4, 1] }} 
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="inline-block w-2 aspect-square bg-[#CCFF00] rounded-full ml-4"
                          />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* NBA Section */}
            {filteredNBA.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
                className="mt-16"
              >
                <div className="flex items-center justify-between mb-8 border-l-4 border-neon-pink pl-4">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">NBA Basketball</h2>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">The League Updates</p>
                  </div>
                  <Zap className="text-neon-pink opacity-20" size={32} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNBA.map((n, idx) => (
                    <motion.div 
                      key={n.id} 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-zinc-900 border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all flex justify-between items-center group shadow-lg"
                    >
                      <div className="space-y-4 flex-grow">
                        <div className="flex justify-between items-center pr-8">
                           <span className="text-sm font-black uppercase tracking-tighter text-white/60 group-hover:text-white transition-colors">{n.home}</span>
                           <motion.span 
                            animate={isUpdating(n.id, 'home') ? { scale: [1, 1.4, 1], textShadow: '0 0 10px rgba(255,0,255,0.5)' } : {}}
                            className={cn("text-3xl font-black", isUpdating(n.id, 'home') ? "text-neon-pink" : "text-white")}
                           >
                            {n.homeScore}
                           </motion.span>
                        </div>
                        <div className="flex justify-between items-center pr-8 border-t border-white/5 pt-4">
                           <span className="text-sm font-black uppercase tracking-tighter text-white/60 group-hover:text-white transition-colors">{n.away}</span>
                           <motion.span 
                            animate={isUpdating(n.id, 'away') ? { scale: [1, 1.4, 1], textShadow: '0 0 10px rgba(255,0,255,0.5)' } : {}}
                            className={cn("text-3xl font-black", isUpdating(n.id, 'away') ? "text-neon-pink" : "text-white")}
                           >
                            {n.awayScore}
                           </motion.span>
                        </div>
                      </div>
                      <div className="pl-8 border-l border-white/5 text-center shrink-0 min-w-[80px]">
                        <span className="block text-neon-pink font-black italic uppercase tracking-tighter mb-1">{n.quarter}</span>
                        <span className="text-[10px] font-mono font-bold text-white/20 uppercase">{n.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {filteredFootball.length === 0 && filteredCricket.length === 0 && filteredNBA.length === 0 && (
              <div className="py-40 text-center opacity-20">
                <Search size={64} className="mx-auto mb-4" />
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">No Live Events Found</h3>
                <p className="text-xs font-bold uppercase tracking-widest mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <aside className="w-full lg:w-80 shrink-0 space-y-12">
          <WidgetArea placement="LiveScore" />
          <div className="bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                <Activity size={80} />
             </div>
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" /> Trending Now
             </h4>
             <ul className="space-y-6">
                {[
                  { title: "UCL Quarter Finals", desc: "Draw results are in", time: "2h ago" },
                  { title: "NBA Playoffs", desc: "Seeds confirmed", time: "5h ago" },
                  { title: "IPL Auction", desc: "Top picks analysis", time: "1d ago" }
                ].map((item, i) => (
                  <li key={i} className="group cursor-pointer">
                    <p className="text-sm font-black uppercase italic tracking-tight group-hover:text-neon-lime transition-colors">{item.title}</p>
                    <p className="text-xs text-white/40 font-medium mb-1">{item.desc}</p>
                    <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">{item.time}</span>
                  </li>
                ))}
             </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
