import { Link } from 'react-router-dom';
import { Channel } from '../../types';
import { PlayCircle } from 'lucide-react';

interface ChannelCardProps {
  channel: Channel;
}

export default function ChannelCard({ channel }: ChannelCardProps) {
  const isLive = channel.status === 'Active';

  return (
    <Link 
      to={`/channel/${channel.id}`}
      className="w-44 h-32 bg-[#121212] rounded-xl border border-white/5 flex flex-col items-center justify-center gap-2 shrink-0 group cursor-pointer hover:border-[#CCFF00]/40 transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center font-black group-hover:scale-110 transition-transform overflow-hidden">
        {channel.logo && channel.logo.trim() !== '' ? (
          <img src={channel.logo} className="w-full h-full object-cover" alt="" />
        ) : (
          <span className="text-white/40">{channel.name.substring(0, 2).toUpperCase()}</span>
        )}
      </div>
      <span className="text-xs font-bold text-white group-hover:text-[#CCFF00] transition-colors">{channel.name}</span>
      <span className={`text-[9px] font-bold uppercase ${isLive ? 'text-green-500' : 'text-red-500'}`}>
        {isLive ? 'Online' : 'Offline'}
      </span>
    </Link>
  );
}
