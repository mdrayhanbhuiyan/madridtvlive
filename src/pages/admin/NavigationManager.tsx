import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, Edit2, XCircle, Menu as MenuIcon } from 'lucide-react';
import { NavigationItem } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

export default function NavigationManager() {
  const { navigation } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    path: '',
    order: 0,
    submenu: [] as { name: string; path: string }[]
  });

  const [newSubmenu, setNewSubmenu] = useState({ name: '', path: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        order: Number(formData.order)
      };

      if (editingId) {
        await updateDoc(doc(db, 'navigation', editingId), data);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'navigation'), data);
      }
      setFormData({ name: '', path: '', order: 0, submenu: [] });
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'navigation');
    }
  };

  const addSubmenu = () => {
    if (!newSubmenu.name || !newSubmenu.path) return;
    setFormData({
      ...formData,
      submenu: [...formData.submenu, newSubmenu]
    });
    setNewSubmenu({ name: '', path: '' });
  };

  const removeSubmenu = (index: number) => {
    const updated = [...formData.submenu];
    updated.splice(index, 1);
    setFormData({ ...formData, submenu: updated });
  };

  const startEdit = (item: NavigationItem) => {
    setFormData({
      name: item.name,
      path: item.path,
      order: item.order || 0,
      submenu: item.submenu || []
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu?')) return;
    try {
      await deleteDoc(doc(db, 'navigation', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `navigation/${id}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Manage Navigation</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); setFormData({ name: '', path: '', order: 0, submenu: [] }); }}
          className="flex items-center space-x-2 bg-neon-lime text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all"
        >
          {isAdding ? <XCircle size={16} /> : <Plus size={16} />}
          <span>{isAdding ? 'Cancel' : 'Add Menu'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 space-y-6 animate-in slide-in-from-top duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Menu Name</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0" 
                placeholder="e.g. Football" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Path</label>
              <input 
                required
                value={formData.path}
                onChange={(e) => setFormData({...formData, path: e.target.value})}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0" 
                placeholder="e.g. /football" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Display Order</label>
              <input 
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0" 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/40">Submenus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-2">
                <input 
                  value={newSubmenu.name}
                  onChange={(e) => setNewSubmenu({...newSubmenu, name: e.target.value})}
                  className="flex-grow bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white" 
                  placeholder="Submenu Name" 
                />
                <input 
                  value={newSubmenu.path}
                  onChange={(e) => setNewSubmenu({...newSubmenu, path: e.target.value})}
                  className="flex-grow bg-black border border-white/10 rounded-xl px-4 py-2 text-xs text-white" 
                  placeholder="Submenu Path" 
                />
                <button 
                  type="button"
                  onClick={addSubmenu}
                  className="bg-white/10 hover:bg-neon-lime hover:text-black transition-all p-2 rounded-xl"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.submenu.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] text-white/60">
                  <span>{sub.name} ({sub.path})</span>
                  <button type="button" onClick={() => removeSubmenu(idx)} className="text-red-500 hover:text-red-400">
                    <XCircle size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-neon-lime text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-white transition-all">
            {editingId ? 'Update Navigation' : 'Save Navigation'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {navigation.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex items-center justify-between group">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-black rounded-lg border border-white/10 flex items-center justify-center">
                <MenuIcon size={20} className="text-neon-lime" />
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-neon-lime transition-colors">{item.name}</h3>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.path} • Order: {item.order}</p>
                {item.submenu && item.submenu.length > 0 && (
                   <div className="flex items-center gap-2 mt-2">
                     {item.submenu.map((sub, i) => (
                       <span key={i} className="text-[8px] font-black uppercase tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                         {sub.name}
                       </span>
                     ))}
                   </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
               <button 
                 onClick={() => startEdit(item)}
                 className="p-2 text-white/20 hover:text-neon-lime transition-colors"
                >
                 <Edit2 size={18} />
               </button>
               <button 
                 onClick={() => deleteItem(item.id)}
                 className="p-2 text-white/20 hover:text-red-500 transition-colors"
                >
                 <Trash2 size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
