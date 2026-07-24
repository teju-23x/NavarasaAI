import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Star, Calendar, Edit3, X, Save, Trash2 } from 'lucide-react';
import { useNavrasa } from '../context/NavrasaContext';
import { clsx } from 'clsx';
import { LibraryEntry } from '../types';

interface DiaryEntry {
  title: string;
  rating: number;
  notes: string;
  watchedDate: string;
}

const Diary: React.FC = () => {
  const { watchedMovies, watchedSeries, watchedAnime } = useNavrasa();
  const [diary, setDiary] = useState<Record<string, DiaryEntry>>(() => {
    try {
      const saved = localStorage.getItem('navrasa_diary');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load diary:', e);
      return {};
    }
  });

  const [selectedItem, setSelectedItem] = useState<LibraryEntry | null>(null);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    localStorage.setItem('navrasa_diary', JSON.stringify(diary));
  }, [diary]);

  const allWatched = [
    ...(watchedMovies || []),
    ...(watchedSeries || []),
    ...(watchedAnime || [])
  ].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

  const handleOpenModal = (item: LibraryEntry) => {
    setSelectedItem(item);
    const existing = diary[item.title] || {
      title: item.title,
      rating: 0,
      notes: '',
      watchedDate: new Date().toISOString().split('T')[0]
    };
    setEditingEntry(existing);
  };

  const handleSave = () => {
    if (selectedItem && editingEntry) {
      setDiary(prev => ({
        ...prev,
        [selectedItem.title]: editingEntry
      }));
      setSelectedItem(null);
      setEditingEntry(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
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
              My Cinema <span className="text-navy">Diary</span>
            </h1>
          </motion.div>
          <p className="mt-4 text-navy text-lg md:text-2xl font-black uppercase tracking-[0.4em] opacity-80">
            ★ <span className="italic font-serif normal-case tracking-normal">Personal Chronicles</span> ★
          </p>
          <p className="mt-2 text-accent-gold text-xl md:text-3xl font-display">Reflecting on your Cinematic Journey</p>
        </div>
      </section>

      <div className="px-4 md:px-10 py-16 max-w-7xl mx-auto">
        {allWatched.length === 0 ? (
          <div className="text-center py-32 border-[4px] border-navy border-dashed bg-white">
             <div className="w-16 h-16 border-2 border-navy/20 flex items-center justify-center text-navy/20 mx-auto mb-6">
                <BookOpen size={32} />
             </div>
             <h3 className="text-2xl font-display text-navy/40 uppercase">No entries yet</h3>
             <p className="text-navy/20 font-black uppercase tracking-widest text-[10px] mt-2">Start watching to build your cinematic record</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allWatched.map((item, idx) => {
              const entry = diary[item.title];
              return (
                <motion.div 
                  key={`${item.title}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border-[4px] border-navy shadow-[8px_8px_0px_#1A1A2E] overflow-hidden group"
                >
                  <div className="p-6 flex flex-col justify-between h-full min-h-[160px]">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="bg-accent-red border border-navy px-2 py-0.5 text-white text-[8px] font-black uppercase tracking-widest">{item.type}</span>
                        {entry && (
                          <span className="text-[9px] font-black text-accent-gold flex items-center gap-1 uppercase">
                             ✍ REVIEWED
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black text-navy uppercase tracking-widest line-clamp-1">{item.title}</h4>
                      <div className="text-[10px] text-navy/40 font-black uppercase tracking-tighter">{item.year}</div>
                      
                      {entry && entry.rating > 0 && (
                        <div className="flex gap-0.5 mt-2">
                           {[...Array(5)].map((_, i) => (
                             <Star key={i} size={10} fill={i < entry.rating ? '#E8943A' : 'none'} className={i < entry.rating ? 'text-accent-gold' : 'text-navy/10'} />
                           ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      {entry ? (
                        <div className="h-10 border-2 border-accent-gold text-accent-gold text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 bg-accent-gold/5">
                           ✍ REVIEWED
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="w-full h-10 border-2 border-navy text-[10px] font-black uppercase tracking-widest bg-cream hover:bg-accent-red hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <Edit3 size={14} /> LOG EXPERIENCE
                        </button>
                      )}
                      {entry && (
                        <button 
                          onClick={() => handleOpenModal(item)}
                          className="mt-2 w-full text-[9px] font-black text-navy/40 hover:text-accent-red uppercase tracking-widest underline decoration-dotted underline-offset-4"
                        >
                          Edit Review
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Diary Entry Modal */}
      <AnimatePresence>
        {selectedItem && editingEntry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedItem(null)}
               className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
             />
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="relative w-full max-w-xl bg-cream border-[6px] border-navy shadow-[12px_12px_0px_#1A1A2E] overflow-hidden"
             >
                <div className="bg-accent-red border-b-[4px] border-navy p-6 flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <BookOpen className="text-white" />
                      <h3 className="text-2xl font-display text-white uppercase">Diary Entry</h3>
                   </div>
                   <button onClick={() => setSelectedItem(null)} className="text-white hover:rotate-90 transition-transform">
                      <X size={24} />
                   </button>
                </div>

                <div className="p-8 space-y-8">
                   <div className="space-y-2">
                      <h4 className="text-4xl font-display text-navy leading-none">{selectedItem.title}</h4>
                      <p className="text-[11px] font-black uppercase tracking-widest text-navy/40">Watched on: 
                        <input 
                          type="date" 
                          value={editingEntry.watchedDate}
                          onChange={(e) => setEditingEntry({...editingEntry, watchedDate: e.target.value})}
                          className="ml-2 bg-transparent border-b border-navy/20 outline-none focus:border-accent-red font-black text-navy"
                        />
                      </p>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-navy">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button 
                            key={star}
                            onClick={() => setEditingEntry({...editingEntry, rating: star})}
                            className="transition-transform active:scale-90"
                          >
                             <Star 
                               size={32} 
                               fill={star <= editingEntry.rating ? '#C8391A' : 'none'} 
                               className={star <= editingEntry.rating ? 'text-accent-red' : 'text-navy/20 hover:text-accent-red/40'}
                             />
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-navy">Personal Notes</label>
                      <textarea 
                        value={editingEntry.notes}
                        onChange={(e) => setEditingEntry({...editingEntry, notes: e.target.value})}
                        placeholder="Write your thoughts about this film..."
                        className="w-full h-40 bg-white border-[3px] border-navy p-4 font-serif italic text-lg outline-none focus:shadow-[4px_4px_0px_#E8943A] transition-all resize-none"
                      />
                   </div>

                   <button 
                    onClick={handleSave}
                    className="vintage-button w-full h-16 text-xl flex items-center justify-center gap-3"
                   >
                      <Save size={24} /> SAVE TO DIARY
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Diary;
