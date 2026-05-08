import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, limit, getDocs, doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';
import { Save, Info, Layout, Newspaper } from 'lucide-react';

export default function NewsAdManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ads, setAds] = useState({
    topBanner: '',
    insideArticle1: '',
    insideArticle2: '',
    sidebar: '',
    footer: ''
  });

  useEffect(() => {
    async function fetchAds() {
      try {
        const q = query(collection(db, 'adConfigs'), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setAds({
            topBanner: data.topBanner || '',
            insideArticle1: data.insideArticle1 || '',
            insideArticle2: data.insideArticle2 || '',
            sidebar: data.sidebar || '',
            footer: data.footer || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // We use a fixed ID 'global' for the main config
      await setDoc(doc(db, 'adConfigs', 'global'), {
        ...ads,
        updatedAt: Date.now()
      });
      alert('Ad configurations saved!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'adConfigs');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-20 text-center"><div className="w-8 h-8 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div className="flex flex-col">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">News Ad Placement</h2>
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <Info size={12} /> Manage ads for news pages only
            </p>
         </div>
         <button 
           onClick={handleSave}
           disabled={saving}
           className="flex items-center gap-2 bg-neon-lime text-black px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(204,255,0,0.2)]"
         >
           {saving ? <Save className="animate-spin" size={16} /> : <Save size={16} />}
           Save Placements
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
               <div className="flex items-center gap-3 text-[#CCFF00]">
                  <Layout size={20} />
                  <h3 className="text-xs font-black uppercase tracking-widest">Main Placements</h3>
               </div>
               
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Top Banner (Header)</label>
                     <textarea 
                        value={ads.topBanner} 
                        onChange={e => setAds({...ads, topBanner: e.target.value})}
                        className="w-full h-24 bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-mono text-white/60 focus:border-neon-lime" 
                        placeholder="Paste your ad code here..."
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Sidebar Slot</label>
                     <textarea 
                        value={ads.sidebar} 
                        onChange={e => setAds({...ads, sidebar: e.target.value})}
                        className="w-full h-24 bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-mono text-white/60 focus:border-neon-lime" 
                        placeholder="Paste your ad code here..."
                     />
                  </div>
               </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
               <div className="flex items-center gap-3 text-blue-400">
                  <Newspaper size={20} />
                  <h3 className="text-xs font-black uppercase tracking-widest">In-Article Automation</h3>
               </div>
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Inside Article 1 (Top)</label>
                     <textarea 
                        value={ads.insideArticle1} 
                        onChange={e => setAds({...ads, insideArticle1: e.target.value})}
                        className="w-full h-24 bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-mono text-white/60 focus:border-neon-lime" 
                        placeholder="Placed after 2nd paragraph..."
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Inside Article 2 (Middle)</label>
                     <textarea 
                        value={ads.insideArticle2} 
                        onChange={e => setAds({...ads, insideArticle2: e.target.value})}
                        className="w-full h-24 bg-black border border-white/10 rounded-2xl p-4 text-[10px] font-mono text-white/60 focus:border-neon-lime" 
                        placeholder="Placed in the middle of content..."
                     />
                  </div>
               </div>
            </div>
         </div>

         <div className="bg-zinc-950/50 border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-48 h-80 bg-white/5 rounded-2xl border border-white/10 relative p-4 space-y-3 opacity-40">
               <div className="h-4 w-full bg-white/10 rounded" />
               <div className="h-10 w-full bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-lg flex items-center justify-center text-[6px] font-bold text-[#CCFF00]/40 uppercase tracking-widest">Ad Slot: Top</div>
               <div className="h-2 w-3/4 bg-white/5 rounded" />
               <div className="h-2 w-full bg-white/5 rounded" />
               <div className="h-2 w-1/2 bg-white/5 rounded" />
               <div className="h-16 w-full bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-[6px] font-bold text-blue-500/40 uppercase tracking-widest">Ad Slot: Middleware</div>
               <div className="h-2 w-full bg-white/5 rounded" />
               <div className="h-2 w-2/3 bg-white/5 rounded" />
            </div>
            <h4 className="text-sm font-black uppercase tracking-widest text-white/20 mt-8">Ad Visualization Mode</h4>
            <p className="text-[10px] text-white/10 mt-2 max-w-[200px]">Ads will be automatically injected into your generated articles based on these placements.</p>
         </div>
      </div>
    </div>
  );
}
