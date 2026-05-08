import { useData } from '../context/DataContext';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ChevronRight, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function News() {
  const { category } = useParams();
  const { news, loading } = useData();

  const filteredNews = category 
    ? news.filter(n => n.category.toLowerCase() === category.toLowerCase())
    : news;

  const featured = filteredNews[0];
  const listNews = filteredNews.slice(1);

  if (loading) return <div className="flex-grow flex items-center justify-center pt-20"><div className="w-12 h-12 border-4 border-neon-lime border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="flex-grow max-w-7xl mx-auto px-6 py-12">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-5xl font-black uppercase italic tracking-tighter glow-lime leading-tight">
             {category ? `${category} News` : 'Global Sports Feed'}
           </h1>
           <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Intelligence Driven Journalism • Madrid TV Live</p>
        </div>
        {!category && (
           <div className="flex gap-2">
              {['Football', 'Cricket', 'NBA', 'Tennis', 'Racing'].map(c => (
                <Link key={c} to={`/news/category/${c}`} className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-white/20 transition-all">{c}</Link>
              ))}
           </div>
        )}
      </header>

      {/* Featured News */}
      {featured && !category && (
         <Link to={`/news/${featured.slug}`} className="block group mb-16">
            <div className="relative h-[500px] rounded-[3rem] overflow-hidden border border-white/10">
               {featured.image && featured.image.trim() !== '' ? (
                 <img src={featured.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt="" />
               ) : (
                 <div className="w-full h-full bg-zinc-900" />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
               <div className="absolute bottom-0 left-0 p-12 max-w-3xl">
                  <span className="bg-[#CCFF00] text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">{featured.category}</span>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase leading-none tracking-tighter drop-shadow-2xl">{featured.title}</h2>
                  <p className="text-white/60 text-sm mt-4 line-clamp-2 max-w-xl font-bold uppercase tracking-tight">{featured.excerpt}</p>
               </div>
            </div>
         </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {(category ? filteredNews : listNews).map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group flex flex-col md:flex-row gap-8 items-start"
            >
              <Link to={`/news/${post.slug}`} className="w-full md:w-64 lg:w-80 aspect-[16/10] shrink-0 rounded-3xl overflow-hidden border border-white/5 relative">
                {post.image && post.image.trim() !== '' ? (
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full bg-zinc-900" />
                )}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest text-white/60 border border-white/10">{post.category}</div>
              </Link>
              <div className="flex flex-col py-2">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} /> {format(post.publishDate, 'MMM dd, yyyy')}</span>
                </div>
                <Link to={`/news/${post.slug}`}>
                   <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white mb-2 group-hover:text-neon-lime transition-colors leading-tight italic">{post.title}</h2>
                </Link>
                <p className="text-white/40 text-xs font-medium line-clamp-2 mb-4 leading-relaxed">{post.excerpt || 'Read the full analysis and report of this sports event...'}</p>
                <Link to={`/news/${post.slug}`} className="flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-[#CCFF00] hover:translate-x-2 transition-transform">
                  Full Access <ChevronRight size={12} />
                </Link>
              </div>
            </motion.article>
          ))}
          {filteredNews.length === 0 && (
            <div className="py-40 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem]">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white/10">No Intelligence Data Found</h3>
               <Link to="/news" className="mt-4 text-[10px] font-bold uppercase text-neon-lime hover:underline">Back to Archive</Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
           <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-black uppercase tracking-tighter italic mb-8 flex items-center gap-3">
                <TrendingUp size={20} className="text-red-500" /> Viral Feed
              </h3>
              <div className="space-y-8">
                 {news.slice(0, 3).map((n, i) => (
                    <Link key={n.id} to={`/news/${n.slug}`} className="flex gap-4 group">
                       <span className="text-2xl font-black text-white/5 group-hover:text-[#CCFF00]/20 transition-colors">0{i+1}</span>
                       <div>
                          <h4 className="text-xs font-black uppercase leading-tight tracking-tight text-white/80 group-hover:text-white transition-colors">{n.title}</h4>
                          <span className="text-[8px] font-black uppercase text-[#CCFF00]/40 mt-1 block">{n.category}</span>
                       </div>
                    </Link>
                 ))}
              </div>
           </div>

           <div className="rounded-[2.5rem] bg-gradient-to-br from-neon-lime to-blue-500 p-1">
              <div className="bg-black rounded-[2.4rem] p-8 h-full">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none mb-4 text-white">Ad Space Available</h3>
                 <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-6">Reach 2M+ Monthly Viewers</p>
                 <button className="w-full bg-white text-black py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform">Inquire Now</button>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
