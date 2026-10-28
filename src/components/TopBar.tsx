import React, { useMemo, useState, useEffect } from 'react';
import { Settings2, Camera, Film, Clapperboard, Ticket, Star, Monitor, Trophy, Library, Menu } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getHeaderGreetingSequence, escapeHtml } from '../utils/greetingUtils';

const CINEMA_ICONS = [
  <Camera size={18} />,
  <Film size={18} />,
  <Clapperboard size={18} />,
  <Ticket size={18} />,
  <Star size={18} />,
  <Monitor size={18} />,
  <Trophy size={18} />,
  <Library size={18} />,
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

interface TopBarProps {
  onOpenPrefs: () => void;
  onToggleSidebar: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onOpenPrefs, onToggleSidebar }) => {
  const { userProfile } = useNavrasa();
  const navigate = useNavigate();

  const isAuth = !!localStorage.getItem('navrasa_session');
  const rawName = userProfile.name || localStorage.getItem('user_name') || 'Viewer';
  // Escape the name before rendering so the greeting cannot be used to inject HTML
  const safeName = useMemo(() => escapeHtml(rawName), [rawName]);

  // Greetings sequence starts with the current time-of-day variant (e.g. Good evening, Teju 🌆)
  const greetingSequence = useMemo(() => getHeaderGreetingSequence(), []);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate greeting every 5 seconds with a smooth transition
  useEffect(() => {
    if (!isAuth) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % greetingSequence.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAuth, greetingSequence.length]);

  const currentTemplate = greetingSequence[currentIndex] || greetingSequence[0];

  const renderDesktopGreeting = () => {
    const parts = currentTemplate.split('{name}');
    return (
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -3 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="truncate inline-block max-w-full"
        >
          {parts[0]}
          <span
            className="inline-block mx-0.5"
            style={{
              color: 'var(--color-accent-red)',
              fontFamily: 'var(--font-display)',
            }}
          >
            {safeName}
          </span>
          {parts.length > 1 ? parts[1] : ''}
        </motion.span>
      </AnimatePresence>
    );
  };

  return (
    <header className="h-[64px] md:h-[68px] sticky top-0 bg-cream border-b-[4px] border-navy z-30 flex items-center justify-between px-3 md:px-8 transition-all duration-300">
      {/* Left side: Hamburger menu (mobile) and rotating one-line greeting */}
      <div className="flex items-center min-w-0 mr-3 flex-1 overflow-hidden">
        <button
          onClick={onToggleSidebar}
          className="md:hidden mr-2.5 h-10 w-10 border-2 border-navy flex-shrink-0 flex items-center justify-center text-navy hover:bg-accent-red hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        {isAuth && (
          <div
            className="min-w-0 truncate select-none text-[15px] sm:text-[16px] md:text-[18px] font-bold tracking-tight"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-navy)',
            }}
          >
            {/* Mobile (under 768px): Hide time-of-day, show only "Hi, {name} 👋" */}
            <span className="md:hidden truncate inline-flex items-center gap-1">
              <span>Hi,</span>
              <span
                style={{
                  color: 'var(--color-accent-red)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {safeName}
              </span>
              <span>👋</span>
            </span>

            {/* Desktop (768px and up): Cycles smoothly every few seconds */}
            <span className="hidden md:inline truncate">
              {renderDesktopGreeting()}
            </span>
          </div>
        )}
      </div>

      {/* Right side: Action buttons (flex-shrink-0 ensures no layout shift or pushing) */}
      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <button
          onClick={() => navigate('/library')}
          className="h-10 px-3 md:px-6 bg-white border-2 border-navy flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-navy hover:bg-accent-gold transition-all shadow-[2px_2px_0px_#1A1A2E] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
        >
          <span className="hidden sm:inline">Library</span>
          <span className="sm:hidden">Lib</span>
        </button>

        <button
          onClick={onOpenPrefs}
          className="h-10 px-3 md:px-6 bg-accent-red border-2 border-navy flex items-center gap-1.5 md:gap-2 text-[11px] font-black uppercase tracking-widest text-white hover:bg-navy transition-all shadow-[2px_2px_0px_#E8943A] active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
        >
          <Settings2 size={16} />
          <span className="hidden sm:inline">Preferences</span>
        </button>

        {!isAuth ? (
          <button
            onClick={() => navigate('/login')}
            className="h-10 px-4 bg-accent-red border-2 border-navy flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-navy transition-all shadow-[2px_2px_0px_#E8943A] active:shadow-none active:translate-x-[1px] active:translate-y-[1px] cursor-pointer"
          >
            <Ticket size={16} />
            <span>Sign In</span>
          </button>
        ) : (
          <div
            onClick={() => navigate('/profile')}
            className="w-10 h-10 border-2 border-navy bg-white p-0.5 shadow-[3px_3px_0px_#E8943A] cursor-pointer hover:scale-105 active:scale-95 transition-all overflow-hidden relative group flex items-center justify-center flex-shrink-0"
          >
            {userProfile.avatarType === 'abstract' ? (
              <div className={clsx("w-full h-full bg-gradient-to-br", ABSTRACT_GRADIENTS[userProfile.avatarIndex % ABSTRACT_GRADIENTS.length] || ABSTRACT_GRADIENTS[0])} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-accent-red">
                {CINEMA_ICONS[userProfile.avatarIndex % CINEMA_ICONS.length] || CINEMA_ICONS[0]}
              </div>
            )}
            <div className="absolute inset-0 bg-navy/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
