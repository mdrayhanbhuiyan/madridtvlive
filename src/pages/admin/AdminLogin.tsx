import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShieldCheck, LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const { user, isAdmin, login, loading } = useAuth();

  if (loading) return null;
  if (user && isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <div className="flex-grow flex items-center justify-center p-4 bg-[radial-gradient(circle_at_center,_var(--color-neon-lime)_0%,_transparent_100%)] bg-opacity-5">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-[3rem] p-12 text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-neon-lime rounded-3xl flex items-center justify-center text-black mx-auto mb-8 shadow-[0_0_30px_rgba(204,255,0,0.3)]">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl font-black uppercase italic tracking-tighter glow-lime mb-2">Admin Access</h1>
        <p className="text-white/40 text-sm font-medium uppercase tracking-widest mb-12">Authorized Personnel Only</p>

        {user && !isAdmin && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-bold uppercase tracking-widest">
            Access Denied: Your account is not an admin.
          </div>
        )}

        <button 
          onClick={login}
          className="w-full group flex items-center justify-center space-x-4 bg-white text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-neon-lime transition-all"
        >
          <LogIn size={20} />
          <span>Sign In with Google</span>
        </button>

        <p className="mt-8 text-[10px] text-white/20 uppercase font-black">
          Madrid TV Live Security Protocol v4.2
        </p>
      </motion.div>
    </div>
  );
}
