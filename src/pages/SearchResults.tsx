import { useSearchParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import MatchCard from '../components/ui/MatchCard';
import ChannelCard from '../components/ui/ChannelCard';
import { Search as SearchIcon } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { matches, channels, loading } = useData();

  const filteredMatches = matches.filter(m => 
    m.teamA.toLowerCase().includes(query.toLowerCase()) || 
    m.teamB.toLowerCase().includes(query.toLowerCase())
  );

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <div className="flex-grow flex items-center justify-center"><div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12">
        <div className="flex items-center space-x-4 mb-2">
            <SearchIcon size={32} className="text-neon-lime" />
            <h1 className="text-4xl font-black uppercase italic tracking-tighter glow-lime">Search Results</h1>
        </div>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest italic">Showing results for "{query}"</p>
      </header>

      {filteredChannels.length > 0 && (
        <section className="mb-16">
          <h2 className="text-xl font-black uppercase tracking-tight mb-8">Channels</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredChannels.map(c => <ChannelCard key={c.id} channel={c} />)}
          </div>
        </section>
      )}

      {filteredMatches.length > 0 && (
        <section>
          <h2 className="text-xl font-black uppercase tracking-tight mb-8">Matches</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map(m => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {filteredChannels.length === 0 && filteredMatches.length === 0 && (
        <div className="py-20 text-center">
           <p className="text-white/20 font-black uppercase italic text-2xl tracking-tighter mb-4">No results found</p>
           <Link to="/" className="text-neon-lime font-bold uppercase text-xs hover:underline">Return Home</Link>
        </div>
      )}
    </div>
  );
}
