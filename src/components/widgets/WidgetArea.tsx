import { useData } from '../../context/DataContext';

interface WidgetAreaProps {
  placement: 'HomeSidebar' | 'LiveScore' | 'MatchDetails' | 'Footer';
  className?: string;
}

export default function WidgetArea({ placement, className }: WidgetAreaProps) {
  const { widgets } = useData();
  const filteredWidgets = widgets.filter(w => w.placement === placement);

  if (filteredWidgets.length === 0) return null;

  return (
    <div className={className}>
      {filteredWidgets.map((widget) => (
        <div key={widget.id} className="widget-box mb-6 border border-white/5 rounded-2xl overflow-hidden bg-zinc-900/40 p-4">
          <h5 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 border-b border-white/5 pb-2">
            {widget.name}
          </h5>
          <div 
            dangerouslySetInnerHTML={{ __html: widget.htmlCode }}
            className="overflow-x-auto"
          />
        </div>
      ))}
    </div>
  );
}
