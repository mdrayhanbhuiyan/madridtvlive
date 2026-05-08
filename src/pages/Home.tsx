import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useData } from '../context/DataContext';
import ChannelCard from '../components/ui/ChannelCard';
import AdArea from '../components/ads/AdArea';
import Newsletter from '../components/widgets/Newsletter';
import { Link } from 'react-router-dom';
import { MatchStatus, Sport, SliderItem } from '../types';
import { ChevronRight, Play, Award, Newspaper, Bell, BarChart3, Trophy, ChevronLeft } from 'lucide-react';
import { requestNotificationPermission } from '../lib/notifications';

// Localized Countdown Component
function LocalizedCountdown({ targetDate }: { targetDate: number }) {
  const [timeLeft, setTimeLeft] = useState<{ h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = targetDate - now;
      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ h, m, s });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">Match Starting...</span>;

  return (
    <span className="text-[9px] font-black text-white/60 font-mono tracking-tighter uppercase whitespace-nowrap">
      Starts in: {timeLeft.h.toString().padStart(2, '0')}h {timeLeft.m.toString().padStart(2, '0')}m {timeLeft.s.toString().padStart(2, '0')}s
    </span>
  );
}

export default function Home() {
  const [selectedSport, setSelectedSport] = useState<string>('RTS');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { matches, channels, news, highlights, sliders, loading } = useData();

  const activeSliders = sliders.filter(s => s.isActive);

  useEffect(() => {
    if (activeSliders.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % activeSliders.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeSliders.length]);

  const filteredMatches = selectedSport === 'RTS' 
    ? matches 
    : matches.filter(m => m.sport.toLowerCase() === selectedSport.toLowerCase());

  const filteredChannels = selectedSport === 'RTS'
    ? channels
    : channels.filter(c => c.sport.toLowerCase() === selectedSport.toLowerCase());

  const liveMatches = filteredMatches.filter((m) => m.status === MatchStatus.LIVE);
  const featuredMatch = filteredMatches.find((m) => m.isFeatured) || liveMatches[0];
  const featuredChannels = filteredChannels.filter((c) => c.status === 'Active').slice(0, 8);
  const latestNews = news.slice(0, 4);

  const handleNotifyMe = async (e: React.MouseEvent) => {
    e.preventDefault();
    const granted = await requestNotificationPermission();
    if (granted) {
      alert('Notifications enabled! You will be alerted when matches go live.');
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col p-4 gap-4 overflow-hidden">
      {/* Live Score Ticker */}
      {liveMatches.length > 0 && (
        <div className="w-full bg-[#111] border border-white/5 rounded-2xl overflow-hidden py-3 relative shrink-0">
          <div className="absolute left-0 top-0 bottom-0 z-10 px-6 bg-[#111] border-r border-white/5 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Live Ticker</span>
          </div>
          <div className="overflow-hidden">
            <motion.div 
              animate={{ x: [0, -1000] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-12 whitespace-nowrap pl-[140px]"
            >
              {[...liveMatches, ...liveMatches].map((match, idx) => (
                <Link key={`${match.id}-${idx}`} to={`/match/${match.id}`} className="flex items-center gap-4 hover:text-[#CCFF00] transition-colors">
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">{match.tournament}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-tight">{match.teamA}</span>
                    <div className="bg-[#CCFF00] text-black px-1.5 py-0.5 rounded text-[10px] font-black">{match.scoreA ?? '0'} - {match.scoreB ?? '0'}</div>
                    <span className="text-xs font-black uppercase tracking-tight">{match.teamB}</span>
                  </div>
                  <span className="text-[9px] font-black text-red-500 animate-pulse uppercase pr-12">● LIVE</span>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Main Section */}
        <div className="flex-[3] flex flex-col gap-4 overflow-hidden">
          {/* Ad Placement: Home Top */}
          <AdArea placement="HomeTop" className="w-full mb-1 shrink-0" />

          {/* Hero Image Slider */}
          <section className="relative flex-1 bg-gradient-to-tr from-black to-[#111] rounded-3xl border border-white/10 overflow-hidden group min-h-[450px]">
            <AnimatePresence mode="wait">
              {activeSliders.length > 0 ? (
                <motion.div
                  key={activeSliders[currentSlide].id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url('${activeSliders[currentSlide].image}')` }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  
                  <div className="absolute bottom-12 left-10 right-10">
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="bg-[#CCFF00] text-black text-[10px] font-black px-3 py-1 rounded-sm uppercase tracking-[0.2em] mb-4 inline-block">Featured Story</span>
                      <h2 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase italic tracking-tighter leading-none mb-4 max-w-4xl">
                        {activeSliders[currentSlide].title}
                      </h2>
                      {activeSliders[currentSlide].subtitle && (
                        <p className="text-white/60 text-base mb-8 max-w-xl font-medium">
                          {activeSliders[currentSlide].subtitle}
                        </p>
                      )}
                      {activeSliders[currentSlide].link && (
                        <Link 
                          to={activeSliders[currentSlide].link}
                          className="bg-white text-black px-8 py-3.5 rounded-full font-black text-sm hover:bg-[#CCFF00] hover:scale-105 transition-all inline-flex items-center gap-2"
                        >
                          Explore Now <ChevronRight size={18} />
                        </Link>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <div className="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center text-center p-8">
                   <h2 className="text-5xl font-black uppercase italic tracking-tighter text-white/5 opacity-10 leading-none">NO ACTIVE SLIDER CONTENT</h2>
                </div>
              )}
            </AnimatePresence>

            {/* Slider Controls */}
            {activeSliders.length > 1 && (
              <div className="absolute bottom-12 right-10 flex gap-2">
                <button 
                  onClick={() => setCurrentSlide(prev => (prev - 1 + activeSliders.length) % activeSliders.length)}
                  className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setCurrentSlide(prev => (prev + 1) % activeSliders.length)}
                  className="w-12 h-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            
            {/* Slide Indicators */}
            <div className="absolute bottom-12 left-10 flex gap-2 opacity-50">
               {activeSliders.map((_, idx) => (
                 <div 
                   key={idx} 
                   className={`h-1 transition-all rounded-full ${currentSlide === idx ? 'w-8 bg-[#CCFF00]' : 'w-2 bg-white/20'}`}
                 />
               ))}
            </div>
          </section>

          {/* New Prominent Scoreboard Section */}

          {liveMatches.length > 0 && (
            <section className="bg-gradient-to-br from-zinc-900 to-black border border-white/5 rounded-3xl p-8 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Award size={120} />
              </div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Live <span className="text-[#CCFF00]">Scoreboard</span></h3>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Real-time match laboratory updates</p>
                </div>
                <Link to="/live-score" className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Full Scores</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.slice(0, 4).map((match) => (
                  <Link key={match.id} to={`/match/${match.id}`} className="bg-black/60 border border-white/10 rounded-2xl p-6 hover:border-[#CCFF00]/40 transition-all flex flex-col gap-6 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                       <BarChart3 size={100} />
                    </div>

                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center p-2 group-hover:bg-[#CCFF00]/10 transition-colors">
                            {match.teamALogo ? <img src={match.teamALogo} className="w-full h-full object-contain" alt="" /> : <span className="capitalize font-black text-xs">{match.teamA?.[0]}</span>}
                          </div>
                          <span className="font-black uppercase tracking-tighter text-sm group-hover:text-[#CCFF00] transition-colors">{match.teamA}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center p-2 group-hover:bg-[#CCFF00]/10 transition-colors">
                            {match.teamBLogo ? <img src={match.teamBLogo} className="w-full h-full object-contain" alt="" /> : <span className="capitalize font-black text-xs">{match.teamB?.[0]}</span>}
                          </div>
                          <span className="font-black uppercase tracking-tighter text-sm group-hover:text-[#CCFF00] transition-colors">{match.teamB}</span>
                        </div>
                      </div>
                      <div className="px-8 border-l border-white/10 flex flex-col items-center gap-2">
                         <div className="bg-[#CCFF00] text-black px-4 py-5 rounded-2xl font-black text-2xl flex flex-col items-center leading-none shadow-[0_0_20px_rgba(204,255,0,0.2)]">
                            <span className="tabular-nums">{match.scoreA ?? '0'}</span>
                            <span className="h-px w-full bg-black/10 my-2" />
                            <span className="tabular-nums">{match.scoreB ?? '0'}</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-[#CCFF00] animate-pulse uppercase">{Math.floor(Math.random() * 90)}'</span>
                            <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.2em]">Match Time</span>
                         </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/5 relative z-10">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-white/20 uppercase">Possession</span>
                          <span className="text-[10px] font-black text-white/60">48% - 52%</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-white/20 uppercase">Total Shots</span>
                          <span className="text-[10px] font-black text-white/60">12 - 14</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-white/20 uppercase">On Target</span>
                          <span className="text-[10px] font-black text-white/60">5 - 7</span>
                       </div>
                       <div className="flex flex-col items-end">
                          <span className="text-[8px] font-black text-white/20 uppercase">Corners</span>
                          <span className="text-[10px] font-black text-white/60">4 - 6</span>
                       </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Category Quick Filter (Relocated Upstairs) */}
          <section className="bg-[#111] border border-white/5 rounded-2xl p-4 flex gap-3 overflow-x-auto scrollbar-hide shrink-0 mb-4">
             <div className="flex items-center pr-4 border-r border-white/10 shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Categories</span>
             </div>
             {['RTS', 'Football', 'Cricket', 'Basketball', 'UFC', 'F1', 'Tennis'].map((tag) => (
               <button 
                 key={tag} 
                 onClick={() => setSelectedSport(tag)}
                 className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${selectedSport.toLowerCase() === tag.toLowerCase() ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white'}`}
               >
                 {tag}
               </button>
             ))}
          </section>

          {/* Upcoming Fixtures Section */}
          <section className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#CCFF00]">Upcoming Fixtures</h3>
                <button 
                  onClick={handleNotifyMe}
                  className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md border border-white/5 text-[8px] font-black uppercase text-[#CCFF00] tracking-widest transition-all"
                >
                  < Bell size={10} />
                  Enable Alerts
                </button>
              </div>
              <Link to="/schedule" className="text-[10px] text-white/40 uppercase font-bold hover:text-white transition-colors">View Schedule</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {filteredMatches.filter(m => m.status === MatchStatus.UPCOMING).slice(0, 8).map(match => (
                <div key={match.id} className="min-w-[220px] bg-zinc-900/50 border border-white/5 rounded-2xl p-5 shrink-0 hover:border-[#CCFF00]/30 transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[8px] font-black uppercase text-white/20 tracking-widest">{match.tournament}</div>
                    <div className="bg-[#CCFF00]/10 px-2 py-0.5 rounded text-[8px] font-black text-[#CCFF00] uppercase">Next</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center group-hover:translate-x-1 transition-transform">
                      <span className="text-xs font-black uppercase tracking-tight text-white/80">{match.teamA}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black text-white/10 italic">VS</div>
                    <div className="flex justify-between items-center group-hover:-translate-x-1 transition-transform">
                      <span className="text-xs font-black uppercase tracking-tight text-white/80">{match.teamB}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#CCFF00] font-black">{new Date(match.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <span className="text-[9px] font-mono text-white/40 uppercase">{new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="bg-black/40 px-3 py-2 rounded-xl border border-white/5 flex items-center justify-center gap-2">
                       <span className="w-1 h-1 bg-[#CCFF00] rounded-full animate-pulse" />
                       <LocalizedCountdown targetDate={match.date} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ad Placement: Home After Fixtures */}
          <AdArea placement="HomeAfterFixtures" className="w-full shrink-0" />

          {/* Featured Channels Section */}
          <section className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#CCFF00]">Featured Channels</h3>
              <Link to="/live-tv" className="text-[10px] text-white/40 uppercase font-bold hover:text-white transition-colors">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {channels.slice(0, 8).map((channel) => (
                <ChannelCard key={channel.id} channel={channel} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Section */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Live Scores Widget */}
          <div className="flex-1 bg-[#0F0F0F] rounded-2xl border border-white/10 p-5 flex flex-col overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#CCFF00] mb-4">Live Scores</h3>
            <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
              {filteredMatches.filter(m => m.status === MatchStatus.LIVE).slice(0, 5).map(match => (
                <div key={match.id} className="bg-[#181818] rounded-xl p-4 border border-white/5 hover:border-[#CCFF00]/30 transition-all cursor-pointer group flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.02] -rotate-12">
                    <Trophy size={60} />
                  </div>

                  <div className="flex justify-between items-center relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-[9px] text-white/40 uppercase font-black tracking-[0.2em]">{match.sport} • LIVE</span>
                    </div>
                    <span className="text-[9px] font-black text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded uppercase tracking-widest">{Math.floor(Math.random() * 90)}'</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 relative z-10">
                    <div className="flex justify-between items-center group-hover:translate-x-1 transition-transform">
                      <div className="flex items-center gap-2">
                        {match.teamALogo && <img src={match.teamALogo} className="w-3 h-3 object-contain" alt="" />}
                        <span className="text-xs font-black uppercase text-white/80 group-hover:text-[#CCFF00] transition-colors">{match.teamA}</span>
                      </div>
                      <span className="text-lg font-black text-[#CCFF00] tabular-nums">{match.scoreA ?? '0'}</span>
                    </div>
                    <div className="flex justify-between items-center group-hover:-translate-x-1 transition-transform">
                      <div className="flex items-center gap-2">
                        {match.teamBLogo && <img src={match.teamBLogo} className="w-3 h-3 object-contain" alt="" />}
                        <span className="text-xs font-black uppercase text-white/80 group-hover:text-[#CCFF00] transition-colors">{match.teamB}</span>
                      </div>
                      <span className="text-lg font-black text-[#CCFF00] tabular-nums">{match.scoreB ?? '0'}</span>
                    </div>
                  </div>
                  
                  {/* Mini Match Center Data */}
                  <div className="pt-3 border-t border-white/5 space-y-3 relative z-10">
                     <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Shots</span>
                           <span className="text-[10px] font-black text-white/60">{8 + Math.floor(Math.random() * 5)} - {7 + Math.floor(Math.random() * 6)}</span>
                        </div>
                        <div className="flex flex-col items-center">
                           <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Poss.</span>
                           <span className="text-[10px] font-black text-white/60">48% - 52%</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Prob.</span>
                           <span className="text-[10px] font-black text-[#CCFF00]">{(50 + Math.random() * 20).toFixed(0)}%</span>
                        </div>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#CCFF00] animate-pulse" style={{ width: `${50 + Math.random() * 20}%` }} />
                     </div>
                  </div>

                  <Link 
                    to={`/match/${match.id}`}
                    className="mt-2 w-full py-2 bg-white/5 hover:bg-[#CCFF00] hover:text-black border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] transition-all text-center"
                  >
                    Details
                  </Link>
                </div>
              ))}
              {filteredMatches.filter(m => m.status === MatchStatus.LIVE).length === 0 && (
                <div className="flex-grow flex items-center justify-center text-center p-8 opacity-20">
                  <span className="text-[10px] font-bold uppercase tracking-widest italic">No Live Events</span>
                </div>
              )}
            </div>
            <Link to="/live-score" className="w-full mt-4 bg-white/5 hover:bg-white/10 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors text-center">
              Open Match Center
            </Link>
          </div>

          {/* Ad Area */}
          <div className="h-48 bg-gradient-to-b from-[#1A1A1A] to-[#121212] rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center group cursor-pointer overflow-hidden">
             <div className="text-center">
                <span className="block text-xs text-white/20 font-bold uppercase tracking-widest mb-1 group-hover:text-white/40 transition-colors">Advertisement</span>
                <span className="block text-lg font-black text-white/40 group-hover:text-[#CCFF00] transition-colors">PREMIUM AD ZONE</span>
                <span className="text-[10px] text-white/20">Direct Channel Access</span>
             </div>
          </div>
        </div>
      </div>

      {/* Highlights / News / Social Bottom Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#CCFF00]">Latest Highlights</h3>
            <Link to="/highlights" className="text-[10px] text-white/40 uppercase font-bold">Watch More</Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {highlights.slice(0, 3).map(h => (
              <Link key={h.id} to="/highlights" className="flex gap-3 group">
                <div className="w-24 h-16 rounded-lg bg-black overflow-hidden relative flex-shrink-0">
                  {h.thumbnail && h.thumbnail.trim() !== '' ? (
                    <img src={h.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all" alt="" />
                  ) : (
                    <div className="w-full h-full bg-zinc-800" />
                  )}
                  <Play size={14} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#CCFF00]" fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-white group-hover:text-[#CCFF00] transition-colors line-clamp-2 leading-tight uppercase tracking-tight">{h.title}</h4>
                  <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">{h.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-blue-400">Sports News</h3>
            <Link to="/news" className="text-[10px] text-white/40 uppercase font-bold">Read All</Link>
          </div>
          <div className="space-y-4">
            {news.slice(0, 4).map(n => (
              <Link key={n.id} to="/news" className="flex items-center gap-4 group">
                <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                <h4 className="text-xs font-bold text-white/80 group-hover:text-white transition-colors uppercase tracking-tight line-clamp-1">{n.title}</h4>
                <span className="ml-auto text-[9px] text-white/20 uppercase font-mono">{new Date(n.publishDate).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-[#0F0F0F] rounded-2xl border border-white/10 p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-pink-500">Social Buzz</h3>
            <span className="text-[10px] text-white/20 uppercase font-bold">Trending Now</span>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[11px] text-white/70 italic leading-snug">"Can't believe the comeback today! #MadridLive #Clasico"</p>
                <div className="mt-2 flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-neon-lime text-black flex items-center justify-center font-bold text-[8px]">S</div>
                   <span className="text-[9px] font-bold text-white/40">@SportsFan24</span>
                </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[11px] text-white/70 italic leading-snug">"The atmosphere in the stadium was electric! Video highlights soon."</p>
                <div className="mt-2 flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[8px]">J</div>
                   <span className="text-[9px] font-bold text-white/40">@ReporterJoe</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section>
        <Newsletter />
      </section>

      {/* Community Poll Section */}
      <section className="bg-gradient-to-r from-neon-blue/20 to-[#CCFF00]/10 rounded-2xl border border-white/10 p-8 flex flex-col md:flex-row items-center gap-12">
         <div className="flex-1">
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2 text-white">Match of the <span className="text-[#CCFF00]">Week</span>?</h3>
            <p className="text-white/40 text-sm font-bold uppercase tracking-widest">Who will take the crown in the upcoming derby?</p>
         </div>
         <div className="flex-[2] grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {['Team Madrid High', 'United Underdogs'].map((option) => (
              <button key={option} className="bg-black/60 hover:bg-[#CCFF00] hover:text-black border border-white/10 p-5 rounded-2xl text-left transition-all group flex justify-between items-center">
                 <span className="font-bold uppercase tracking-tight text-sm">{option}</span>
                 <span className="text-[10px] font-black text-white/20 group-hover:text-black">Vote</span>
              </button>
            ))}
         </div>
      </section>
    </div>
  );
}
