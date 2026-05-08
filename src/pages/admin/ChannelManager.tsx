import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Plus, Trash2, Edit2, CheckCircle, XCircle, Tv } from 'lucide-react';
import { Sport, StreamType } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

export default function ChannelManager() {
  const { channels } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sport: Sport.FOOTBALL,
    country: '',
    logo: '',
    type: StreamType.M3U8,
    source: '',
    status: 'Active'
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        updatedAt: Date.now()
      };

      if (editingId) {
        await updateDoc(doc(db, 'channels', editingId), data);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'channels'), {
          ...data,
          createdAt: Date.now()
        });
      }
      setFormData({ name: '', sport: Sport.FOOTBALL, country: '', logo: '', type: StreamType.M3U8, source: '', status: 'Active' });
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'channels');
    }
  };

  const startEdit = (c: any) => {
    setFormData({
      name: c.name,
      sport: c.sport,
      country: c.country || '',
      logo: c.logo || '',
      type: c.type,
      source: c.source,
      status: c.status || 'Active'
    });
    setEditingId(c.id);
    setIsAdding(true);
  };

  const deleteChannel = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'channels', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `channels/${id}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Manage Channels</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
          className="flex items-center space-x-2 bg-neon-lime text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all"
        >
          {isAdding ? <XCircle size={16} /> : <Plus size={16} />}
          <span>{isAdding ? 'Cancel' : 'Add Channel'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Channel Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0" 
              placeholder="e.g. ESPN HD" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Sport Category</label>
            <select 
              value={formData.sport}
              onChange={(e) => setFormData({...formData, sport: e.target.value as Sport})}
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0"
            >
              {Object.values(Sport).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Country</label>
            <input 
              value={formData.country}
              onChange={(e) => setFormData({...formData, country: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0" 
              placeholder="e.g. Spain" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Logo URL</label>
            <input 
              value={formData.logo}
              onChange={(e) => setFormData({...formData, logo: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0" 
              placeholder="https://..." 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Steam Type</label>
            <select 
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as StreamType})}
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0"
            >
              {Object.values(StreamType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Stream Source (URL/ID/HTML)</label>
            <input 
              required
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0" 
              placeholder="m3u8 url or youtube id" 
            />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-neon-lime text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-white transition-all">
              {editingId ? 'Update Channel' : 'Save Channel'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {channels.map(channel => (
          <div key={channel.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex items-center justify-between group">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-black rounded-lg border border-white/10 flex items-center justify-center p-2">
                {channel.logo && channel.logo.trim() !== '' ? (
                  <img src={channel.logo} alt="" className="w-full h-full object-contain" />
                ) : (
                  <Tv size={20} className="text-white/10" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-white group-hover:text-neon-lime transition-colors">{channel.name}</h3>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{channel.sport} • {channel.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
               <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${channel.status === 'Active' ? 'border-neon-lime/30 text-neon-lime bg-neon-lime/5' : 'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                 {channel.status}
               </span>
               <button 
                 onClick={() => startEdit(channel)}
                 className="p-2 text-white/20 hover:text-neon-lime transition-colors"
                >
                 <Edit2 size={18} />
               </button>
               <button 
                 onClick={() => deleteChannel(channel.id)}
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
