import React from 'react';
import { Settings2, Camera, Film, Clapperboard, Ticket, Star, Monitor, Trophy, Library, Menu } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';
import { useNavigate } from 'react-router-dom';

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

  return (
    <header className="h-[64px] md:h-[68px] sticky top-0 bg-cream border-b-[4px] border-navy z-30 flex items-center px-3 md:px-10 transition-all duration-300">
      <button
        onClick={onToggleSidebar}
        className="md:hidden mr-2 h-10 w-10 border-2 border-navy flex items-center justify-center text-navy hover:bg-accent-red hover:text-white transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>
      <div className="flex-1 flex justify-center">
        {/* Search is handled in Hero per page */}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
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

        <div
          onClick={() => navigate('/profile')}
          className="w-10 h-10 border-2 border-navy bg-white p-0.5 shadow-[3px_3px_0px_#E8943A] cursor-pointer hover:scale-105 active:scale-95 transition-all overflow-hidden relative group flex items-center justify-center"
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
      </div>
    </header>
  );
};

export default TopBar;
