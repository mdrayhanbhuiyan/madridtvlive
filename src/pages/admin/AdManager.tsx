import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, XCircle, Edit2 } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

export default function AdManager() {
  const { ads } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    placement: 'Header',
    code: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'ads', editingId), formData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'ads'), formData);
      }
      setFormData({ name: '', placement: 'Header', code: '' });
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'ads');
    }
  };

  const startEdit = (ad: any) => {
    setFormData({
      name: ad.name,
      placement: ad.placement,
      code: ad.code
    });
    setEditingId(ad.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter text-neon-pink">Ad Manager</h2>
        <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); }} className="flex items-center space-x-2 bg-white text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-neon-lime transition-all">
          {isAdding ? <XCircle size={16} /> : <Plus size={16} />}
          <span>{isAdding ? 'Cancel' : 'Add Ad Slot'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-neon-pink/10 rounded-3xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Ad Label</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-pink" placeholder="e.g. Header Banner 728x90" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Placement</label>
              <select value={formData.placement} onChange={(e) => setFormData({...formData, placement: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-pink">
                <option value="Header">Header</option>
                <option value="Sidebar">Sidebar</option>
                <option value="Player">Above/Below Player</option>
                <option value="HomeTop">Home Top</option>
                <option value="HomeAfterFixtures">Home After Fixtures</option>
                <option value="NewsTop">News Top</option>
                <option value="Footer">Footer</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Ad Code (HTML/Script)</label>
            <textarea required rows={6} value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 font-mono text-xs text-neon-lime focus:border-neon-pink" placeholder="Paste your AdSense or other ad code here" />
          </div>
          <button type="submit" className="w-full bg-neon-pink text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-white transition-all">
            {editingId ? 'Update Ad Slot' : 'Activate Ad Slot'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {ads.map(ad => (
          <div key={ad.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white uppercase italic">{ad.name}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{ad.placement}</p>
            </div>
            <div className="flex items-center space-x-2">
               <button onClick={() => startEdit(ad)} className="p-2 text-white/20 hover:text-neon-lime transition-colors">
                 <Edit2 size={18} />
               </button>
               <button onClick={async () => await deleteDoc(doc(db, 'ads', ad.id))} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
