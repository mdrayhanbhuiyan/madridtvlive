import { Mail, MessageSquare, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-6xl font-black uppercase italic tracking-tighter text-neon-lime glow-lime mb-6">Get In Touch</h1>
          <p className="text-white/50 text-lg mb-12 max-w-md">
            Have questions about our streaming service or want to report a technical issue? Our team is here to help 24/7.
          </p>

          <div className="space-y-8">
            <div className="flex items-center space-x-6 group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-blue group-hover:bg-neon-blue group-hover:text-black transition-all">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Email Us</h4>
                <p className="font-bold text-white">support@madridtvlive.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-pink group-hover:bg-neon-pink group-hover:text-black transition-all">
                <MessageSquare size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Live Chat</h4>
                <p className="font-bold text-white">Available on Telegram @MadridTVLive</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 group">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-neon-lime group-hover:bg-neon-lime group-hover:text-black transition-all">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Office</h4>
                <p className="font-bold text-white">Madrid, Spain (Streaming HQ)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 lg:p-12">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Name</label>
                <input type="text" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0 transition-all" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Email</label>
                <input type="email" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0 transition-all" placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Subject</label>
              <input type="text" className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0 transition-all" placeholder="Report a stream" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Message</label>
              <textarea rows={4} className="w-full bg-black border border-white/10 rounded-2xl p-4 text-white focus:border-neon-lime focus:ring-0 transition-all" placeholder="How can we help?" />
            </div>
            <button className="w-full bg-neon-lime text-black font-black uppercase tracking-widest py-4 rounded-2xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
