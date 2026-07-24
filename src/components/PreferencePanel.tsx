import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Settings2, Star } from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import { clsx } from 'clsx';

interface PreferencePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreferencePanel: React.FC<PreferencePanelProps> = ({ isOpen, onClose }) => {
  const { preferences, setPreferences, generateRecs } = useNavrasa();

  const sections = [
    { 
      id: 'languages', 
      label: 'LANGUAGE SELECTOR', 
      items: ['Tamil', 'Hindi', 'English', 'Korean', 'Malayalam', 'Telugu'],
      accent: 'border-accent-red' 
    },
    { 
      id: 'industries', 
      label: 'INDUSTRY SELECTOR', 
      items: ['Kollywood', 'Bollywood', 'Hollywood', 'K-Drama', 'Mollywood'],
      accent: 'border-navy' 
    },
    { 
      id: 'genres', 
      label: 'GENRE MULTI-SELECT', 
      items: ['Action', 'Drama', 'Horror', 'Romance', 'Comedy', 'Thriller', 'Sci-Fi', 'Fantasy', 'Adventure', 'Mystery'],
      accent: 'border-accent-gold' 
    },
    { 
      id: 'moods', 
      label: 'MOOD MULTI-SELECT', 
      items: ['Dark', 'Happy', 'Intense', 'Romantic', 'Sad', 'Chill', 'Epic', 'Melancholic', 'Energetic', 'Relaxing'],
      accent: 'border-navy' 
    },
  ];

  const toggleItem = (sectionId: keyof typeof preferences, item: string) => {
    const current = (preferences[sectionId] as string[]) || [];
    const next = current.includes(item) 
      ? current.filter(i => i !== item) 
      : [...current, item];
    
    setPreferences({ ...preferences, [sectionId]: next });
  };

  const handleApply = () => {
    onClose();
    generateRecs();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 w-full md:w-[460px] h-screen bg-cream border-l-[8px] border-double border-navy z-50 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.2)]"
          >
            {/* Header */}
            <div className="h-[72px] flex items-center justify-between px-8 border-b-[4px] border-navy bg-white relative overflow-hidden">
               <div className="absolute inset-0 starburst opacity-10 pointer-events-none" />
               <div className="flex items-center gap-3 relative z-10">
                  <Settings2 className="text-accent-red" size={24} />
                  <h2 className="text-2xl font-display text-navy uppercase tracking-tighter">PREFERENCES</h2>
               </div>
               <button onClick={onClose} className="w-10 h-10 border-2 border-navy flex items-center justify-center text-navy hover:bg-accent-red hover:text-white transition-all shadow-[3px_3px_0px_#1A1A2E] active:shadow-none active:translate-x-1 active:translate-y-1">
                  <X size={20} />
               </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-12 custom-scrollbar pr-6">
               {/* Content Type Toggle */}
               <section className="bg-white border-[3px] border-navy p-6 shadow-[6px_6px_0px_#E8943A]">
                  <label className="text-[10px] font-black uppercase text-accent-red tracking-[0.3em] mb-6 block">FORMAT SELECTION</label>
                  <div className="grid grid-cols-2 gap-4">
                     {[
                       { id: 'movies', label: 'FEATURE FILMS' },
                       { id: 'both', label: 'FILMS & SERIES' }
                     ].map(type => (
                        <button 
                          key={type.id}
                          onClick={() => setPreferences({ ...preferences, contentType: type.id as any })}
                          className={clsx(
                            "h-14 border-2 font-black uppercase tracking-widest text-[11px] transition-all relative overflow-hidden",
                            preferences.contentType === type.id 
                              ? "bg-navy text-white border-navy shadow-[4px_4px_0px_#C8391A]" 
                              : "bg-cream/30 border-navy/10 text-navy/40 hover:border-navy hover:text-navy"
                          )}
                        >
                           {type.label}
                           {preferences.contentType === type.id && <div className="absolute top-0 right-0 p-1"><Check size={12} /></div>}
                        </button>
                     ))}
                  </div>
               </section>

               {/* Multi-select Sections */}
               {sections.map(section => (
                 <section key={section.id} className="space-y-6">
                    <div className="flex items-center gap-4">
                       <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-navy/40 whitespace-nowrap">{section.label}</h3>
                       <div className="h-[2px] flex-1 bg-navy/5" />
                    </div>
                    <div className="flex flex-wrap gap-3">
                       {(section.items || []).map(item => {
                         const currentSection = (preferences as any)?.[section.id] || [];
                         const isSelected = Array.isArray(currentSection) && currentSection.includes(item);
                         return (
                           <button 
                            key={item}
                            onClick={() => toggleItem(section.id as keyof typeof preferences, item)}
                            className={clsx(
                              "h-10 px-5 border-2 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                              isSelected 
                                ? "bg-accent-red text-white border-navy shadow-[3px_3px_0px_#1A1A2E] -translate-y-0.5" 
                                : "bg-white border-navy/10 text-navy/60 hover:border-navy hover:text-navy"
                            )}
                           >
                              {isSelected && <Star size={10} fill="currentColor" />}
                              {item}
                           </button>
                         );
                       })}
                    </div>
                 </section>
               ))}
            </div>

            {/* Footer / Apply Button */}
            <div className="p-8 border-t-[4px] border-navy bg-white relative overflow-hidden">
               <div className="absolute inset-0 starburst opacity-10 pointer-events-none" />
               <button 
                onClick={handleApply}
                className="vintage-button w-full h-16 text-xl relative z-10"
               >
                  UPDATE PROJECTIONS
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PreferencePanel;
