import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, XCircle, Edit2 } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

export default function WidgetManager() {
  const { widgets } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Score',
    htmlCode: '',
    placement: 'HomeSidebar'
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'widgets', editingId), formData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'widgets'), formData);
      }
      setFormData({ name: '', type: 'Score', htmlCode: '', placement: 'HomeSidebar' });
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'widgets');
    }
  };

  const startEdit = (w: any) => {
    setFormData({
      name: w.name,
      type: w.type || 'Score',
      htmlCode: w.htmlCode,
      placement: w.placement
    });
    setEditingId(w.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Manage Widgets</h2>
        <button onClick={() => { setIsAdding(!isAdding); setEditingId(null); }} className="flex items-center space-x-2 bg-neon-lime text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all">
          {isAdding ? <XCircle size={16} /> : <Plus size={16} />}
          <span>{isAdding ? 'Cancel' : 'Add Widget'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Widget Name</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime" placeholder="e.g. EPL Standings" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Placement</label>
              <select value={formData.placement} onChange={(e) => setFormData({...formData, placement: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime">
                <option value="HomeSidebar">Home Sidebar</option>
                <option value="LiveScore">Live Score Page</option>
                <option value="MatchDetails">Channel Sidebar</option>
                <option value="Footer">Footer Section</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">HTML / Script Code</label>
            <textarea required rows={8} value={formData.htmlCode} onChange={(e) => setFormData({...formData, htmlCode: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 font-mono text-xs text-neon-blue focus:border-neon-lime" placeholder="<div id='widget'>...</div>" />
          </div>
          <button type="submit" className="w-full bg-neon-lime text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-white transition-all">
            {editingId ? 'Update Widget' : 'Save Widget'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {widgets.map(w => (
          <div key={w.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-white">{w.name}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20">{w.placement}</p>
            </div>
            <div className="flex items-center space-x-4">
               <div className="text-[10px] font-mono text-neon-blue truncate max-w-[200px] bg-black/40 px-3 py-1 rounded">
                 {w.htmlCode.substring(0, 50)}...
               </div>
               <button onClick={() => startEdit(w)} className="p-2 text-white/20 hover:text-neon-lime transition-colors">
                 <Edit2 size={18} />
               </button>
               <button onClick={async () => await deleteDoc(doc(db, 'widgets', w.id))} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
