import React, { useState, useEffect } from 'react';
import { 
  Film, 
  Tv, 
  Zap,
  Sun, 
  Moon,
  Library,
  Camera, 
  Film as FilmIcon, 
  Clapperboard, 
  Ticket, 
  Star, 
  Monitor, 
  Trophy,
  Armchair,
  BookOpen,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';
import { Link, useLocation } from 'react-router-dom';

const CINEMA_ICONS = [
  <Camera size={20} />,
  <FilmIcon size={20} />,
  <Clapperboard size={20} />,
  <Ticket size={20} />,
  <Star size={20} />,
  <Monitor size={20} />,
  <Trophy size={20} />,
  <Armchair size={20} />,
];

const ABSTRACT_GRADIENTS = [
  'from-accent-red to-accent-purple',
  'from-accent-purple to-red-500',
  'from-red-500 to-green-500',
  'from-green-500 to-yellow-500',
  'from-yellow-500 to-accent-red',
  'from-pink-500 to-accent-red',
  'from-indigo-500 to-purple-500',
  'from-orange-500 to-yellow-500',
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [activeLibraryTab, setActiveLibraryTab] = useState<'history' | 'watchlist'>('history');
  const [activeTypeTab, setActiveTypeTab] = useState<'movie' | 'series'>('movie');
  
  // Theme is strictly light/retro cream
  useEffect(() => {
    document.documentElement.classList.add('light');
    localStorage.setItem('theme', 'light');
  }, []);
  
  const { 
    watchedMovies, 
    watchedSeries, 
    watchlistMovies, 
    watchlistSeries,
    userProfile,
    removeLibraryItem,
    clearLibrary,
    wishlistMovies,
    wishlistSeries,
    wishlistAnime
  } = useNavrasa();
  


  const wishlistTotal = (wishlistMovies?.length || 0) + (wishlistSeries?.length || 0) + (wishlistAnime?.length || 0);
  const navItems = [
    { icon: <Film size={20} />, label: 'Movies', path: '/' },
    { icon: <Tv size={20} />, label: 'TV Series', path: '/series' },
    { icon: <Zap size={18} />, label: 'Anime', path: '/anime' },
    { icon: <Library size={20} />, label: `Wishlist (${wishlistTotal})`, path: '/wishlist' },
    { icon: <BookOpen size={20} />, label: 'My Diary', path: '/diary' },
    { icon: <Library size={20} />, label: 'Import Cinema', path: '/library' },
  ];

  const getLibraryItems = () => {
    if (activeLibraryTab === 'history') {
      return activeTypeTab === 'movie' ? watchedMovies : watchedSeries;
    }
    return activeTypeTab === 'movie' ? wishlistMovies : wishlistSeries;
  };

  const currentItems = getLibraryItems();
  const activeCategory = activeLibraryTab === 'history' ? 'watched' : 'watchlist';

  return (
    <aside
      className={clsx(
        "w-[240px] fixed h-screen border-r-[4px] border-navy bg-navy z-40 md:z-20 flex flex-col transition-all duration-300",
        "md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="absolute top-3 right-3 md:hidden h-8 w-8 border-2 border-cream flex items-center justify-center text-cream hover:bg-accent-red transition-colors"
      >
        <X size={16} />
      </button>
      {/* Top Logo */}
      <Link to="/" onClick={onClose} className="p-6 border-b-[4px] border-navy bg-accent-red block hover:bg-accent-gold transition-colors group">
        <div className="flex items-center gap-2">
          <span className="text-cream text-2xl group-hover:animate-spin">✦</span>
          <span className="font-display text-xl text-cream tracking-tighter">Navarasa <span className="text-navy">AI</span></span>
        </div>
        <div className="text-[10px] text-cream uppercase tracking-[0.3em] mt-1 font-black opacity-80">Cinema Guide</div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 py-8 space-y-2 custom-scrollbar flex flex-col bg-navy">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === '/' && location.pathname === '') ||
            (item.path === '/series' && location.pathname.startsWith('/series')) ||
            (item.path === '/anime' && location.pathname.startsWith('/anime'));
          return (
            <Link 
              key={item.label}
              to={item.path}
              onClick={onClose}
              className={clsx(
                "w-full h-12 px-5 flex items-center gap-[14px] transition-all duration-300 group relative",
                isActive 
                  ? "bg-cream text-navy font-black shadow-[4px_4px_0px_#E8943A]" 
                  : "text-cream/70 hover:bg-white/10 hover:text-cream hover:translate-x-1"
              )}
            >
              <span className={clsx("transition-colors", isActive ? "text-accent-red" : "text-cream/50 group-hover:text-cream")}>
                {item.icon}
              </span>
              <span className={clsx("text-xs uppercase tracking-widest font-black")}>
                {item.label}
              </span>
              {isActive && <div className="absolute right-2 text-accent-red animate-pulse">★</div>}
            </Link>
          );
        })}

        {/* My Library Section */}
        <div className="mt-8 pt-8 border-t-2 border-cream/20 flex-1 flex flex-col">
          <label className="px-5 text-[10px] text-accent-gold uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2">
            <Library size={12} />
            My Library
          </label>
          
          {/* Main Library Tabs */}
          <div className="px-5 mb-4">
             <div className="flex gap-4 text-[11px] border-b border-cream/20 font-black uppercase tracking-tighter">
                {(['history', 'watchlist'] as const).map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveLibraryTab(tab)}
                    className={clsx(
                      "pb-2 transition-all relative", 
                      activeLibraryTab === tab ? "text-cream" : "text-cream/40 hover:text-cream/60"
                    )}
                  >
                    {tab}
                    {activeLibraryTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-red" />}
                  </button>
                ))}
             </div>
          </div>

          {/* Type Sub-tabs */}
          <div className="px-5 mb-4 flex gap-2">
             {(['movie', 'series'] as const).map(type => (
               <button
                key={type}
                onClick={() => setActiveTypeTab(type)}
                className={clsx(
                  "px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-all border-2",
                  activeTypeTab === type 
                    ? "bg-accent-gold border-accent-gold text-navy" 
                    : "border-cream/20 text-cream/40 hover:border-cream/40 hover:text-cream/60"
                )}
               >
                 {type === 'series' ? 'Series' : 'Movies'}
               </button>
             ))}
          </div>

          {/* Library List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar min-h-[200px]">
            <div className="flex items-center justify-between px-3 py-2">
              <button className="text-[10px] text-cream/30 hover:text-accent-red uppercase font-black tracking-widest" onClick={() => clearLibrary(activeTypeTab, activeCategory)}>Clear All</button>
            </div>
            {currentItems.length > 0 ? (
              currentItems.map((item, i) => (
                <div 
                  key={`${item.title}-${i}`}
                  className="group px-3 py-2.5 rounded-none hover:bg-white/5 border-b border-cream/5 flex items-center justify-between cursor-default"
                >
                  <div className="overflow-hidden">
                    <div className="text-[12px] font-black text-cream truncate">{item.title}</div>
                    <div className="text-[10px] text-cream/40 font-bold uppercase tracking-tighter">{item.year}</div>
                  </div>
                  <button onClick={() => removeLibraryItem(activeTypeTab, activeCategory, item.title)} className="text-cream/30 opacity-0 group-hover:opacity-100 hover:text-accent-red transition-all">✕</button>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center border-2 border-dashed border-cream/10 m-2">
                <div className="text-[10px] text-cream/30 italic font-black uppercase tracking-widest">Empty Reels</div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Bottom Sidebar */}
      <div className="p-6 border-t-[4px] border-navy bg-navy">
        {/* Theme toggle removed per Fix 1 */}
        
        <Link
          to="/profile"
          onClick={onClose}
          className="flex items-center gap-3 cursor-pointer group p-2 border-2 border-transparent hover:border-accent-gold transition-all"
        >
          <div className="w-10 h-10 border-2 border-accent-gold bg-navy p-0.5 shadow-[3px_3px_0px_#C8391A] overflow-hidden flex items-center justify-center">
             {userProfile.avatarType === 'abstract' ? (
                <div className={clsx("w-full h-full bg-gradient-to-br", ABSTRACT_GRADIENTS[userProfile.avatarIndex])} />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-accent-gold">
                   {CINEMA_ICONS[userProfile.avatarIndex]}
                </div>
             )}
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-black text-cream leading-tight truncate group-hover:text-accent-gold transition-colors uppercase tracking-widest">{userProfile.name}</div>
            <div className="text-[10px] text-accent-gold font-bold uppercase tracking-widest">Cinephile</div>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
