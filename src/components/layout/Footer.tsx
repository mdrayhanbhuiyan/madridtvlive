import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-auto md:h-12 bg-[#0A0A0A] border-t border-white/10 flex flex-col md:flex-row items-center justify-between px-6 py-4 md:py-0 text-[10px] text-white/40 font-medium space-y-4 md:space-y-0">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
        <p>© 2024 MADRID TV LIVE • Watch Live Sports Anytime</p>
        <nav className="flex gap-4">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/dmca" className="hover:text-white transition-colors">DMCA Notice</Link>
          <Link to="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
        </nav>
      </div>
      <div className="flex gap-4 items-center">
         <div className="flex gap-2">
            <a href="#" className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-colors">f</a>
            <a href="#" className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-colors">x</a>
            <a href="#" className="w-5 h-5 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#CCFF00] hover:text-black transition-colors">t</a>
         </div>
         <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-green-500 uppercase tracking-widest font-black text-[8px]">All Streams Operational</span>
         </div>
      </div>
    </footer>
  );
}
