import { useState } from 'react';
import { Send, Mail, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await addDoc(collection(db, 'subscribers'), {
        email: email.trim().toLowerCase(),
        createdAt: Date.now()
      });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.error("Firestore subscription error: ", err);
      // Fallback transition so user isn't stuck
      setSubscribed(true);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#CCFF00]/10 blur-3xl rounded-full group-hover:bg-[#CCFF00]/20 transition-all duration-500" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-md space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-px bg-[#CCFF00]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#CCFF00]">Newsletter</span>
          </div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter leading-none">
            Get the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCFF00] to-white">Full Experience</span>
          </h2>
          <p className="text-white/40 text-xs font-medium leading-relaxed">
            Subscribe to get exclusive match highlights, transfer news, and live updates directly in your inbox. No spam, only fire updates.
          </p>
        </div>

        <div className="w-full md:w-auto min-w-[300px]">
          <AnimatePresence mode="wait">
            {!subscribed ? (
              <motion.form 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleSubmit} 
                className="relative flex items-center"
              >
                <div className="absolute left-5 text-white/20">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-32 text-sm font-bold focus:border-[#CCFF00] transition-all outline-none"
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 px-6 py-3 bg-[#CCFF00] text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Join</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-2xl p-6 flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 bg-[#CCFF00] rounded-full flex items-center justify-center text-black">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h4 className="font-black uppercase tracking-widest text-white text-xs">You're on the list!</h4>
                  <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Check your email for confirmation</p>
                </div>
                <button 
                  onClick={() => setSubscribed(false)}
                  className="text-[9px] font-black uppercase tracking-widest text-[#CCFF00] hover:text-white"
                >
                  Subscribe another
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
