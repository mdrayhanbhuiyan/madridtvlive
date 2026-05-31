import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, doc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { Trash2, Search, Mail, Send, Users, Calendar, Sparkles, Check } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<{ id: string; email: string; createdAt: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Newsletter composer state
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Load subscribers list
  useEffect(() => {
    const q = query(collection(db, 'subscribers'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as { id: string; email: string; createdAt: number }[];
      setSubscribers(list);
      setLoading(false);
    }, (err) => {
      console.error(err);
      handleFirestoreError(err, OperationType.LIST, 'subscribers');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to remove subscriber "${email}"?`)) return;
    try {
      await deleteDoc(doc(db, 'subscribers', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `subscribers/${id}`);
    }
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setIsSending(true);
    setSendSuccess(false);

    try {
      // Record broadcast log in Firestore
      await addDoc(collection(db, 'newsletter_broadcasts'), {
        subject,
        message,
        recipientCount: subscribers.length,
        sentAt: Date.now()
      });

      setSendSuccess(true);
      setSubject('');
      setMessage('');
      setTimeout(() => setSendSuccess(false), 4000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'newsletter_broadcasts');
    } finally {
      setIsSending(false);
    }
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex items-center space-x-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Users size={100} />
          </div>
          <div className="w-16 h-16 bg-neon-lime/10 border border-neon-lime/20 rounded-2xl flex items-center justify-center text-neon-lime">
            <Users size={28} />
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{subscribers.length}</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Total Email Subscribers</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-3xl p-6 flex items-center space-x-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Mail size={100} />
          </div>
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
            <Mail size={28} />
          </div>
          <div>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Active</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mt-1">Newsletter Broadcast Status</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Subscriber List */}
        <div className="lg:col-span-5 bg-zinc-900 border border-white/10 rounded-3xl p-6 flex flex-col h-[550px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-[#CCFF00]">Subscribers List</h3>
            <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">{filteredSubscribers.length} Emails</span>
          </div>

          <div className="relative mb-4">
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black border border-white/5 rounded-2xl py-3 pl-10 pr-4 text-xs text-white focus:border-neon-lime placeholder:text-white/20 transition-all font-bold" 
              placeholder="Search subscribers..." 
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          </div>

          <div className="flex-grow overflow-y-auto pr-1 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-6 h-6 border-2 border-neon-lime border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filteredSubscribers.length > 0 ? (
              filteredSubscribers.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 hover:border-white/10 rounded-2xl group transition-all">
                  <div className="overflow-hidden pr-2">
                    <p className="text-xs font-bold text-white truncate">{sub.email}</p>
                    <p className="text-[8px] font-bold text-white/20 flex items-center gap-1 uppercase tracking-wider mt-0.5">
                      <Calendar size={10} />
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDelete(sub.id, sub.email)}
                    className="p-2 text-white/30 hover:text-red-500 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Delete subscriber"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-white/20 uppercase tracking-widest text-xs font-bold gap-2">
                <Users size={20} />
                <span>No Subscribers Found</span>
              </div>
            )}
          </div>
        </div>

        {/* Compose Area */}
        <form onSubmit={handleBroadcast} className="lg:col-span-7 bg-zinc-900 border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-pink-500">Send Email Broadcast</h3>
              <span className="bg-pink-500/10 border border-pink-500/20 text-pink-500 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded">Newsletter Campaign</span>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Email Subject</label>
                <input 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-2xl p-4 text-white focus:border-pink-500 focus:ring-0 text-xs font-bold transition-all" 
                  placeholder="e.g. 🔴 Real Madrid vs Milan - Streaming Link & Team News!" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Newsletter HTML/Text Content</label>
                <textarea 
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-64 bg-black border border-white/5 rounded-2xl p-4 text-white focus:border-pink-500 focus:ring-0 text-xs font-medium leading-relaxed font-mono transition-all" 
                  placeholder="Dear sports fan,&#10;&#10;Here are tonight's premium fixtures and full live streaming access links. Stay tuned on Madrid TV Live!&#10;&#10;Best,&#10;MTVL Team" 
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            {sendSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl p-4 flex items-center gap-3 mb-4 animate-in slide-in-from-bottom duration-300">
                <div className="w-5 h-5 rounded-full bg-green-500 text-black flex items-center justify-center">
                  <Check size={14} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-wider">Broadcast Sent Successfully!</p>
                   <p className="text-[9px] font-bold text-white/40 uppercase">Sent to {subscribers.length} registered subscribers.</p>
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isSending || subscribers.length === 0}
              className="w-full bg-pink-500 hover:bg-white text-black hover:text-black font-black uppercase tracking-widest py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={15} />
                  <span>Send Broadcast to {subscribers.length} Fans</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
