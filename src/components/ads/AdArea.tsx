import { useData } from '../../context/DataContext';

interface AdAreaProps {
  placement: 'Header' | 'Sidebar' | 'Player' | 'Footer' | 'HomeTop' | 'HomeAfterFixtures' | 'NewsTop';
  className?: string;
}

export default function AdArea({ placement, className }: AdAreaProps) {
  const { ads } = useData();
  const filteredAds = ads.filter(a => a.placement === placement);

  if (filteredAds.length === 0) return null;

  return (
    <div className={className}>
      {filteredAds.map((ad) => (
        <div 
          key={ad.id} 
          className="ad-box flex items-center justify-center p-2 bg-zinc-900 border border-dashed border-white/10 rounded-lg overflow-hidden"
          dangerouslySetInnerHTML={{ __html: ad.code }}
        />
      ))}
    </div>
  );
}
