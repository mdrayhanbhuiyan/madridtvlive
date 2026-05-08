import { useData } from '../context/DataContext';
import MatchCard from '../components/ui/MatchCard';
import { Sport } from '../types';
import { Trophy } from 'lucide-react';

interface LeaguePageProps {
  sport: Sport;
}

export default function LeaguePage({ sport }: LeaguePageProps) {
  const { matches, loading } = useData();
  const filteredMatches = matches.filter(m => m.sport === sport);

  if (loading) return <div className="flex-grow flex items-center justify-center"><div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-2">
            <Trophy size={32} className="text-neon-lime" />
            <h1 className="text-4xl font-black uppercase italic tracking-tighter glow-lime">{sport} Central</h1>
        </div>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Live scores, schedule and updates for {sport}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.length > 0 ? filteredMatches.map(m => (
          <MatchCard key={m.id} match={m} />
        )) : (
          <div className="col-span-full py-20 text-center text-white/20 font-black uppercase italic text-2xl tracking-tighter">
            No {sport} Content Available Yet
          </div>
        )}
      </div>
    </div>
  );
}
