import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Play } from 'lucide-react';

type ShareType = 'movie' | 'series' | 'anime';

const safeGetSession = () => {
  try {
    return localStorage.getItem('navrasa_session');
  } catch {
    return null;
  }
};

const SharePage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const title = params.get('title') || '';
  const year = params.get('year') || '';
  const typeParam = params.get('type') || 'movie';
  const type: ShareType = typeParam === 'series' || typeParam === 'anime' || typeParam === 'movie' ? typeParam : 'movie';

  const navigate = useNavigate();

  const [isAuthed, setIsAuthed] = useState(false);
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    setIsAuthed(!!safeGetSession());
  }, []);

  const targetPath = useMemo(() => {
    return type === 'series' ? '/series' : type === 'anime' ? '/anime' : '/';
  }, [type]);

  const handleDiscover = () => {
    navigate(targetPath, {
      state: { autoSearchTitle: title, autoSearchType: type, shareYear: year },
      replace: true
    });
  };

  useEffect(() => {
    if (!isAuthed) return;
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    handleDiscover();
  }, [isAuthed, handleDiscover]);

  if (isAuthed) {
    return (
      <div className="min-h-screen bg-navy flex flex-col items-center justify-center p-8 text-center overflow-hidden relative">
        <div className="absolute inset-0 starburst opacity-20 pointer-events-none animate-slow-rotate" />
        <div className="relative z-10 space-y-6">
           <div className="w-20 h-20 border-[4px] border-accent-gold border-t-accent-red rounded-full animate-spin mx-auto" />
           <div className="text-accent-gold font-display text-2xl uppercase tracking-widest">Discovering on Navarasa AI...</div>
           <div className="text-white font-display text-5xl md:text-7xl tracking-tighter drop-shadow-lg">
             NAVRASA <span className="text-accent-red">AI</span>
           </div>
        </div>
      </div>
    );
  }

  const typeLabel = type === 'series' ? 'TV Series' : type === 'anime' ? 'Anime' : 'Movie';

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-8 text-center overflow-hidden relative">
      <div className="absolute inset-0 starburst opacity-10 pointer-events-none" />
      
      <div className="max-w-xl w-full bg-white border-[6px] border-navy shadow-[16px_16px_0px_#C8391A] p-12 relative z-10">
         <div className="absolute top-0 left-0 w-full h-2 bg-accent-red" />
         
         <div className="mb-10">
            <div className="text-navy/40 font-black uppercase tracking-widest text-[10px] mb-4 flex items-center justify-center gap-3">
               <div className="h-[2px] w-8 bg-navy/10" /> A Recommendation Shared <div className="h-[2px] w-8 bg-navy/10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-display text-navy tracking-tighter mb-2 leading-none">
              NAVRASA <span className="text-accent-red">AI</span>
            </h1>
         </div>

         <div className="space-y-6 mb-12">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-cream border-2 border-navy p-8 shadow-[6px_6px_0px_#E8943A] relative"
            >
               <div className="absolute -top-3 -left-2 text-4xl font-display text-accent-red opacity-10">"</div>
               <h2 className="text-2xl md:text-3xl font-display text-navy leading-tight">{title}</h2>
               <div className="text-[11px] font-black text-navy/40 uppercase tracking-widest mt-4">
                 {year} ★ {typeLabel}
               </div>
            </motion.div>
         </div>

         <button
           onClick={handleDiscover}
           className="vintage-button w-full h-16 text-lg flex items-center justify-center gap-3"
         >
           <Sparkles size={20} /> Discover Similar
         </button>

         <div className="mt-10 pt-8 border-t-2 border-navy/5">
            <p className="text-navy/30 text-[9px] font-black uppercase tracking-widest leading-relaxed">
              Experience the future of cinematic discovery. <br /> Sign in to curate your personal archive.
            </p>
         </div>
      </div>
    </div>
  );
};

export default SharePage;
