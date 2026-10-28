import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Sparkles, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavrasa } from '../context/NavrasaContext';

interface PreferredNameModalProps {
  isModal?: boolean;
  onComplete: (savedName: string) => void;
  emailFallback?: string;
  googleNameFallback?: string;
}

export const PreferredNameModal: React.FC<PreferredNameModalProps> = ({
  isModal = true,
  onComplete,
  emailFallback,
  googleNameFallback,
}) => {
  const { updateProfile } = useNavrasa();
  // Pre-fill nothing from Google's profile name or email. User must choose their own name.
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const getComputedFallback = (): string => {
    if (googleNameFallback && googleNameFallback.trim()) {
      return googleNameFallback.trim();
    }
    const currentEmail =
      emailFallback || localStorage.getItem('user_email') || 'viewer@cinema.com';
    let base = currentEmail.includes('@') ? currentEmail.split('@')[0] : currentEmail;
    // Clean up symbols and trim
    base = base.replace(/[._-]+/g, ' ').trim();
    if (base.length < 2) base = 'Viewer';
    if (base.length > 30) base = base.substring(0, 30);
    // Capitalize first letter of each word
    return base
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  };

  const handleValidateAndSave = (valueToSave: string) => {
    const trimmed = valueToSave.trim();

    if (!trimmed) {
      setError('Please enter a name to continue.');
      return;
    }

    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }

    if (trimmed.length > 30) {
      setError('Name cannot exceed 30 characters.');
      return;
    }

    // Validation passed
    setError(null);
    localStorage.setItem('user_name', trimmed);
    localStorage.setItem('navrasa_name_saved', 'true');
    localStorage.setItem('navrasa_first_visit_after_name', 'true');
    updateProfile({ name: trimmed });
    onComplete(trimmed);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleValidateAndSave(name);
  };

  const handleSkip = () => {
    const fallback = getComputedFallback();
    setError(null);
    localStorage.setItem('user_name', fallback);
    localStorage.setItem('navrasa_name_saved', 'true');
    localStorage.setItem('navrasa_first_visit_after_name', 'true');
    updateProfile({ name: fallback });
    onComplete(fallback);
  };

  const content = (
    <div className="bg-white border-[6px] border-navy shadow-[12px_12px_0px_#C8391A] relative overflow-hidden w-full max-w-[480px]">
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-r-2 border-b-2 border-navy opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-navy opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-r-2 border-t-2 border-navy opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-l-2 border-t-2 border-navy opacity-20 pointer-events-none" />

      {/* Header Block */}
      <div className="bg-accent-red border-b-[4px] border-navy p-6 text-center">
        <div className="inline-block border-2 border-white px-4 py-1 mb-2">
          <span className="text-white text-[10px] font-black uppercase tracking-[0.5em]">Onboarding • Step 1</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-display text-white tracking-tight drop-shadow-[2px_2px_0px_#1A1A2E]">
          What can we call you?
        </h2>
        <p className="text-cream text-xs font-serif mt-2 italic opacity-90">
          Personalise your cinematic premiere pass
        </p>
      </div>

      <div className="p-8 md:p-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label 
                htmlFor="preferred-name-input" 
                className="text-[11px] font-black uppercase tracking-widest text-navy"
              >
                Preferred Name
              </label>
              <span className="text-[10px] font-mono text-navy/50">
                {name.trim().length}/30
              </span>
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-navy/40 group-focus-within:text-accent-red transition-colors">
                <User size={18} />
              </div>
              <input
                id="preferred-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your name"
                autoFocus
                maxLength={35}
                className={clsx(
                  "vintage-input w-full pl-12 pr-4 text-base font-bold text-navy",
                  error && "border-accent-red ring-1 ring-accent-red"
                )}
              />
            </div>

            {error && (
              <p 
                id="preferred-name-error" 
                role="alert" 
                className="text-accent-red text-xs font-bold mt-1.5 flex items-center gap-1.5"
              >
                <span>⚠️</span>
                <span>{error}</span>
              </p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <button
              id="preferred-name-continue-btn"
              type="submit"
              className="vintage-button w-full h-14 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span className="text-lg">Continue</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center pt-2">
              <button
                id="preferred-name-skip-btn"
                type="button"
                onClick={handleSkip}
                className="text-xs font-black uppercase tracking-widest text-navy/60 hover:text-accent-red underline underline-offset-4 cursor-pointer transition-colors"
              >
                Skip (use {getComputedFallback()})
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Decoration */}
      <div className="bg-cream border-t-[4px] border-navy p-3 flex justify-between px-6 text-[10px] font-black text-navy/40 uppercase">
        <span>Cinema Ledger Identity</span>
        <span className="flex items-center gap-1">
          <Sparkles size={12} className="text-accent-gold" /> Premiere
        </span>
      </div>
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-[480px]"
      >
        {content}
      </motion.div>
    </div>
  );
};

export default PreferredNameModal;
