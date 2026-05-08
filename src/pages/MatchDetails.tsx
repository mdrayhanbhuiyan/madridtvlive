import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { MatchStatus, Sport } from '../types';
import { Trophy, Clock, Users, MessageSquare, BarChart3, ChevronLeft, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const { matches, loading } = useData();
  const [activeTab, setActiveTab] = useState<'stats' | 'lineups' | 'commentary'>('commentary');
  const match = matches.find(m => m.id === id);

  if (loading) return <div className="flex-grow flex items-center justify-center bg-black"><div className="w-12 h-12 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin" /></div>;
  if (!match) return <div className="flex-grow flex flex-col items-center justify-center bg-black text-white/40 p-20 capitalize">Match not found<Link to="/" className="mt-4 text-[#CCFF00] hover:underline">Return Home</Link></div>;

  const isLive = match.status === MatchStatus.LIVE;

  // Mock Stats - In a real app, these would come from Firestore/API
  const stats = {
    possession: { a: 45, b: 55 },
    shots: { a: 12, b: 15 },
    shotsOnTarget: { a: 5, b: 8 },
    fouls: { a: 10, b: 7 },
    corners: { a: 4, b: 6 }
  };

  const commentary = [
    { time: "88'", event: "Yellow Card", text: "Heavy tackle in the midfield. Free kick awarded to Real Madrid.", player: "Vini Jr" },
    { time: "75'", event: "Goal!", text: "Incredible strike from outside the box! Top corner finish.", player: "Jude Bellingham" },
    { time: "60'", event: "Substitution", text: "Changing tactics. Striker off, Midfielder on.", player: "Rodrygo Out" },
    { time: "45+2'", event: "Half Time", text: "The referee blows the whistle for the break. Intense first half.", player: "" }
  ];

  return (
    <div className="flex-grow bg-black text-white pb-20">
      {/* Hero Header */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-[#CCFF00] transition-colors mb-8 uppercase font-black text-[10px] tracking-widest">
            <ChevronLeft size={14} /> Back to Live
          </Link>

          <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
             <div className="flex flex-col items-center gap-4 flex-1">
                <div className="w-24 h-24 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-5xl font-black italic text-[#CCFF00]">{match.teamA[0]}</div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">{match.teamA}</h1>
             </div>

             <div className="flex flex-col items-center gap-4 text-center">
                <div className="bg-red-600 px-3 py-1 rounded-sm text-[10px] font-black uppercase animate-pulse mb-2">Live Now</div>
                <div className="flex items-center gap-6 md:gap-12">
                   <span className="text-6xl md:text-8xl font-black text-[#CCFF00] tracking-tighter shadow-lime">{match.scoreA ?? '0'}</span>
                   <span className="text-4xl md:text-6xl font-black text-white/20 italic mt-8">:</span>
                   <span className="text-6xl md:text-8xl font-black text-[#CCFF00] tracking-tighter shadow-lime">{match.scoreB ?? '0'}</span>
                </div>
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{match.tournament}</div>
             </div>

             <div className="flex flex-col items-center gap-4 flex-1">
                <div className="w-24 h-24 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-5xl font-black italic text-neon-blue">{match.teamB[0]}</div>
                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic">{match.teamB}</h1>
             </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
         <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 border-r border-white/10 p-4 space-y-2">
               {[
                 { id: 'commentary', label: 'Commentary', icon: MessageSquare, color: 'text-[#CCFF00]' },
                 { id: 'stats', label: 'Match Stats', icon: BarChart3, color: 'text-neon-blue' },
                 { id: 'lineups', label: 'Lineups', icon: Users, color: 'text-neon-pink' }
               ].map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id as any)}
                   className={cn(
                     "w-full flex items-center gap-3 p-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                     activeTab === tab.id ? "bg-white/5 text-white" : "text-white/30 hover:bg-white/5 hover:text-white"
                   )}
                 >
                   <tab.icon size={18} className={activeTab === tab.id ? tab.color : 'text-white/20'} />
                   {tab.label}
                 </button>
               ))}
            </div>

            {/* Content Area */}
            <div className="flex-grow p-8 min-h-[600px]">
               <AnimatePresence mode="wait">
                  {activeTab === 'commentary' && (
                    <motion.div
                      key="commentary"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <h3 className="text-sm font-black uppercase tracking-widest text-[#CCFF00] mb-8">Live Updates</h3>
                      <div className="space-y-8">
                        {commentary.map((item, idx) => (
                          <div key={idx} className="flex gap-6 items-start relative group">
                            {idx !== commentary.length - 1 && <div className="absolute left-3 top-8 bottom-[-32px] w-[1px] bg-white/10 group-hover:bg-[#CCFF00]/40 transition-colors" />}
                            <div className="w-6 text-[10px] font-black text-[#CCFF00] pt-1">{item.time}</div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-grow hover:border-white/20 transition-all">
                               <div className="flex justify-between items-center mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{item.event}</span>
                                  <span className="text-[10px] font-bold text-[#CCFF00] italic">{item.player}</span>
                               </div>
                               <p className="text-sm text-white/80 leading-relaxed font-medium">{item.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'stats' && (
                    <motion.div
                      key="stats"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-10"
                    >
                      <h3 className="text-sm font-black uppercase tracking-widest text-neon-blue mb-8">Match Performance</h3>
                      
                      {/* Stat Bars */}
                      {[
                        { label: 'Possession', valA: stats.possession.a, valB: stats.possession.b, suffix: '%' },
                        { label: 'Total Shots', valA: stats.shots.a, valB: stats.shots.b },
                        { label: 'Shots on Target', valA: stats.shotsOnTarget.a, valB: stats.shotsOnTarget.b },
                        { label: 'Corners', valA: stats.corners.a, valB: stats.corners.b },
                        { label: 'Fouls', valA: stats.fouls.a, valB: stats.fouls.b }
                      ].map(stat => (
                        <div key={stat.label} className="space-y-3">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                              <span>{match.teamA}</span>
                              <span className="text-white text-xs">{stat.label}</span>
                              <span>{match.teamB}</span>
                           </div>
                           <div className="h-1.5 flex gap-1 rounded-full overflow-hidden">
                              <div className="h-full bg-[#CCFF00]" style={{ width: `${(stat.valA / (stat.valA + stat.valB)) * 100}%` }} />
                              <div className="h-full bg-neon-blue" style={{ width: `${(stat.valB / (stat.valA + stat.valB)) * 100}%` }} />
                           </div>
                           <div className="flex justify-between items-center font-black italic text-lg">
                              <span>{stat.valA}{stat.suffix}</span>
                              <span>{stat.valB}{stat.suffix}</span>
                           </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'lineups' && (
                    <motion.div
                      key="lineups"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-12"
                    >
                      {[
                        { team: match.teamA, players: ['Courtois', 'Carvajal', 'Militao', 'Rudiger', 'Mendy', 'Camavinga', 'Modric', 'Vini Jr', 'Bellingham', 'Rodrygo', 'Mbappe'] },
                        { team: match.teamB, players: ['Ter Stegen', 'Kounde', 'Araujo', 'Christensen', 'Balde', 'De Jong', 'Gavi', 'Pedri', 'Yamal', 'Lewandowski', 'Ferran'] }
                      ].map((t, idx) => (
                        <div key={t.team} className="space-y-6">
                           <h4 className={`text-xs font-black uppercase underline underline-offset-4 ${idx === 0 ? 'text-[#CCFF00]' : 'text-neon-blue'}`}>{t.team} Starting XI</h4>
                           <div className="space-y-3">
                              {t.players.map((p, pIdx) => (
                                <div key={p} className="flex items-center gap-4 p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                                   <span className="text-[10px] font-mono text-white/30">{pIdx + 1}</span>
                                   <span className="text-sm font-bold uppercase tracking-tight">{p}</span>
                                   <span className="ml-auto text-[9px] font-black uppercase text-white/20">Active</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </div>
    </div>
  );
}
