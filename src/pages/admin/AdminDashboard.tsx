import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { 
  Tv, Trophy, Award, Newspaper, Layout, DollarSign, Settings, 
  LogOut, Plus, Edit2, Trash2, CheckCircle, XCircle, Database, Brain, Search
} from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';
import ChannelManager from './ChannelManager';
import MatchManager from './MatchManager';
import HighlightManager from './HighlightManager';
import NewsManager from './NewsManager';
import AINewsLab from './AINewsLab';
import NewsAdManager from './NewsAdManager';
import WidgetManager from './WidgetManager';
import AdManager from './AdManager';

export default function AdminDashboard() {
  const { user, isAdmin, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('channels');

  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/admin/login" />;

  const tabs = [
    { id: 'channels', name: 'Channels', icon: Tv },
    { id: 'matches', name: 'Matches', icon: Trophy },
    { id: 'highlights', name: 'Highlights', icon: Award },
    { id: 'news', name: 'News List', icon: Newspaper },
    { id: 'ai-lab', name: 'AI News Lab', icon: Brain },
    { id: 'news-ads', name: 'News Ads', icon: DollarSign },
    { id: 'widgets', name: 'Widgets', icon: Layout },
    { id: 'ads', name: 'Platform Ads', icon: DollarSign },
  ];

  const seedData = async () => {
    if (!confirm('This will add demo matches, highlights, and news articles. Continue?')) return;
    try {
      // Demo Matches
      await addDoc(collection(db, 'matches'), {
        teamA: 'Real Madrid', teamB: 'Man City', sport: 'Football',
        tournament: 'Champions League', date: Date.now() + 86400000,
        status: 'Upcoming', scoreA: '0', scoreB: '0'
      });
      await addDoc(collection(db, 'matches'), {
        teamA: 'Lakers', teamB: 'Warriors', sport: 'Basketball',
        tournament: 'NBA Playoffs', date: Date.now(),
        status: 'Live', scoreA: '112', scoreB: '108'
      });

      // Demo Highlights
      await addDoc(collection(db, 'highlights'), {
        title: 'Bellingham Last Minute Winner vs Barca',
        category: 'La Liga',
        thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '10:45',
        createdAt: Date.now()
      });
      await addDoc(collection(db, 'highlights'), {
        title: 'Steph Curry 50 Point Masterclass',
        category: 'NBA',
        thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '15:20',
        createdAt: Date.now() - 3600000
      });
      await addDoc(collection(db, 'highlights'), {
        title: 'Champions League Final Best Saves',
        category: 'Champions League',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?auto=format&fit=crop&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: '08:15',
        createdAt: Date.now() - 7200000
      });

      // Demo News
      await addDoc(collection(db, 'news'), {
        title: 'Mbappe Announces Future Plans',
        category: 'Transfer News',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80',
        content: 'The saga ends as Mbappe finally speaks on his move to Madrid...',
        publishDate: Date.now()
      });
      await addDoc(collection(db, 'news'), {
        title: 'New Stadium Renovation Plans Leaked',
        category: 'Infrastructure',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80',
        content: 'Architecture fans are excited about the new eco-friendly design...',
        publishDate: Date.now() - 86400000
      });
      await addDoc(collection(db, 'news'), {
        title: 'Formula 1: Hamilton Leads Practice',
        category: 'Racing',
        image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&q=80',
        content: 'Lewis Hamilton shows dominant pace in the first practice session...',
        publishDate: Date.now() - 172800000
      });

      alert('Demo data populated!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'seed');
    }
  };

  return (
    <div className="flex-grow flex h-screen overflow-hidden bg-black">
      {/* Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-white/5 flex flex-col">
        <div className="p-8">
          <div className="text-xl font-black tracking-tighter text-neon-lime glow-lime italic mb-1">
            MTVL ADMIN
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/20">Control Center</span>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all text-sm font-bold uppercase tracking-widest ${
                activeTab === tab.id 
                  ? 'bg-neon-lime text-black shadow-[0_0_15px_rgba(204,255,0,0.2)]' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center space-x-3 mb-6">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                {user.displayName?.[0] || 'A'}
              </div>
            )}
            <div className="overflow-hidden">
               <p className="text-xs font-bold truncate text-white">{user.displayName}</p>
               <p className="text-[10px] text-white/30 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 bg-white/5 hover:bg-red-600/20 hover:text-red-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow overflow-y-auto p-12 bg-[radial-gradient(circle_at_top_right,_var(--color-neon-lime)_0%,_transparent_100%)] bg-opacity-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
              Manage <span className="text-neon-lime">{activeTab}</span>
            </h1>
            <button 
              onClick={seedData}
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <Database size={12} />
              Seed Demo Data
            </button>
          </div>
          
          {activeTab === 'channels' && <ChannelManager />}
          {activeTab === 'matches' && <MatchManager />}
          {activeTab === 'highlights' && <HighlightManager />}
          {activeTab === 'news' && <NewsManager />}
          {activeTab === 'ai-lab' && <AINewsLab />}
          {activeTab === 'news-ads' && <NewsAdManager />}
          {activeTab === 'widgets' && <WidgetManager />}
          {activeTab === 'ads' && <AdManager />}
        </div>
      </main>
    </div>
  );
}
