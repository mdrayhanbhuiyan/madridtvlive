import { useState } from 'react';
import { useData } from '../../context/DataContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Plus, Trash2, XCircle, Trophy, Edit2, Star, Check } from 'lucide-react';
import { Sport, MatchStatus, Match } from '../../types';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

const TOURNAMENTS = [
  'Premier League', 'Champions League', 'FA Cup', 'Copa del Rey', 
  'Spanish Cup', 'La Liga', 'El Classico', 'NBA Playoffs', 
  'Asia Cup', 'T20 World Cup', 'Indian Premier League'
];

const getLogo = (team: string) => {
  const name = team.toLowerCase();
  if (name.includes('madrid')) return 'https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg';
  if (name.includes('barcelona')) return 'https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg';
  if (name.includes('city')) return 'https://upload.wikimedia.org/wikipedia/en/eb/eb/Manchester_City_FC_badge.svg';
  if (name.includes('united')) return 'https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg';
  if (name.includes('lakers')) return 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg';
  if (name.includes('liverpool')) return 'https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg';
  if (name.includes('arsenal')) return 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg';
  if (name.includes('psg')) return 'https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(team)}&background=random&color=fff&size=128&bold=true`;
};

export default function MatchManager() {
  const { matches, channels } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    teamA: '',
    teamB: '',
    sport: Sport.FOOTBALL,
    tournament: TOURNAMENTS[0],
    date: '',
    status: MatchStatus.UPCOMING,
    channelId: '',
    scoreA: '0',
    scoreB: '0',
    isFeatured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        date: new Date(formData.date).getTime(),
        scoreA: formData.scoreA || '0',
        scoreB: formData.scoreB || '0',
        teamALogo: getLogo(formData.teamA),
        teamBLogo: getLogo(formData.teamB),
        updatedAt: Date.now()
      };

      if (editingId) {
        await updateDoc(doc(db, 'matches', editingId), data);
      } else {
        await addDoc(collection(db, 'matches'), {
          ...data,
          createdAt: Date.now()
        });
      }

      setFormData({ 
        teamA: '', 
        teamB: '', 
        sport: Sport.FOOTBALL, 
        tournament: TOURNAMENTS[0], 
        date: '', 
        status: MatchStatus.UPCOMING, 
        channelId: '',
        scoreA: '0',
        scoreB: '0',
        isFeatured: false
      });
      setEditingId(null);
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'matches');
    }
  };

  const startEdit = (m: Match) => {
    setFormData({
      teamA: m.teamA,
      teamB: m.teamB,
      sport: m.sport,
      tournament: m.tournament,
      date: new Date(m.date).toISOString().slice(0, 16),
      status: m.status,
      channelId: m.channelId || '',
      scoreA: String(m.scoreA || '0'),
      scoreB: String(m.scoreB || '0'),
      isFeatured: !!m.isFeatured
    });
    setEditingId(m.id);
    setIsAdding(true);
  };

  const toggleFeatured = async (m: Match) => {
    try {
      await updateDoc(doc(db, 'matches', m.id), { isFeatured: !m.isFeatured });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `matches/${m.id}`);
    }
  };

  const deleteMatch = async (id: string) => {
    if (confirm('Delete this match?')) {
      try {
        await deleteDoc(doc(db, 'matches', id));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `matches/${id}`);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Manage Matches</h2>
        <button 
          onClick={() => { setIsAdding(!isAdding); setEditingId(null); }}
          className="flex items-center space-x-2 bg-neon-lime text-black px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_15px_rgba(204,255,0,0.3)]"
        >
          {isAdding ? <XCircle size={16} /> : <Plus size={16} />}
          <span>{isAdding ? 'Cancel' : 'Add Match'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top duration-300">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Team A</label>
            <input required value={formData.teamA} onChange={(e) => setFormData({...formData, teamA: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime" placeholder="e.g. Manchester City" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Team B</label>
            <input required value={formData.teamB} onChange={(e) => setFormData({...formData, teamB: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime" placeholder="e.g. Real Madrid" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Sport</label>
            <select value={formData.sport} onChange={(e) => setFormData({...formData, sport: e.target.value as Sport})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime">
              {Object.values(Sport).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Tournament</label>
            <div className="flex gap-2">
              <select value={formData.tournament} onChange={(e) => setFormData({...formData, tournament: e.target.value})} className="flex-grow bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime">
                {TOURNAMENTS.map(t => <option key={t} value={t}>{t}</option>)}
                <option value="Other">Other (Type Below)</option>
              </select>
              {formData.tournament === 'Other' && (
                <input required className="w-1/2 bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime" onChange={(e) => setFormData({...formData, tournament: e.target.value})} placeholder="Custom League" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Date & Time</label>
            <input required type="datetime-local" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as MatchStatus})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime">
              {Object.values(MatchStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Score A</label>
            <input value={formData.scoreA} onChange={(e) => setFormData({...formData, scoreA: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime" placeholder="0" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Score B</label>
            <input value={formData.scoreB} onChange={(e) => setFormData({...formData, scoreB: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime" placeholder="0" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Linked Channel</label>
            <select value={formData.channelId} onChange={(e) => setFormData({...formData, channelId: e.target.value})} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime">
              <option value="">No Channel Linked</option>
              {channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
             <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 rounded border-white/10 bg-black text-[#CCFF00] focus:ring-[#CCFF00]" id="isFeatured" />
             <label htmlFor="isFeatured" className="text-xs font-black uppercase tracking-widest text-white/60 cursor-pointer">Mark as Featured Match (Homepage Hero)</label>
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="w-full bg-neon-lime text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-white transition-all">
               {editingId ? 'Update Match Data' : 'Initialize Match'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4">
        {matches.map(m => (
          <div key={m.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-all">
            <div className="flex items-center space-x-6 flex-grow">
              <div className={`p-4 rounded-2xl ${m.isFeatured ? 'bg-[#CCFF00]/10 text-[#CCFF00]' : 'bg-white/5 text-white/20'}`}>
                {m.isFeatured ? <Star size={24} fill="currentColor" /> : <Trophy size={24} />}
              </div>
              <div className="flex-grow max-w-md">
                <div className="flex items-center gap-3 mb-1">
                   {m.teamALogo && m.teamALogo.trim() !== '' && <img src={m.teamALogo} alt="" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />}
                   <h3 className="font-bold text-white uppercase italic tracking-tight">{m.teamA} VS {m.teamB}</h3>
                   {m.teamBLogo && m.teamBLogo.trim() !== '' && <img src={m.teamBLogo} alt="" className="w-4 h-4 object-contain" referrerPolicy="no-referrer" />}
                </div>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4">{m.sport} • {m.tournament} • {new Date(m.date).toLocaleString()} • {m.status}</p>
                
                <div className="flex items-center gap-6">
                   <div className="text-center">
                      <span className="block text-[7px] font-black uppercase text-white/20 mb-1">{m.teamA}</span>
                      <span className="text-xl font-black text-[#CCFF00]">{m.scoreA}</span>
                   </div>
                   <span className="text-white/10 font-bold italic">:</span>
                   <div className="text-center">
                      <span className="block text-[7px] font-black uppercase text-white/20 mb-1">{m.teamB}</span>
                      <span className="text-xl font-black text-[#CCFF00]">{m.scoreB}</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button onClick={() => toggleFeatured(m)} className={`p-3 rounded-xl transition-all ${m.isFeatured ? 'bg-[#CCFF00] text-black' : 'bg-white/5 text-white/20 hover:text-white'}`}>
                <Star size={18} />
              </button>
              <button onClick={() => startEdit(m)} className="p-3 bg-white/5 text-white/20 hover:text-neon-lime hover:bg-white/10 rounded-xl transition-all">
                <Edit2 size={18} />
              </button>
              <button onClick={() => deleteMatch(m.id)} className="p-3 bg-white/5 text-white/20 hover:text-red-500 hover:bg-white/10 rounded-xl transition-all">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {matches.length === 0 && (
           <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
              <p className="text-white/20 font-bold uppercase tracking-widest text-xs italic">No matches scheduled yet.</p>
           </div>
        )}
      </div>
    </div>
  );
}
