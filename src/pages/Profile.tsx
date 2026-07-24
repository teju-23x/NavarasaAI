import React, { useMemo, useState } from 'react';
import {
  Camera,
  Film,
  Ticket,
  Star,
  Clapperboard,
  Popcorn,
  Trophy,
  Armchair,
  Database,
  User,
  LogOut,
  Save
} from 'lucide-react';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const LANGUAGES = ['Malayalam', 'Tamil', 'Hindi', 'Telugu', 'Korean', 'English'];
const GENRES = ['Drama', 'Thriller', 'Crime', 'Romance', 'Sci-Fi', 'Action', 'Comedy', 'Horror'];

const ICONS = [
  { name: 'Camera', icon: <Camera size={18} /> },
  { name: 'Film', icon: <Film size={18} /> },
  { name: 'Ticket', icon: <Ticket size={18} /> },
  { name: 'Star', icon: <Star size={18} /> },
  { name: 'Clapperboard', icon: <Clapperboard size={18} /> },
  { name: 'Popcorn', icon: <Popcorn size={18} /> },
  { name: 'Trophy', icon: <Trophy size={18} /> },
  { name: 'Armchair', icon: <Armchair size={18} /> },
];

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile, updateProfile } = useNavrasa();
  const initialPrefs = useMemo(() => {
    try {
      const raw = localStorage.getItem('navrasa_profile');
      return raw ? JSON.parse(raw) : { language: 'English', genres: [] as string[] };
    } catch (error) {
      console.error('Failed to read profile preferences', error);
      return { language: 'English', genres: [] as string[] };
    }
  }, []);

  const [name, setName] = useState(userProfile.name || 'Guest Viewer');
  const [avatarIndex, setAvatarIndex] = useState(userProfile.avatarIndex || 0);
  const [language, setLanguage] = useState(initialPrefs.language || 'English');
  const [genrePrefs, setGenrePrefs] = useState<string[]>(initialPrefs.genres || []);

  const saveProfile = () => {
    const payload = { name, avatarIndex, avatarType: 'cinema' as const };
    updateProfile(payload);
    localStorage.setItem('navrasa_profile', JSON.stringify({ ...payload, language, genres: genrePrefs }));
    alert('Ledger Updated Successfully!');
  };

  const handleSignOut = () => {
    localStorage.removeItem('navrasa_session');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream pb-20">
      {/* Hero Section */}
      <section className="relative px-4 md:px-10 pt-16 md:pt-24 pb-12 text-center overflow-hidden border-b-[8px] border-double border-navy">
        <div className="absolute inset-0 starburst opacity-20 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block mb-6 relative"
          >
            <div className="absolute -inset-8 starburst opacity-30 animate-slow-rotate" />
            <h1 className="text-5xl md:text-8xl font-display tracking-tighter text-accent-red leading-none drop-shadow-lg relative">
              Patron <span className="text-navy">Ledger</span>
            </h1>
          </motion.div>
          <p className="mt-4 text-navy text-lg md:text-2xl font-black uppercase tracking-[0.4em] opacity-80">
            ★ <span className="italic font-serif normal-case tracking-normal">Membership Identity</span> ★
          </p>
          <p className="mt-2 text-accent-gold text-xl md:text-3xl font-display">Your Cinematic Passport</p>
        </div>
      </section>

      <div className="px-4 md:px-10 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Identity Card */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border-[6px] border-navy shadow-[10px_10px_0px_#C8391A] p-10 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-accent-red" />
               <div className="w-40 h-40 mx-auto border-[4px] border-navy bg-cream flex items-center justify-center text-accent-red mb-8 shadow-[6px_6px_0px_#1A1A2E] relative group">
                  <div className="scale-[2.5]">{ICONS[avatarIndex % ICONS.length].icon}</div>
                  <div className="absolute inset-0 halftone opacity-20" />
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest block">Patron Alias</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="vintage-input w-full text-center text-xl"
                    />
                  </div>
                  
                  <div className="pt-6 border-t-2 border-navy/10 flex flex-col gap-3">
                    <button onClick={saveProfile} className="vintage-button w-full h-14 flex items-center justify-center gap-3">
                       <Save size={18} /> Update Ledger
                    </button>
                    <button onClick={handleSignOut} className="h-12 border-2 border-navy text-navy font-black uppercase tracking-widest text-[10px] hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2">
                       <LogOut size={16} /> Sign Out
                    </button>
                  </div>
               </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="lg:col-span-8 space-y-12">
             <div className="bg-white border-[4px] border-navy p-10 shadow-[10px_10px_0px_#E8943A]">
                <h3 className="text-3xl font-display text-navy mb-10 flex items-center gap-4">
                   <User size={28} className="text-accent-red" />
                   Avatar Selection
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                   {ICONS.map((item, index) => (
                     <button
                       key={item.name}
                       onClick={() => setAvatarIndex(index)}
                       className={clsx(
                         "aspect-square border-[3px] flex flex-col items-center justify-center transition-all gap-1",
                         avatarIndex === index 
                           ? "bg-accent-gold border-navy scale-110 shadow-[4px_4px_0px_#1A1A2E]" 
                           : "bg-cream border-navy/10 hover:border-navy text-navy/30 hover:text-navy"
                       )}
                     >
                       {item.icon}
                       <span className="text-[8px] font-black uppercase tracking-tighter">{item.name}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="bg-white border-[4px] border-navy p-10 shadow-[10px_10px_0px_#1A1A2E]">
                <h3 className="text-3xl font-display text-navy mb-10 flex items-center gap-4">
                   <Database size={28} className="text-accent-gold" />
                   Content Preferences
                </h3>

                <div className="space-y-12">
                   <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-navy/40 uppercase tracking-[0.3em] flex items-center gap-2">
                         <div className="h-[2px] w-8 bg-navy/10" /> Preferred Language
                      </h4>
                      <div className="flex flex-wrap gap-3">
                         {LANGUAGES.map((lang) => (
                           <button
                             key={lang}
                             onClick={() => setLanguage(lang)}
                             className={clsx(
                               "px-6 py-2 border-2 font-black uppercase tracking-widest text-[10px] transition-all",
                               language === lang 
                                 ? "bg-navy text-white border-navy shadow-[4px_4px_0px_#C8391A]" 
                                 : "bg-white text-navy/60 border-navy/10 hover:border-navy"
                             )}
                           >
                             {lang}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-6">
                      <h4 className="text-[11px] font-black text-navy/40 uppercase tracking-[0.3em] flex items-center gap-2">
                         <div className="h-[2px] w-8 bg-navy/10" /> Favorite Genres
                      </h4>
                      <div className="flex flex-wrap gap-3">
                         {GENRES.map((genre) => {
                           const active = genrePrefs.includes(genre);
                           return (
                             <button
                               key={genre}
                               onClick={() =>
                                 setGenrePrefs((prev) => (prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]))
                               }
                               className={clsx(
                                 "px-6 py-2 border-2 font-black uppercase tracking-widest text-[10px] transition-all",
                                 active 
                                   ? "bg-accent-red text-white border-navy shadow-[4px_4px_0px_#1A1A2E]" 
                                   : "bg-white text-navy/60 border-navy/10 hover:border-navy"
                               )}
                             >
                               {genre}
                             </button>
                           );
                         })}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
