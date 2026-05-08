import { useEffect, useState } from 'react';
import { getFootballLiveScores, getCricketLiveScores, getNBALiveScores, getTennisLiveScores, FootballScore, CricketScore } from '../services/api';
import WidgetArea from '../components/widgets/WidgetArea';
import { Trophy, Activity, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function LiveScore() {
  const [football, setFootball] = useState<FootballScore[]>([]);
  const [cricket, setCricket] = useState<CricketScore[]>([]);
  const [nba, setNba] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [f, c, n] = await Promise.all([
        getFootballLiveScores(),
        getCricketLiveScores(),
        getNBALiveScores()
      ]);
      setFootball(f);
      setCricket(c);
      setNba(n);
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="flex-grow flex items-center justify-center"><div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-grow space-y-16">
          <header className="flex flex-col space-y-2">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter glow-lime">Live Scoreboard</h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Real-time updates from across the globe</p>
          </header>

          <section>
            <div className="flex items-center space-x-3 mb-8 border-b border-white/5 pb-4">
              <Trophy className="text-neon-lime" size={24} />
              <h2 className="text-xl font-black uppercase tracking-tight">Football</h2>
            </div>
            <div className="space-y-4">
              {football.map((f) => (
                <motion.div 
                  key={f.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-6 flex-grow">
                    <div className="text-center w-24">
                      <span className="block text-lg font-black uppercase tracking-tighter truncate">{f.home}</span>
                    </div>
                    <div className="bg-black/40 px-6 py-2 rounded-xl flex items-center space-x-4 border border-white/5">
                      <span className="text-3xl font-black text-neon-lime">{f.homeScore}</span>
                      <span className="text-white/20 font-black">-</span>
                      <span className="text-3xl font-black text-neon-lime">{f.awayScore}</span>
                    </div>
                    <div className="text-center w-24">
                      <span className="block text-lg font-black uppercase tracking-tighter truncate">{f.away}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6 justify-between md:justify-end shrink-0 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-8">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/30 truncate">{f.league}</span>
                      <span className="text-sm font-mono text-neon-blue">{f.time}</span>
                    </div>
                    {f.time !== 'FT' && <Activity className="text-red-600 animate-pulse" size={16} />}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-8 border-b border-white/5 pb-4">
              <Target className="text-white" size={24} />
              <h2 className="text-xl font-black uppercase tracking-tight">Cricket</h2>
            </div>
            <div className="space-y-4">
              {cricket.map((c) => (
                <div key={c.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center space-x-2">
                       <span className="text-xl font-black uppercase italic tracking-tighter mr-4">{c.teamA} <span className="text-white/20 not-italic">vs</span> {c.teamB}</span>
                       <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${c.status === 'Live' ? 'bg-red-600' : 'bg-white/10 text-white/40'}`}>
                         {c.status}
                       </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{c.venue}</span>
                  </div>
                  <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-neon-lime tracking-tighter">
                    {c.scores}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center space-x-3 mb-8 border-b border-white/5 pb-4">
              <Zap className="text-neon-pink" size={24} />
              <h2 className="text-xl font-black uppercase tracking-tight">NBA Basketball</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nba.map((n) => (
                <div key={n.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors flex justify-between items-center">
                  <div className="space-y-4 flex-grow">
                    <div className="flex justify-between items-center pr-8">
                       <span className="font-black uppercase tracking-tighter">{n.home}</span>
                       <span className="text-2xl font-black text-white/90">{n.homeScore}</span>
                    </div>
                    <div className="flex justify-between items-center pr-8 border-t border-white/5 pt-4">
                       <span className="font-black uppercase tracking-tighter">{n.away}</span>
                       <span className="text-2xl font-black text-white/90">{n.awayScore}</span>
                    </div>
                  </div>
                  <div className="pl-6 border-l border-white/5 text-center shrink-0">
                    <span className="block text-neon-pink font-black italic">{n.quarter}</span>
                    <span className="text-[10px] font-mono text-white/30">{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="w-full lg:w-80 shrink-0 space-y-12">
          <WidgetArea placement="LiveScore" />
          <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6">Upcoming Events</h4>
             <p className="text-sm text-white/40 italic">Coming soon: Champions League Final 2026</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
