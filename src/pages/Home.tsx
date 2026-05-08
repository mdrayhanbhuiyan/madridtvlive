import { motion } from 'motion/react';
import { useData } from '../context/DataContext';
import MatchCard from '../components/ui/MatchCard';
import ChannelCard from '../components/ui/ChannelCard';
import WidgetArea from '../components/widgets/WidgetArea';
import AdArea from '../components/ads/AdArea';
import Newsletter from '../components/widgets/Newsletter';
import { Link } from 'react-router-dom';
import { MatchStatus, Sport } from '../types';
import { ChevronRight, Play, Award, Newspaper } from 'lucide-react';

export default function Home() {
  const { matches, channels, news, highlights, loading } = useData();

  const liveMatches = matches.filter((m) => m.status === MatchStatus.LIVE);
  const featuredMatch = matches.find((m) => m.isFeatured) || liveMatches[0];
  const featuredChannels = channels.filter((c) => c.status === 'Active').slice(0, 8);
  const latestNews = news.slice(0, 4);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col p-4 gap-4 overflow-hidden">
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden">
        {/* Main Section */}
        <div className="flex-[3] flex flex-col gap-4 overflow-hidden">
          {/* Category Quick Filter */}
          <section className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
             {['All Sports', 'Football', 'Cricket', 'Basketball', 'UFC', 'F1', 'Tennis'].map((tag, i) => (
               <button key={tag} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${i === 0 ? 'bg-[#CCFF00] text-black border-[#CCFF00]' : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'}`}>
                 {tag}
               </button>
             ))}
          </section>

          {/* Ad Placement: Home Top */}
          <AdArea placement="HomeTop" className="w-full mb-4 shrink-0" />

          {/* Hero Feature */}
          <section className="relative flex-1 bg-gradient-to-tr from-black to-[#111] rounded-2xl border border-white/10 overflow-hidden group min-h-[400px]">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-[10s]" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop')" }} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm animate-pulse">LIVE</span>
              <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-sm border border-white/10 uppercase tracking-widest">Featured Match</span>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              {featuredMatch ? (
                <div className="max-w-2xl">
                  {featuredMatch.status === MatchStatus.LIVE ? (
                    <div className="flex items-center gap-6 mb-3">
                      <div className="text-center flex flex-col items-center">
                        {featuredMatch.teamALogo && featuredMatch.teamALogo.trim() !== '' && <img src={featuredMatch.teamALogo} className="w-12 h-12 object-contain mb-2" alt="" />}
                        <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{featuredMatch.teamA}</span>
                        <span className="text-5xl md:text-7xl font-black text-[#CCFF00] tracking-tighter shadow-[0_0_30px_rgba(204,255,0,0.4)]">{featuredMatch.scoreA ?? '0'}</span>
                      </div>
                      <span className="text-3xl md:text-5xl font-black text-white/20 italic mt-6">:</span>
                      <div className="text-center flex flex-col items-center">
                        {featuredMatch.teamBLogo && featuredMatch.teamBLogo.trim() !== '' && <img src={featuredMatch.teamBLogo} className="w-12 h-12 object-contain mb-2" alt="" />}
                        <span className="block text-[10px] text-white/40 uppercase font-bold tracking-widest mb-1">{featuredMatch.teamB}</span>
                        <span className="text-5xl md:text-7xl font-black text-[#CCFF00] tracking-tighter shadow-[0_0_30px_rgba(204,255,0,0.4)]">{featuredMatch.scoreB ?? '0'}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mb-4">
                       <div className="flex items-center gap-4">
                          {featuredMatch.teamALogo && featuredMatch.teamALogo.trim() !== '' && <img src={featuredMatch.teamALogo} className="w-10 h-10 object-contain" alt="" />}
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase leading-none tracking-tighter">
                            {featuredMatch.teamA}
                          </h2>
                       </div>
                       <span className="text-2xl font-black text-white/10 ml-12">VS</span>
                       <div className="flex items-center gap-4">
                          {featuredMatch.teamBLogo && featuredMatch.teamBLogo.trim() !== '' && <img src={featuredMatch.teamBLogo} className="w-10 h-10 object-contain" alt="" />}
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase leading-none tracking-tighter">
                            {featuredMatch.teamB}
                          </h2>
                       </div>
                    </div>
                  )}
                  <p className="text-white/60 text-sm mb-6 max-w-md hidden md:block">
                    Catch all the action live with multi-cam feeds and real-time tactical analysis for <span className="text-white font-bold">{featuredMatch.tournament}</span>.
                  </p>
                  <div className="flex gap-3">
                    <Link to={featuredMatch.channelId ? `/channel/${featuredMatch.channelId}` : `/match/${featuredMatch.id}`} className="bg-[#CCFF00] text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform flex items-center gap-2">
                      <Play size={16} fill="currentColor" /> {featuredMatch.status === MatchStatus.LIVE ? 'Watch Live Now' : 'Join Match Center'}
                    </Link>
                    <Link to={`/match/${featuredMatch.id}`} className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white/20 transition-colors">
                      Detailed Analysis
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl">
                   <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase leading-none mb-3 tracking-tighter">
                    Ready for the <span className="text-[#CCFF00]">Weekend</span>
                  </h2>
                  <p className="text-white/60 text-sm mb-6 max-w-md">
                    Stay tuned for the biggest matches of the season. 24/7 sports coverage starting soon.
                  </p>
                  <Link to="/schedule" className="bg-[#CCFF00] text-black px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform inline-block">
                    Full Schedule
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Live Score Ticker (Google Style) */}
          {liveMatches.length > 0 && (
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 flex items-center gap-6 overflow-x-auto scrollbar-hide shadow-2xl shrink-0"
            >
              <div className="flex items-center gap-2 shrink-0 border-r border-white/10 pr-6">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Live Scores</span>
              </div>
              <div className="flex items-center gap-6 whitespace-nowrap">
                {liveMatches.map((match) => (
                  <Link 
                    key={match.id} 
                    to={`/match/${match.id}`}
                    className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:border-[#CCFF00]/40 transition-all group"
                  >
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold text-white/60">{match.teamA}</span>
                      <span className="text-[10px] font-bold text-white/60">{match.teamB}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center bg-black/40 px-2 py-1 rounded border border-white/5 group-hover:border-[#CCFF00]/20 min-w-[32px]">
                      <span className="text-xs font-black text-[#CCFF00] mb-0.5">{match.scoreA ?? '0'}</span>
                      <span className="text-xs font-black text-[#CCFF00]">{match.scoreB ?? '0'}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                       <span className="text-[8px] font-black text-red-500 animate-pulse uppercase tracking-tighter">Live</span>
                       <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{match.tournament.split(' ')[0]}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Upcoming Fixtures Horizontal Scroll */}
          <section className="bg-black/40 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#CCFF00]">Upcoming Fixtures</h3>
              <Link to="/schedule" className="text-[10px] text-white/40 uppercase font-bold">View Schedule</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {matches.filter(m => m.status === MatchStatus.UPCOMING).slice(0, 8).map(match => (
                <div key={match.id} className="min-w-[200px] bg-zinc-900 border border-white/5 rounded-xl p-4 shrink-0 hover:border-white/20 transition-colors">
                  <div className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-3">{match.tournament}</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/80">{match.teamA}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-white/20 italic">VS</div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/80">{match.teamB}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-neon-lime">{new Date(match.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    <Link to="/schedule" className="text-[8px] font-black uppercase text-white/40 hover:text-white">Notify</Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ad Placement: Home After Fixtures */}
          <AdArea placement="HomeAfterFixtures" className="w-full" />

          {/* Featured Channels Section */}
          <section className="h-auto md:h-44 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#CCFF00]">Featured Channels</h3>
              <Link to="/live-tv" className="text-[10px] text-white/40 uppercase font-bold hover:text-white transition-colors">View All</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {channels.slice(0, 6).map((channel) => (
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
              {matches.filter(m => m.status === MatchStatus.LIVE).slice(0, 5).map(match => (
                <div key={match.id} className="bg-[#181818] rounded-xl p-4 border border-white/5 hover:border-[#CCFF00]/30 transition-colors cursor-pointer group">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">{match.sport} • LIVE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold group-hover:text-[#CCFF00] transition-colors">{match.teamA}</span>
                    <span className="text-base font-black text-[#CCFF00] glow-lime">{match.scoreA ?? '0'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold group-hover:text-[#CCFF00] transition-colors">{match.teamB}</span>
                    <span className="text-base font-black text-[#CCFF00] glow-lime">{match.scoreB ?? '0'}</span>
                  </div>
                  
                  {/* Win Probability Logic (Simulated) */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                     <div className="flex justify-between text-[8px] font-black uppercase text-white/20 mb-1">
                        <span>Win Prob.</span>
                        <span>{(40 + Math.random() * 20).toFixed(0)}%</span>
                     </div>
                     <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-neon-blue animate-pulse" style={{ width: `${40 + Math.random() * 20}%` }} />
                     </div>
                  </div>
                </div>
              ))}
              {matches.filter(m => m.status === MatchStatus.LIVE).length === 0 && (
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
