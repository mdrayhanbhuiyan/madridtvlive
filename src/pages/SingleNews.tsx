import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { NewsPost, AdConfig } from '../types';
import { Calendar, Tag, ChevronRight, Share2, Facebook, Twitter, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import AdArea from '../components/ads/AdArea';
import Newsletter from '../components/widgets/Newsletter';

export default function SingleNews() {
  const { slug } = useParams();
  const [article, setArticle] = useState<NewsPost | null>(null);
  const [ads, setAds] = useState<AdConfig | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch article
        const newsQ = query(collection(db, 'news'), where('slug', '==', slug), limit(1));
        const newsSnap = await getDocs(newsQ);
        
        if (newsSnap.empty) {
          setLoading(false);
          return;
        }

        const newsData = { id: newsSnap.docs[0].id, ...newsSnap.docs[0].data() } as NewsPost;
        setArticle(newsData);

        // Fetch Ads
        const adsQ = query(collection(db, 'adConfigs'), limit(1));
        const adsSnap = await getDocs(adsQ);
        let adSlots = null;
        if (!adsSnap.empty) {
          adSlots = adsSnap.docs[0].data() as AdConfig;
          setAds(adSlots);
        }

        // Call backend to inject ads
        const response = await fetch('/api/news/inject-ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newsData.content, ads: adSlots }),
        });
        const { content: adInjectedContent } = await response.json();
        setContent(adInjectedContent);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (loading) return <div className="min-h-screen pt-40 text-center"><div className="w-12 h-12 border-4 border-[#CCFF00] border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  if (!article) return <div className="min-h-screen pt-40 text-center text-white/40">Article not found.</div>;

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Top Banner Ad */}
      <AdArea placement="NewsTop" className="max-w-4xl mx-auto mt-8 mb-8" />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        {article.image && article.image.trim() !== '' ? (
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
            <span className="text-white/10 font-black italic text-4xl">MADRID TV</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-20">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-2">
               <span className="bg-[#CCFF00] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{article.category}</span>
               {article.isFeatured && (
                 <span className="bg-white/10 backdrop-blur-md text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">Featured</span>
               )}
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase italic leading-[0.9] tracking-tighter shadow-black drop-shadow-2xl">{article.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/60 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><Calendar size={14} className="text-[#CCFF00]" /> {format(article.publishDate, 'MMMM dd, yyyy')}</span>
              <span className="flex items-center gap-2"><Tag size={14} className="text-[#CCFF00]" /> {article.tags?.join(', ')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-4 gap-12 mt-12">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-900 border border-white/5 rounded-[40px] p-8 md:p-12">
            <div 
              className="prose prose-invert max-w-none prose-h2:text-2xl prose-h2:font-black prose-h2:uppercase prose-h2:italic prose-h2:tracking-tight prose-p:text-white/70 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            
            {/* Conclusion / Ad */}
            <div className="mt-12 pt-12 border-t border-white/5">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex gap-4">
                      <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-all cursor-pointer"><Facebook size={20} /></button>
                      <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-all cursor-pointer"><Twitter size={20} /></button>
                      <button className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-all cursor-pointer"><Share2 size={20} /></button>
                   </div>
                   <button className="flex items-center gap-2 text-[10px] font-black uppercase text-white/40 hover:text-white"><MessageSquare size={16} /> Comments (0)</button>
                </div>
            </div>
          </div>

          {/* Footer Ad */}
          {ads?.footer && (
            <div className="mt-12 text-center" dangerouslySetInnerHTML={{ __html: ads.footer }} />
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
           {/* Sidebar Ad */}
           <AdArea placement="Sidebar" className="bg-zinc-900 rounded-3xl p-4 border border-white/5 overflow-hidden" />

           <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6">
              <h3 className="text-lg font-black uppercase tracking-tighter italic mb-6">Trending Topics</h3>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase">
                 {['#RealMadrid', '#TransferRumors', '#ChampionsLeague', '#Bellingham', '#LaLiga', '#WorldCup'].map(topic => (
                   <span key={topic} className="px-3 py-2 bg-white/5 rounded-lg border border-white/5 hover:border-[#CCFF00]/40 transition-colors cursor-pointer">{topic}</span>
                 ))}
              </div>
           </div>

           <Newsletter />
        </aside>
      </div>
    </div>
  );
}
