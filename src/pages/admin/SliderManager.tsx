import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, XCircle, Edit2, Image as ImageIcon, Link as LinkIcon, MoveUp, MoveDown } from 'lucide-react';
import { SliderItem } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

export default function SliderManager() {
  const { sliders } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    order: 0,
    isActive: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'sliders', editingId), { 
          ...formData, 
          updatedAt: Date.now() 
        });
      } else {
        await addDoc(collection(db, 'sliders'), {
          ...formData,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      }

      setFormData({ title: '', subtitle: '', image: '', link: '', order: sliders.length, isActive: true });
      setEditingId(null);
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'sliders');
    }
  };

  const startEdit = (s: SliderItem) => {
    setFormData({
      title: s.title,
      subtitle: s.subtitle || '',
      image: s.image,
      link: s.link || '',
      order: s.order,
      isActive: s.isActive
    });
    setEditingId(s.id);
    setIsAdding(true);
  };

  const deleteSlider = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;
    try {
      await deleteDoc(doc(db, 'sliders', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `sliders/${id}`);
    }
  };

  const toggleActive = async (s: SliderItem) => {
    try {
      await updateDoc(doc(db, 'sliders', s.id), { isActive: !s.isActive });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `sliders/${s.id}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Manage Hero Slider</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
          className="flex items-center space-x-2 bg-[#CCFF00] text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)]"
        >
          {isAdding ? <XCircle size={16} /> : <Plus size={16} />}
          <span>{isAdding ? 'Cancel' : 'Add New Slide'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top duration-300">
          <div className="space-y-4 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Slider Image URL</label>
            <div className="flex gap-4">
               <div className="flex-grow">
                 <input required value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-[#CCFF00]" placeholder="https://images.unsplash.com/..." />
               </div>
               {formData.image && (
                 <div className="w-20 h-20 bg-black/40 rounded-2xl border border-white/10 overflow-hidden shrink-0">
                    <img src={formData.image} className="w-full h-full object-cover" alt="preview" />
                 </div>
               )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Slide Title</label>
            <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-[#CCFF00]" placeholder="Ready for the Weekend?" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Subtitle (Optional)</label>
            <input value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-[#CCFF00]" placeholder="The biggest matches, all in one place." />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Action Link (Optional)</label>
            <input value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-[#CCFF00]" placeholder="/live-tv or /matches/id" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Display Order</label>
            <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: Number(e.target.value)})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-[#CCFF00]" />
          </div>
          <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
             <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 rounded border-white/10 bg-black text-[#CCFF00] focus:ring-[#CCFF00]" id="isActive" />
             <label htmlFor="isActive" className="text-xs font-black uppercase tracking-widest text-white/60 cursor-pointer">Active in Hero Section</label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-[#CCFF00] text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-white transition-all">
               {editingId ? 'Update Slide' : 'Add to Hero Slider'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {sliders.sort((a, b) => a.order - b.order).map(s => (
          <div key={s.id} className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-all overflow-hidden relative">
            {!s.isActive && <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center"><span className="bg-red-500 text-white px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest">Inactive</span></div>}
            
            <div className="flex items-center space-x-6 flex-grow relative z-0">
              <div className="w-40 h-24 bg-white/5 rounded-2xl border border-white/10 overflow-hidden shrink-0">
                <img src={s.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              <div className="flex-grow max-w-xl">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black text-[#CCFF00] bg-[#CCFF00]/10 px-2 py-0.5 rounded uppercase tracking-widest">Order: {s.order}</span>
                    {s.link && <span className="text-[10px] font-bold text-white/20 uppercase flex items-center gap-1"><LinkIcon size={10} /> {s.link}</span>}
                 </div>
                 <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-1">{s.title}</h3>
                 <p className="text-sm font-medium text-white/40 leading-relaxed max-w-md line-clamp-1">{s.subtitle}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 relative z-20">
              <button 
                onClick={() => toggleActive(s)}
                className={`p-4 rounded-2xl transition-all ${s.isActive ? 'bg-[#CCFF00] text-black' : 'bg-white/5 text-white/20 hover:text-white'}`}
                title={s.isActive ? 'Deactivate' : 'Activate'}
              >
                <ImageIcon size={20} />
              </button>
              <button onClick={() => startEdit(s)} className="p-4 bg-white/5 text-white/20 hover:text-[#CCFF00] hover:bg-white/10 rounded-2xl transition-all">
                <Edit2 size={20} />
              </button>
              <button onClick={() => deleteSlider(s.id)} className="p-4 bg-white/5 text-white/20 hover:text-red-500 hover:bg-white/10 rounded-2xl transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        {sliders.length === 0 && (
           <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-zinc-950">
              <Plus className="mx-auto text-white/10 mb-4" size={48} />
              <p className="text-white/20 font-bold uppercase tracking-widest text-xs italic">No hero slides created yet.</p>
           </div>
        )}
      </div>
    </div>
  );
}
