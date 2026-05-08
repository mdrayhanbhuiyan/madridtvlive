import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, XCircle, Edit2, PlayCircle } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

export default function HighlightManager() {
  const { highlights } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    videoUrl: '',
    category: 'Football',
    duration: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'highlights', editingId), formData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'highlights'), {
          ...formData,
          createdAt: Date.now()
        });
      }
      setFormData({ title: '', thumbnail: '', videoUrl: '', category: 'Football', duration: '' });
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'highlights');
    }
  };

  const startEdit = (h: any) => {
    setFormData({
      title: h.title,
      thumbnail: h.thumbnail,
      videoUrl: h.videoUrl,
      category: h.category,
      duration: h.duration || ''
    });
    setEditingId(h.id);
    setIsAdding(true);
  };

  const deleteHighlight = async (id: string) => {
    if (confirm('Delete this highlight?')) {
      try {
        await deleteDoc(doc(db, 'highlights', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `highlights/${id}`);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Manage Highlights</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); }} 
          className="flex items-center space-x-2 bg-neon-lime text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)]"
        >
          {isAdding ? <XCircle size={16} /> : <Plus size={16} />}
          <span>{isAdding ? 'Cancel' : 'Add Highlight'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Title</label>
            <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime transition-colors" placeholder="e.g. Real Madrid vs Barcelona 3-1 Highlights" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Thumbnail URL</label>
            <input required value={formData.thumbnail} onChange={(e) => setFormData({...formData, thumbnail: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime transition-colors" placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Video URL/ID</label>
            <input required value={formData.videoUrl} onChange={(e) => setFormData({...formData, videoUrl: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime transition-colors" placeholder="YouTube ID or direct video URL" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Category</label>
            <input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime transition-colors" placeholder="e.g. Champions League" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Duration (e.g. 10:30)</label>
            <input value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime transition-colors" placeholder="8:45" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-neon-lime text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-white transition-all">
              {editingId ? 'Update Highlight' : 'Save Highlight'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {highlights.map(h => (
          <div key={h.id} className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden group hover:border-white/10 transition-all">
            <div className="aspect-video bg-black relative">
              {h.thumbnail && h.thumbnail.trim() !== '' ? (
                <img src={h.thumbnail} alt="" className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                   <PlayCircle className="text-white/10" size={30} />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="text-neon-lime" size={40} />
              </div>
              {h.duration && (
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest">
                  {h.duration}
                </span>
              )}
            </div>
            <div className="p-4 flex justify-between items-start">
               <div className="flex-grow pr-4">
                 <h4 className="text-xs font-bold text-white line-clamp-2 uppercase tracking-tight leading-tight">{h.title}</h4>
                 <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1.5">{h.category}</p>
               </div>
               <div className="flex items-center space-x-1">
                 <button onClick={() => startEdit(h)} className="p-2 text-white/20 hover:text-neon-lime transition-colors bg-white/5 rounded-lg">
                   <Edit2 size={14} />
                 </button>
                 <button onClick={() => deleteHighlight(h.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors bg-white/5 rounded-lg">
                   <Trash2 size={14} />
                 </button>
               </div>
            </div>
          </div>
        ))}
        {highlights.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-white/20 font-bold uppercase tracking-widest text-xs italic">No highlights recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
