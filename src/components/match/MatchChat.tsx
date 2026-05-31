import { useState, useEffect, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';
import { Send, Trash2, LogIn, User, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface MatchChatProps {
  matchId: string;
  teamA: string;
  teamB: string;
}

interface ChatMessage {
  id: string;
  username: string;
  text: string;
  userId: string;
  userAvatar?: string;
  timestamp: number;
  isAdmin?: boolean;
}

export default function MatchChat({ matchId, teamA, teamB }: MatchChatProps) {
  const { user, isAdmin, login } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Guest settings - Load or generate a casual Fan Nickname if not logged in
  const [guestName, setGuestName] = useState(() => {
    const saved = localStorage.getItem('match_chat_guest_name');
    if (saved) return saved;
    const randomId = Math.floor(1000 + Math.random() * 9000);
    return `Fan_${randomId}`;
  });
  const [isEditingGuestName, setIsEditingGuestName] = useState(false);
  const [tempGuestName, setTempGuestName] = useState(guestName);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    chatEndRef.current?.scrollIntoView({ behavior });
  };

  // Real-time listener for chat messages
  useEffect(() => {
    if (!matchId) return;

    setLoading(true);
    const messagesCollection = collection(db, 'matches', matchId, 'chat');
    const q = query(messagesCollection, orderBy('timestamp', 'asc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      
      setMessages(chatList);
      setLoading(false);
      
      // Use a tiny timeout to ensure DOM updating is done before scrolling
      setTimeout(() => scrollToBottom('smooth'), 100);
    }, (error) => {
      console.error("Match chat listener error:", error);
      handleFirestoreError(error, OperationType.LIST, `matches/${matchId}/chat`);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [matchId]);

  // Handle saving guest nickname
  const saveGuestName = () => {
    const trimmed = tempGuestName.trim();
    if (trimmed.length > 0 && trimmed.length <= 25) {
      setGuestName(trimmed);
      localStorage.setItem('match_chat_guest_name', trimmed);
      setIsEditingGuestName(false);
    }
  };

  // Handle submitting a chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = inputText.trim();
    if (!textToSend || isSending) return;

    setIsSending(true);

    try {
      const messagePayload = {
        username: user?.displayName || guestName,
        text: textToSend,
        userId: user?.uid || 'guest',
        userAvatar: user?.photoURL || '',
        timestamp: Date.now(),
        isAdmin: isAdmin ? true : false
      };

      const messagesCollection = collection(db, 'matches', matchId, 'chat');
      await addDoc(messagesCollection, messagePayload);
      
      setInputText('');
    } catch (error) {
      console.error("Failed to post message:", error);
      handleFirestoreError(error, OperationType.CREATE, `matches/${matchId}/chat`);
    } finally {
      setIsSending(false);
    }
  };

  // Handle moderator/admin message deletion
  const handleDeleteMessage = async (messageId: string) => {
    if (!isAdmin) return;
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const messageRef = doc(db, 'matches', matchId, 'chat', messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Failed to delete message:", error);
      handleFirestoreError(error, OperationType.DELETE, `matches/${matchId}/chat/${messageId}`);
    }
  };

  return (
    <div className="flex flex-col h-[550px] bg-black/40 border border-white/5 rounded-3xl overflow-hidden glass-card">
      {/* Header section with instructions/branding */}
      <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
          <h3 className="text-xs font-black uppercase tracking-widest text-[#CCFF00]">
            Live Fan Room
          </h3>
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wide">
            ({messages.length} comments)
          </span>
        </div>
        
        {/* Support Banner / Match context */}
        <div className="text-[9px] font-bold text-white/30 truncate uppercase max-w-[200px]">
          {teamA} vs {teamB} Discussion
        </div>
      </div>

      {/* Guest Name customization drawer/panel */}
      {!user && (
        <div className="px-4 py-2 bg-[#CCFF00]/5 border-b border-[#CCFF00]/10 flex items-center justify-between text-[11px] font-medium text-white/90">
          <div className="flex items-center gap-1.5 truncate">
            <User size={12} className="text-[#CCFF00]" />
            {isEditingGuestName ? (
              <input
                type="text"
                value={tempGuestName}
                onChange={(e) => setTempGuestName(e.target.value)}
                maxLength={25}
                className="bg-black/80 border border-[#CCFF00]/30 outline-none rounded px-2 py-0.5 text-xs text-white max-w-[120px] font-bold"
                onKeyDown={(e) => e.key === 'Enter' && saveGuestName()}
                autoFocus
              />
            ) : (
              <span>
                Chatting as: <strong className="text-[#CCFF00] font-black">{guestName}</strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditingGuestName ? (
              <button 
                onClick={saveGuestName}
                className="text-neon-lime hover:underline font-bold uppercase text-[9px] tracking-wider"
              >
                Save
              </button>
            ) : (
              <button 
                onClick={() => {
                  setTempGuestName(guestName);
                  setIsEditingGuestName(true);
                }}
                className="text-white/50 hover:text-white hover:underline text-[9px] font-bold tracking-widest uppercase"
              >
                Change Name
              </button>
            )}
            <span className="text-white/20">|</span>
            <button 
              onClick={login}
              className="font-black text-[#CCFF00] hover:underline flex items-center gap-1 text-[9px] tracking-wider uppercase"
            >
              <LogIn size={10} /> Google LogIn
            </button>
          </div>
        </div>
      )}

      {/* Message List area */}
      <div 
        ref={messageContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <div className="w-6 h-6 border-2 border-[#CCFF00] border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Syncing chat room...</p>
          </div>
        ) : messages.length > 0 ? (
          <AnimatePresence initial={false}>
            {messages.map((message) => {
              const isCurrentUser = user ? message.userId === user.uid : message.userId === 'guest' && message.username === guestName;
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-2xl p-3 relative group transition-all",
                    message.isAdmin 
                      ? "bg-neon-lime/5 border border-neon-lime/20 self-start text-[#CCFF00]"
                      : isCurrentUser
                        ? "bg-white/10 border border-white/10 self-end text-white ml-auto rounded-tr-sm"
                        : "bg-white/5 border border-white/5 self-start text-white/80 rounded-tl-sm"
                  )}
                >
                  {/* Sender Name and Badge */}
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    {message.userAvatar ? (
                      <img 
                        src={message.userAvatar} 
                        referrerPolicy="no-referrer"
                        className="w-3.5 h-3.5 rounded-full object-cover border border-white/10" 
                        alt="" 
                      />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold">
                        {message.username[0].toUpperCase()}
                      </div>
                    )}
                    
                    <span className={cn(
                      "text-[10px] font-black tracking-tight",
                      message.isAdmin ? "text-neon-lime" : "text-white/90"
                    )}>
                      {message.username}
                    </span>

                    {message.isAdmin && (
                      <span className="inline-flex items-center gap-0.5 bg-neon-lime text-black text-[7px] font-black uppercase tracking-wider px-1 rounded">
                        <ShieldCheck size={8} /> Admin
                      </span>
                    )}

                    {isCurrentUser && (
                      <span className="text-[8px] text-[#CCFF00]/60 font-black tracking-widest uppercase">
                        (You)
                      </span>
                    )}
                  </div>

                  {/* Message Body */}
                  <p className={cn(
                    "text-xs leading-relaxed break-words font-medium",
                    message.isAdmin ? "text-white font-semibold" : ""
                  )}>
                    {message.text}
                  </p>

                  {/* Floating Action / Timestamp panel */}
                  <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/5">
                    <span className="text-[8px] text-white/30 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Clock size={8} />
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Admin self moderation deletion interface */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="p-1 text-white/20 hover:text-red-500 rounded hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100 absolute -right-8 top-1/2 -translate-y-1/2 bg-black border border-white/10 shrink-0"
                        title="Delete comment"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 border border-dashed border-white/5 rounded-2xl gap-2">
            <Sparkles className="text-neon-lime opacity-30 animate-pulse" size={24} />
            <h4 className="text-xs font-black uppercase tracking-widest text-[#CCFF00]">
              Welcome to the Fan Room
            </h4>
            <p className="text-[10px] text-white/35 font-bold uppercase max-w-[200px] leading-relaxed">
              Be the first to claim victory! Support your squad by dropping a match comment.
            </p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Message box footer */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white/5 border-t border-white/10 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Send match comment (max 300 chars)..."
          maxLength={300}
          required
          className="flex-grow bg-black border border-white/5 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-white/20 outline-none focus:border-neon-lime focus:ring-1 focus:ring-neon-lime font-bold transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isSending}
          className="bg-neon-lime hover:bg-white text-black p-3.5 rounded-2xl transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed group"
          title="Send comment"
        >
          {isSending ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Send size={13} className="group-hover:scale-110 transition-transform" />
          )}
        </button>
      </form>
    </div>
  );
}
