import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Match, MatchStatus } from '../../types';
import { formatDate } from '../../lib/utils';
import { Trophy, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  variant?: 'large' | 'small';
}

export default function MatchCard({ match, variant = 'small' }: MatchCardProps) {
  const isLive = match.status === MatchStatus.LIVE;
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (match.status !== MatchStatus.UPCOMING) return;

    const calculateTimeLeft = () => {
      const difference = match.date - new Date().getTime();
      
      if (difference <= 0) {
        setTimeLeft('STOCKED');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setTimeLeft(parts.join(' '));
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [match.date, match.status]);

  return (
    <div className={`group relative bg-[#121212] border ${isLive ? 'border-[#CCFF00]/40' : 'border-white/5'} rounded-[24px] overflow-hidden hover:border-[#CCFF00]/30 transition-all duration-500`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      
      {isLive && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-red-600 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full ring-4 ring-black/50">
          <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
          Live
        </div>
      )}
      
      <div className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-1">
            <span className="text-[8px] font-black text-[#CCFF00] uppercase tracking-[0.2em]">
              {match.sport}
            </span>
            <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest block">
              {match.tournament}
            </h4>
          </div>
          {match.status === MatchStatus.UPCOMING && (
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-tighter">
                {formatDate(match.date)}
              </span>
              <div className="flex items-center gap-1.5 mt-1 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                <Clock size={10} className="text-[#CCFF00]" />
                <span className="text-[10px] font-black text-white/60 font-mono tracking-tighter">
                  {timeLeft}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Team A */}
          <div className="flex flex-col items-center flex-1 min-w-0">
             <div className="w-14 h-14 md:w-16 md:h-16 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 mb-4 overflow-hidden group-hover:border-[#CCFF00]/40 transition-all duration-500 shadow-2xl">
                {match.teamALogo && match.teamALogo.trim() !== '' ? (
                  <img src={match.teamALogo} alt="" className="w-10 h-10 md:w-11 md:h-11 object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <Trophy size={24} className="text-white/10" />
                )}
             </div>
             <div className="text-[11px] md:text-xs font-black uppercase tracking-tight text-white/90 group-hover:text-[#CCFF00] transition-colors truncate w-full text-center px-1 duration-300">
               {match.teamA}
             </div>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col items-center justify-center px-2 min-w-[70px]">
            {isLive ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 bg-[#CCFF00]/10 px-3 py-2 rounded-xl border border-[#CCFF00]/20 shadow-[0_0_20px_rgba(204,255,0,0.05)]">
                  <span className="text-2xl font-black text-[#CCFF00] tabular-nums">{match.scoreA ?? '0'}</span>
                  <span className="text-white/20 text-lg font-black italic">-</span>
                  <span className="text-2xl font-black text-[#CCFF00] tabular-nums">{match.scoreB ?? '0'}</span>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-[10px] font-black text-white/10 italic tracking-widest">VS</span>
              </div>
            )}
          </div>

          {/* Team B */}
          <div className="flex flex-col items-center flex-1 min-w-0">
             <div className="w-14 h-14 md:w-16 md:h-16 bg-black/40 rounded-2xl flex items-center justify-center border border-white/5 mb-4 overflow-hidden group-hover:border-[#CCFF00]/40 transition-all duration-500 shadow-2xl">
                {match.teamBLogo && match.teamBLogo.trim() !== '' ? (
                  <img src={match.teamBLogo} alt="" className="w-10 h-10 md:w-11 md:h-11 object-contain group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <Trophy size={24} className="text-white/10" />
                )}
             </div>
             <div className="text-[11px] md:text-xs font-black uppercase tracking-tight text-white/90 group-hover:text-[#CCFF00] transition-colors truncate w-full text-center px-1 duration-300">
               {match.teamB}
             </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to={`/match/${match.id}`}
            className={`block w-full text-center py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
              isLive 
                ? 'bg-[#CCFF00] text-black hover:bg-white active:scale-[0.98]' 
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'
            }`}
          >
            {isLive ? 'Launch Live Lab' : 'Match Insights'}
          </Link>
        </div>
      </div>
    </div>
  );
}
