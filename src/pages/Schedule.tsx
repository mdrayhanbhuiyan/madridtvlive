import { useData } from '../context/DataContext';
import MatchCard from '../components/ui/MatchCard';
import { useState } from 'react';
import { Sport, MatchStatus } from '../types';
import { Calendar, Search } from 'lucide-react';
import { formatDate } from '../lib/utils';

export default function Schedule() {
  const { matches, loading } = useData();
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const sports = ['All', Sport.FOOTBALL, Sport.CRICKET, Sport.NBA, Sport.TENNIS];
  
  const filteredMatches = matches
    .filter(m => 
      (selectedSport === 'All' || m.sport === selectedSport) &&
      (m.teamA.toLowerCase().includes(searchQuery.toLowerCase()) || m.teamB.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => a.date - b.date);

  if (loading) return <div className="flex-grow flex items-center justify-center"><div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter glow-lime mb-2">Match Schedule</h1>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-8">Never miss a big game again</p>
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/50 p-4 rounded-3xl border border-white/5">
          <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-auto">
            {sports.map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                  selectedSport === sport ? 'bg-neon-lime text-black' : 'bg-white/5 text-white/40 hover:bg-white/10'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full pl-12 pr-4 py-2 text-sm focus:border-neon-lime focus:ring-0 transition-all text-white placeholder-white/20"
            />
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {filteredMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-white/20 font-black uppercase italic text-2xl tracking-tighter">
            No Matches Scheduled
          </div>
        )}
      </div>
    </div>
  );
}
