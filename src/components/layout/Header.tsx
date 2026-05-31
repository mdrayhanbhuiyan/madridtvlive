import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X, Tv, ShieldCheck, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { navigation } = useData();
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const defaultNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'Live TV', path: '/live-tv' },
    { name: 'Live Score', path: '/live-score' },
    { name: 'Schedule', path: '/schedule' },
    { 
      name: 'Football', 
      path: '/football',
      submenu: [
        { name: 'Worldcup 2026', path: '/football/worldcup-2026' }
      ]
    },
    { name: 'Cricket', path: '/cricket' },
    { name: 'NBA', path: '/nba' },
    { name: 'Tennis', path: '/tennis' },
    { name: 'Highlights', path: '/highlights' },
    { name: 'News', path: '/news' },
    { name: 'Contact', path: '/contact' },
  ];

  const navLinks = navigation.length > 0 ? navigation : defaultNavLinks;

  return (
    <>
      <header className="sticky top-0 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-white/10 bg-[#0A0A0A] z-50">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link to="/" className="text-[#CCFF00] font-black text-2xl tracking-tighter flex items-center gap-1">
            MADRID TV <span className="text-white italic">LIVE</span>
          </Link>
          <nav className="hidden lg:flex gap-5 text-sm font-medium text-white/70">
            {navLinks.map((link) => (
              <div 
                key={link.name} 
                className="relative group"
                onMouseEnter={() => link.submenu && setOpenSubmenu(link.name)}
                onMouseLeave={() => setOpenSubmenu(null)}
              >
                <Link
                  to={link.path}
                  className={cn(
                    "hover:text-white transition-colors uppercase tracking-widest text-[11px] flex items-center gap-1 py-4",
                    location.pathname === link.path && "text-[#CCFF00] underline underline-offset-4"
                  )}
                >
                  {link.name}
                  {link.submenu && <ChevronDown size={12} className={cn("transition-transform", openSubmenu === link.name && "rotate-180")} />}
                </Link>

                {link.submenu && (
                  <AnimatePresence>
                    {openSubmenu === link.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 bg-[#1A1A1A] border border-white/10 rounded-xl p-2 min-w-[200px] shadow-2xl z-[60]"
                      >
                        {link.submenu.map((sub) => (
                          <Link
                            key={sub.name}
                            to={sub.path}
                            className="block px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-[#CCFF00] hover:bg-white/5 rounded-lg transition-all"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search matches..."
              className="bg-[#1A1A1A] border border-white/10 rounded-full px-4 py-1.5 text-xs w-48 focus:outline-none focus:border-[#CCFF00]/50 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
          </form>

          {isAdmin && (
            <Link to="/admin/dashboard" className="w-8 h-8 rounded-full bg-[#CCFF00] flex items-center justify-center text-black font-bold text-xs hover:scale-105 transition-transform" title="Admin Dashboard">
              <ShieldCheck size={16} />
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:border-[#CCFF00]/50 flex items-center justify-center text-white hover:text-[#CCFF00] transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden bg-black border-b border-white/10 transition-all duration-300 overflow-hidden sticky top-16 z-40",
        isMenuOpen ? "max-h-[500px] border-t border-white/10" : "max-h-0"
      )}>
        <nav className="flex flex-col p-4 space-y-4">
          {navLinks.map((link) => (
            <div key={link.name} className="flex flex-col">
              <div className="flex items-center justify-between">
                <Link
                  to={link.path}
                  className="text-lg font-medium text-white/70 hover:text-[#CCFF00] uppercase tracking-widest"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
                {link.submenu && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenSubmenu(openSubmenu === link.name ? null : link.name);
                    }}
                    className="p-2 text-white/40"
                  >
                    <ChevronDown size={20} className={cn("transition-transform", openSubmenu === link.name && "rotate-180")} />
                  </button>
                )}
              </div>
              
              {link.submenu && openSubmenu === link.name && (
                <div className="flex flex-col pl-4 mt-2 space-y-3 border-l border-white/10">
                  {link.submenu.map((sub) => (
                    <Link
                      key={sub.name}
                      to={sub.path}
                      className="text-sm font-bold text-white/40 hover:text-[#CCFF00] uppercase tracking-widest"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <form onSubmit={handleSearch} className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-2 mt-4">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:ring-0 text-white flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="text-white/50">
              <Search size={20} />
            </button>
          </form>
        </nav>
      </div>
    </>
  );
}
