import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, User, Ticket } from 'lucide-react';
import { clsx } from 'clsx';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem('navrasa_session', 'active');
      localStorage.setItem('user_name', name);
      localStorage.setItem('user_email', email);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-cream">
      {/* Retro Starburst Background */}
      <div className="absolute inset-0 starburst opacity-20" />
      <div className="absolute inset-0 halftone opacity-5" />

      {/* Marquee Header */}
      <div className="absolute top-0 w-full bg-navy py-4 border-b-[6px] border-double border-accent-gold overflow-hidden z-20">
        <div className="animate-marquee whitespace-nowrap flex gap-20">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-accent-gold font-display text-2xl tracking-[0.3em] uppercase">
              ★ Navarasa AI Cinema ★ Now Playing ★ Welcome ★
            </span>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px] px-6 mt-24"
      >
        {/* Ticket Booth Card */}
        <div className="bg-white border-[6px] border-navy shadow-[12px_12px_0px_#C8391A] relative overflow-hidden">
          {/* Decorative Corners */}
          <div className="absolute top-0 left-0 w-8 h-8 border-r-2 border-b-2 border-navy opacity-20" />
          <div className="absolute top-0 right-0 w-8 h-8 border-l-2 border-b-2 border-navy opacity-20" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-r-2 border-t-2 border-navy opacity-20" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-l-2 border-t-2 border-navy opacity-20" />

          {/* Marquee Title Block */}
          <div className="bg-accent-red border-b-[4px] border-navy p-6 text-center">
            <div className="inline-block border-2 border-white px-4 py-1 mb-2">
              <span className="text-white text-[10px] font-black uppercase tracking-[0.5em]">Admit One</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display text-white tracking-tighter drop-shadow-[2px_2px_0px_#1A1A2E]">
              SIGN IN
            </h1>
          </div>

          <div className="p-8 md:p-12">
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-navy ml-1">Your Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-navy/40 group-focus-within:text-accent-red transition-colors">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name" 
                    required
                    className="vintage-input w-full pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-navy ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-navy/40 group-focus-within:text-accent-red transition-colors">
                    <Mail size={18} />
                  </div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    required
                    className="vintage-input w-full pl-12"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={clsx(
                  "vintage-button w-full h-16 flex items-center justify-center gap-3 relative overflow-hidden group",
                  isLoading && "opacity-80 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Ticket size={22} className="rotate-[-15deg] group-hover:rotate-0 transition-transform" />
                    <span className="text-xl">ENTER</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </button>
            </form>
          </div>

          {/* Footer Decoration */}
          <div className="bg-cream border-t-[4px] border-navy p-4 flex justify-between px-8">
             <span className="text-[10px] font-black text-navy/40 uppercase">AI Cinema Guide</span>
             <span className="text-[10px] font-black text-navy/40">BOX OFFICE</span>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="mt-12 flex items-center justify-center gap-8">
           <div className="w-12 h-[2px] bg-navy/20" />
           <div className="text-navy opacity-40 animate-flash">
              <span className="text-2xl">✦</span>
           </div>
           <div className="w-12 h-[2px] bg-navy/20" />
        </div>
      </motion.div>

      {/* Marquee Footer */}
      <div className="absolute bottom-0 w-full bg-accent-gold py-3 border-t-[6px] border-double border-navy overflow-hidden z-20">
        <div className="animate-marquee whitespace-nowrap flex gap-20" style={{ animationDirection: 'reverse' }}>
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-navy font-display text-lg tracking-[0.2em] uppercase">
              • Premiere Show • Limited Engagement • AI Curated • Cinematic Bliss •
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
