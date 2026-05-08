import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, XCircle, Edit2 } from 'lucide-react';
import slugify from 'slugify';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

export default function NewsManager() {
  const { news } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Football',
    image: '',
    content: '',
    status: 'Published'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        slug: slugify(formData.title, { lower: true, strict: true }),
        updatedAt: Date.now()
      };

      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), data);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'news'), {
          ...data,
          publishDate: Date.now(),
          createdAt: Date.now()
        });
      }
      setFormData({ title: '', category: 'Football', image: '', content: '', status: 'Published' });
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'news');
    }
  };

  const startEdit = (n: any) => {
    setFormData({
      title: n.title,
      category: n.category,
      image: n.image,
      content: n.content,
      status: n.status || 'Published'
    });
    setEditingId(n.id);
    setIsAdding(true);
  };

  const deletePost = async (id: string) => {
    if (confirm('Delete this article?')) {
      try {
        await deleteDoc(doc(db, 'news', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `news/${id}`);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Manage News</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); }} 
          className="flex items-center space-x-2 bg-neon-blue text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(0,210,255,0.3)]"
        >
          {isAdding ? <XCircle size={16} /> : <Plus size={16} />}
          <span>{isAdding ? 'Cancel' : 'Add Post'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Article Title</label>
              <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:border-neon-blue transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Category</label>
              <input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:border-neon-blue transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Image URL</label>
            <input required value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:border-neon-blue transition-colors" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Content</label>
            <textarea required rows={6} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white placeholder-white/20 focus:border-neon-blue transition-colors" />
          </div>
          <button type="submit" className="w-full bg-neon-blue text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-white transition-all">
            {editingId ? 'Update Article' : 'Publish Article'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {news.map(n => (
          <div key={n.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-white/10 transition-all group">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-14 rounded-lg overflow-hidden bg-black flex-shrink-0">
                {n.image && n.image.trim() !== '' ? (
                  <img src={n.image} alt="" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                    <span className="text-[10px] text-white/10 font-bold">NO IMG</span>
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-neon-blue transition-colors">{n.title}</h4>
                <p className="text-[10px] text-white/20 uppercase font-black tracking-widest mt-1">{n.category} • {new Date(n.publishDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button onClick={() => startEdit(n)} className="p-2 text-white/20 hover:text-neon-blue transition-colors bg-white/5 rounded-lg">
                <Edit2 size={16} />
              </button>
              <button onClick={() => deletePost(n.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors bg-white/5 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
             <p className="text-white/20 font-bold uppercase tracking-widest text-xs italic">No news articles published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
