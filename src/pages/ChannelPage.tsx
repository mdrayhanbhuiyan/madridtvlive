import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import VideoPlayer from '../components/player/VideoPlayer';
import ChannelCard from '../components/ui/ChannelCard';
import AdArea from '../components/ads/AdArea';
import WidgetArea from '../components/widgets/WidgetArea';
import { Share2, Heart, Flag, Users, Tv } from 'lucide-react';
import { useState } from 'react';

export default function ChannelPage() {
  const { id } = useParams();
  const { channels, matches, loading } = useData();
  const [isFavorite, setIsFavorite] = useState(false);

  const channel = channels.find((c) => c.id === id);
  const relatedChannels = channels.filter((c) => c.sport === channel?.sport && c.id !== id).slice(0, 4);
  const upcomingMatches = matches.filter((m) => m.channelId === id).slice(0, 3);

  if (loading) {
    return <div className="flex-grow flex items-center justify-center"><div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!channel) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white/20 mb-4">Channel Not Found</h2>
        <Link to="/live-tv" className="text-neon-lime font-bold uppercase tracking-widest hover:underline">Back to Channel List</Link>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-black pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Player Area */}
          <div className="flex-grow">
            <VideoPlayer type={channel.type} source={channel.source} />
            
            <div className="mt-8 bg-zinc-900/50 border border-white/5 rounded-3xl p-6 lg:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center p-3 border border-white/10 shrink-0">
                    {channel.logo && channel.logo.trim() !== '' ? (
                      <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" />
                    ) : (
                      <Tv size={32} className="text-white/10" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter glow-lime">{channel.name}</h1>
                    <div className="flex items-center space-x-3 text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">
                      <span>{channel.sport}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{channel.country}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-all text-sm font-bold uppercase tracking-widest ${isFavorite ? 'bg-neon-pink/10 border-neon-pink/40 text-neon-pink' : 'border-white/10 hover:border-white/40'}`}
                  >
                    <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                    <span>{isFavorite ? 'Favorite' : 'Add Favorite'}</span>
                  </button>
                  <button className="p-2 rounded-full border border-white/10 hover:border-white/40 transition-all text-white/60">
                    <Share2 size={20} />
                  </button>
                  <button className="p-2 rounded-full border border-white/10 hover:border-white/40 transition-all text-white/60">
                    <Flag size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-white/30 font-black uppercase text-[10px] tracking-widest">
                    <Users size={14} className="text-neon-lime" />
                    <span>Streaming Status</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-grow h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-neon-lime w-[92%]" />
                    </div>
                    <span className="text-xs font-mono text-neon-lime tracking-tighter">92% Signal</span>
                  </div>
                  <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Notice</h4>
                    <p className="text-xs text-white/50 leading-relaxed italic">
                      This stream is provided for testing purposes. If you encounter any buffering, please refresh the page or check your internet connection.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4 flex items-center">
                    Upcoming on {channel.name}
                  </h3>
                  <div className="space-y-3">
                    {upcomingMatches.length > 0 ? upcomingMatches.map(m => (
                      <div key={m.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 text-sm">
                        <span className="font-bold truncate mr-4">{m.teamA} vs {m.teamB}</span>
                        <span className="text-[10px] font-mono text-neon-blue shrink-0">{new Date(m.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    )) : (
                      <p className="text-xs text-white/30 italic">No scheduled matches yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <AdArea placement="Player" className="mt-8" />
          </div>

          {/* Player Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-12 text-center lg:text-left">
            <AdArea placement="Sidebar" />
            
            <section>
              <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 inline-flex items-center">
                Recommended <div className="w-8 h-px bg-neon-lime ml-3" />
              </h3>
              <div className="space-y-4">
                {relatedChannels.map((c) => (
                  <ChannelCard key={c.id} channel={c} />
                ))}
              </div>
            </section>

            <WidgetArea placement="MatchDetails" />
          </aside>
        </div>
      </div>
    </div>
  );
}
