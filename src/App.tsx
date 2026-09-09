import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Product, CartItem } from './types';
import { products, categories, testimonials, IMG_HERO } from './data';
import { useStore } from './context/StoreContext';
import { AdminRouter } from './components/AdminPanel';

const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price);

// ─── Icons ─────────────────────────────────────────────────
const I = {
  search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  cart: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  close: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  plus: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>,
  minus: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>,
  trash: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  star: <svg className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  check: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  arrow: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>,
  clock: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  fire: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  truck: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" /></svg>,
  shield: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  leaf: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
  heart: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  user: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  telegram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
  whatsapp: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};

// ─── Scroll Progress ───────────────────────────────────────
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return <motion.div className="scroll-progress" style={{ scaleX }} />;
};

// ─── Custom Cursor ─────────────────────────────────────────
const CustomCursor: React.FC = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 300 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 4);
      cursorY.set(e.clientY - 4);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('button, a, input, select')) setIsHovering(true);
      else setIsHovering(false);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [cursorX, cursorY]);

  // Only show on desktop
  if (typeof window !== 'undefined' && window.innerWidth < 1024) return null;

  return (
    <>
      <motion.div className="cursor-dot" style={{ x: springX, y: springY, scale: isHovering ? 2 : 1 }} />
      <motion.div className="cursor-ring" style={{ x: springX, y: springY, marginLeft: -16, marginTop: -16, scale: isHovering ? 1.5 : 1, borderColor: isHovering ? 'rgba(249,115,22,0.8)' : 'rgba(249,115,22,0.3)' }} />
    </>
  );
};

// ─── Spotlight Card ────────────────────────────────────────
const SpotlightCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };
  return <div ref={ref} onMouseMove={handleMouseMove} className={`spotlight ${className}`}>{children}</div>;
};

// ─── Tilt Card ─────────────────────────────────────────────
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -8;
    const rotateY = (x - 0.5) * 8;
    setStyle({ transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)` });
  };

  const handleMouseLeave = () => setStyle({ transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)' });

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={className} style={{ ...style, transition: 'transform 0.3s ease', transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
};

// ─── Counter Animation ─────────────────────────────────────
const Counter: React.FC<{ target: number; suffix?: string; prefix?: string }> = ({ target, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return <span ref={ref} className="counter-glow">{prefix}{formatPrice(count)}{suffix}</span>;
};

// ─── Magnetic Button ───────────────────────────────────────
const MagneticButton: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPos({ x, y });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

// ─── Marquee ───────────────────────────────────────────────
const Marquee: React.FC = () => {
  const items = ['برگر کلاسیک', 'پیتزا پپرونی', 'مرغ سوخاری', 'ساندویچ استیک', 'میلک‌شیک', 'سالاد سزار', 'سیب‌زمینی ویژه', 'براونی لاوا'];
  return (
    <div className="overflow-hidden py-4 border-y border-white/5">
      <div className="flex gap-8 marquee whitespace-nowrap" style={{ width: 'fit-content' }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-white/20 text-sm font-bold flex items-center gap-8">
            {item}
            <span className="w-1.5 h-1.5 bg-orange-500/40 rounded-full" />
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Header ────────────────────────────────────────────────
const Header: React.FC<{ cartCount: number; onCartOpen: () => void; searchQuery: string; onSearchChange: (q: string) => void }> = ({ cartCount, onCartOpen, searchQuery, onSearchChange }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <motion.header initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <span className="text-white font-black text-xl">B</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-black text-xl text-white leading-none">برگرلند</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider">BURGER LAND</p>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 max-w-md mx-8 justify-center">
            <div className="relative w-full group">
              <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="جستجوی غذا..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-5 pr-12 text-sm text-white outline-none focus:bg-white/10 focus:border-orange-500/50 transition-all placeholder-gray-500" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">{I.search}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/5">
              {I.user}<span className="hidden xl:inline">حساب من</span>
            </button>
            <MagneticButton onClick={onCartOpen} className="relative flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl shadow-lg shadow-orange-500/30 ripple overflow-visible">
              {I.cart}
              <span className="text-sm font-bold hidden sm:inline">سبد خرید</span>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1.5 bg-white text-orange-600 text-xs font-black rounded-full flex items-center justify-center shadow-xl border-2 border-orange-500"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </MagneticButton>
          </div>
        </div>

        <div className="lg:hidden pb-3">
          <div className="relative">
            <input type="text" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="جستجوی غذا..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 px-4 pr-10 text-sm text-white outline-none focus:bg-white/10 focus:border-orange-500/50 transition-all placeholder-gray-500" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{I.search}</div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

// ─── Hero ──────────────────────────────────────────────────
const HeroSection: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black noise-overlay">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img src={IMG_HERO} alt="" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      </motion.div>

      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl floating" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl floating-delay" />

      <motion.div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center" style={{ opacity }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white/90 text-sm font-medium">ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl sm:text-6xl lg:text-8xl font-black text-white leading-[1.1] mb-6 text-balance mx-auto">
          طعم واقعی<br /><span className="gradient-text">فست‌فود خانگی</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg text-gray-300 leading-relaxed mb-10 max-w-xl mx-auto">
          با بهترین مواد اولیه و دستور پخت‌های اصیل، تجربه‌ای متفاوت از فست‌فود را به شما هدیه می‌دهیم.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <MagneticButton className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-10 py-4 rounded-2xl shadow-xl shadow-orange-500/30 pulse-glow">
            مشاهده منو
            <span className="rotate-180">{I.arrow}</span>
          </MagneticButton>
          <MagneticButton className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold px-10 py-4 rounded-2xl border border-white/20">
            چرا برگرلند؟
          </MagneticButton>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="grid grid-cols-3 gap-8 mt-20 pt-8 border-t border-white/10 max-w-lg mx-auto">
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-black text-white"><Counter target={10} prefix="+" /></p>
            <p className="text-sm text-gray-500 mt-1">سال تجربه</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-black text-white"><Counter target={50} prefix="+" suffix="K" /></p>
            <p className="text-sm text-gray-500 mt-1">مشتری راضی</p>
          </div>
          <div className="text-center">
            <p className="text-3xl lg:text-4xl font-black text-white">۴.۹</p>
            <p className="text-sm text-gray-500 mt-1">امتیاز کاربران</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

// ─── Marquee Section ───────────────────────────────────────
const MarqueeSection: React.FC = () => <Marquee />;

// ─── Features ──────────────────────────────────────────────
const FeaturesSection: React.FC = () => {
  const features = [
    { icon: I.leaf, title: 'مواد اولیه تازه', desc: 'تمامی مواد اولیه ما روزانه و از تأمین‌کنندگان معتبر تهیه می‌شود', color: 'from-emerald-500 to-teal-600' },
    { icon: I.truck, title: 'ارسال سریع', desc: 'سفارش شما در کمتر از ۳۰ دقیقه آماده و ارسال می‌شود', color: 'from-orange-500 to-red-600' },
    { icon: I.shield, title: 'ضمانت کیفیت', desc: 'در صورت عدم رضایت، هزینه شما بازگردانده می‌شود', color: 'from-blue-500 to-indigo-600' },
    { icon: I.heart, title: 'عشق به غذا', desc: 'با عشق و دقت تهیه شده تا بهترین تجربه را داشته باشید', color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <section id="features" className="py-20 bg-black relative overflow-hidden gradient-mesh">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <SpotlightCard className="group relative bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover-lift card-shine h-full">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>{f.icon}</div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Category Bar ──────────────────────────────────────────
const CategoryBar: React.FC<{ categories: typeof categories; active: string; onChange: (id: string) => void }> = ({ categories, active, onChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-2 cursor-grab active:cursor-grabbing select-none"
    >
      {categories.map((cat, i) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(cat.id)}
          className={`relative flex items-center gap-3 px-5 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 ${active === cat.id ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-xl shadow-orange-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'}`}
        >
          <div className={`w-9 h-9 rounded-xl overflow-hidden ${active === cat.id ? 'ring-2 ring-white/50 ring-offset-2 ring-offset-orange-500' : ''}`}>
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-sm">{cat.name}</span>
          {active === cat.id && <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{cat.count}</span>}
        </motion.button>
      ))}
    </div>
  );
};

// ─── Product Card ──────────────────────────────────────────
const ProductCard: React.FC<{ product: Product; onAdd: (p: Product) => void; onView: (p: Product) => void; index: number }> = ({ product, onAdd, onView, index }) => {
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }}>
      <TiltCard className="group bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 card-shine h-full flex flex-col">
        <div className="relative h-56 overflow-hidden cursor-pointer bg-black/50" onClick={() => onView(product)}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover img-zoom" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {product.isPopular && <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">پرفروش</span>}
            {product.isNew && <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg">جدید</span>}
            {product.isSpicy && <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1">{I.fire} تند</span>}
          </div>

          {discount > 0 && <div className="absolute top-3 left-3"><span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg">{discount}%-</span></div>}

          <motion.div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button onClick={(e) => { e.stopPropagation(); onAdd(product); }} className="w-full bg-white/95 backdrop-blur-sm text-black text-sm font-bold py-3 rounded-xl hover:bg-white transition-colors shadow-xl btn-press ripple">
              افزودن به سبد خرید
            </button>
          </motion.div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 mb-2">
            {I.star}
            <span className="text-xs font-bold text-white">{product.rating}</span>
            <span className="text-xs text-gray-500">({formatPrice(product.reviews)} نظر)</span>
          </div>
          <h3 className="font-bold text-white mb-1.5">{product.name}</h3>
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4 flex-1">{product.description}</p>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div>
              {product.originalPrice && <span className="text-xs text-gray-500 line-through block">{formatPrice(product.originalPrice)}</span>}
              <div className="flex items-baseline gap-1">
                <span className="font-black text-white text-xl">{formatPrice(product.price)}</span>
                <span className="text-xs text-gray-500">تومان</span>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => onAdd(product)} className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl flex items-center justify-center text-white transition-all shadow-lg shadow-orange-500/30">
              {I.plus}
            </motion.button>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};

// ─── Product Modal ─────────────────────────────────────────
const ProductModal: React.FC<{ product: Product | null; onClose: () => void; onAdd: (p: Product) => void }> = ({ product, onClose, onAdd }) => {
  if (!product) return null;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25 }} className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10">
          <button onClick={onClose} className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition-colors btn-press text-white">{I.close}</button>
          <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
          <div className="p-6 sm:p-8 -mt-12 relative">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-black text-white">{product.name}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">{I.star}<span className="font-bold text-sm text-white">{product.rating}</span></div>
                  <span className="text-sm text-gray-400">{formatPrice(product.reviews)} نظر</span>
                </div>
              </div>
              <div className="text-left bg-white rounded-2xl px-4 py-3 shadow-xl">
                {product.originalPrice && <span className="text-sm text-gray-400 line-through block">{formatPrice(product.originalPrice)}</span>}
                <span className="text-xl font-black text-black">{formatPrice(product.price)}</span>
                <span className="text-xs text-gray-500"> تومان</span>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-6">{product.description}</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {product.calories && <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10"><div className="w-10 h-10 bg-orange-500/20 text-orange-400 rounded-xl flex items-center justify-center mx-auto mb-2">{I.fire}</div><p className="text-xl font-black text-white">{product.calories}</p><p className="text-xs text-gray-500 mt-1">کالری</p></div>}
                {product.prepTime && <div className="bg-white/5 rounded-2xl p-4 text-center border border-white/10"><div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-2">{I.clock}</div><p className="text-xl font-black text-white">{product.prepTime}</p><p className="text-xs text-gray-500 mt-1">زمان آماده‌سازی</p></div>}
              </div>
              {product.ingredients && <div className="mb-6"><h3 className="font-bold text-white mb-3 text-sm">مواد تشکیل‌دهنده</h3><div className="flex flex-wrap gap-2">{product.ingredients.map((ing, i) => <span key={i} className="bg-white/5 text-gray-300 text-xs px-3 py-2 rounded-xl font-medium border border-white/10">{ing}</span>)}</div></div>}
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => { onAdd(product); onClose(); }} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-orange-500/30 btn-press ripple">
                {I.cart} افزودن به سبد خرید
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Cart Sidebar ──────────────────────────────────────────
const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void; items: CartItem[]; onUpdateQty: (id: number, delta: number) => void; onRemove: (id: number) => void; onCheckout: () => void }> = ({ isOpen, onClose, items, onUpdateQty, onRemove, onCheckout }) => {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = total > 500000 ? 0 : 35000;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="fixed top-0 left-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black z-50 shadow-2xl border-r border-white/10">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div><h2 className="text-xl font-black text-white">سبد خرید</h2><p className="text-sm text-gray-400 mt-0.5">{items.length} محصول</p></div>
                <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors btn-press text-white">{I.close}</button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4"><div className="text-gray-600 scale-150">{I.cart}</div></div>
                    <p className="font-bold text-white mb-1">سبد خرید شما خالی است</p>
                    <p className="text-sm text-gray-500">محصولات مورد علاقه‌تان را اضافه کنید</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {items.map((item) => (
                        <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20, height: 0 }} className="flex gap-3 bg-white/5 rounded-2xl p-3 border border-white/10">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                            <p className="text-sm font-bold text-orange-400 mt-1">{formatPrice(item.price * item.quantity)} تومان</p>
                            <div className="flex items-center gap-2 mt-2">
                              <button onClick={() => onUpdateQty(item.id, -1)} className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors btn-press">{I.minus}</button>
                              <span className="text-sm font-bold w-6 text-center text-white">{item.quantity}</span>
                              <button onClick={() => onUpdateQty(item.id, 1)} className="w-7 h-7 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white btn-press">{I.plus}</button>
                              <button onClick={() => onRemove(item.id)} className="mr-auto w-7 h-7 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors btn-press">{I.trash}</button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
              {items.length > 0 && (
                <div className="border-t border-white/10 p-6 space-y-3 bg-black/50">
                  <div className="flex justify-between text-sm"><span className="text-gray-400">جمع سفارش</span><span className="font-bold text-white">{formatPrice(total)} تومان</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-400">هزینه ارسال</span><span className={`font-bold ${deliveryFee === 0 ? 'text-green-400' : 'text-white'}`}>{deliveryFee === 0 ? 'رایگان' : `${formatPrice(deliveryFee)} تومان`}</span></div>
                  {deliveryFee > 0 && <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-xs text-orange-300">با افزودن {formatPrice(500000 - total)} تومان دیگر، ارسال رایگان خواهد بود.</div>}
                  <div className="flex justify-between pt-3 border-t border-white/10"><span className="font-bold text-white">مبلغ قابل پرداخت</span><span className="font-black text-xl text-white">{formatPrice(total + deliveryFee)} <span className="text-sm font-normal text-gray-400">تومان</span></span></div>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={onCheckout} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-orange-500/30 btn-press ripple">ثبت سفارش و پرداخت</motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Testimonials ──────────────────────────────────────────
const TestimonialsSection: React.FC = () => (
  <section className="py-20 bg-black relative overflow-hidden gradient-mesh">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-black text-white mb-3">نظر مشتریان ما</h2>
        <p className="text-gray-400">بیش از ۵۰ هزار مشتری راضی در سراسر کشور</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <SpotlightCard className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 hover-lift card-shine h-full">
              <div className="flex items-center gap-1 mb-4">{[...Array(t.rating)].map((_, i) => <span key={i}>{I.star}</span>)}</div>
              <p className="text-gray-300 leading-relaxed mb-6 text-sm">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-orange-500/30" />
                <div><p className="font-bold text-sm text-white">{t.name}</p><p className="text-xs text-gray-500">{t.role}</p></div>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Footer ────────────────────────────────────────────────
const Footer: React.FC = () => (
  <footer className="bg-black border-t border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30"><span className="text-white font-black text-xl">B</span></div>
            <div><h3 className="font-black text-xl text-white leading-none">برگرلند</h3><p className="text-gray-500 text-[10px] tracking-wider">BURGER LAND</p></div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">برگرلند با بیش از ۱۰ سال تجربه، بهترین فست‌فود خانگی را با مواد اولیه تازه ارائه می‌دهد.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-10 h-10 bg-white/5 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 rounded-xl flex items-center justify-center transition-all btn-press text-gray-400 hover:text-white">{I.instagram}</a>
            <a href="#" className="w-10 h-10 bg-white/5 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 rounded-xl flex items-center justify-center transition-all btn-press text-gray-400 hover:text-white">{I.telegram}</a>
            <a href="#" className="w-10 h-10 bg-white/5 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-600 rounded-xl flex items-center justify-center transition-all btn-press text-gray-400 hover:text-white">{I.whatsapp}</a>
          </div>
          <a href="#admin" className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/30 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            پنل مدیریت
          </a>
        </div>
        <div>
          <h4 className="font-bold mb-5 text-lg text-white">دسترسی سریع</h4>
          <ul className="space-y-3">{['صفحه اصلی', 'منوی غذا', 'درباره ما', 'تماس با ما', 'بلاگ'].map((l) => <li key={l}><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors hover-underline">{l}</a></li>)}</ul>
        </div>
        <div>
          <h4 className="font-bold mb-5 text-lg text-white">ارتباط با ما</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-gray-400 text-sm"><div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-orange-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></div>۰۲۱-۱۲۳۴۵۶۷۸</li>
            <li className="flex items-center gap-3 text-gray-400 text-sm"><div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-orange-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg></div>info@burgerland.ir</li>
            <li className="flex items-center gap-3 text-gray-400 text-sm"><div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-orange-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div>تهران، خیابان ولیعصر</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-5 text-lg text-white">عضویت در خبرنامه</h4>
          <p className="text-gray-400 text-sm mb-4">از تخفیف‌ها و پیشنهادات ویژه باخبر شوید</p>
          <div className="flex gap-2">
            <input type="email" placeholder="ایمیل شما" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-orange-500/50 transition-colors placeholder-gray-600" />
            <button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all btn-press ripple">عضویت</button>
          </div>
        </div>
      </div>
    </div>
    <div className="border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-gray-600 text-xs">© ۱۴۰۵ برگرلند. تمامی حقوق محفوظ است. <a href="#admin" className="text-orange-500 hover:text-orange-400 mr-2">پنل مدیریت</a></p>
        <div className="flex items-center gap-2"><div className="bg-white/5 px-3 py-1.5 rounded-lg text-xs text-gray-400 border border-white/10">زرین‌پال</div><div className="bg-white/5 px-3 py-1.5 rounded-lg text-xs text-gray-400 border border-white/10">پی‌پینگ</div></div>
      </div>
    </div>
  </footer>
);

// ─── Order Success ─────────────────────────────────────────
const OrderSuccessModal: React.FC<{ isOpen: boolean; onClose: () => void; orderNumber: string }> = ({ isOpen, onClose, orderNumber }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25 }} className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl border border-white/10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30"><div className="text-green-400">{I.check}</div></motion.div>
          <h2 className="text-2xl font-black text-white mb-2">سفارش ثبت شد</h2>
          <p className="text-gray-400 mb-6 text-sm">سفارش شما با موفقیت ثبت و در حال آماده‌سازی است</p>
          <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10"><p className="text-xs text-gray-500">شماره سفارش</p><p className="text-2xl font-black text-white mt-1">#{orderNumber}</p></div>
          <div className="bg-orange-500/10 rounded-2xl p-4 mb-6 flex items-center justify-center gap-3 border border-orange-500/20"><div className="text-orange-400">{I.clock}</div><div className="text-right"><p className="text-xs text-orange-300">زمان تقریبی تحویل</p><p className="font-black text-orange-400">۲۵ تا ۳۵ دقیقه</p></div></div>
          <motion.button whileTap={{ scale: 0.98 }} onClick={onClose} className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-2xl transition-all btn-press ripple shadow-xl shadow-orange-500/30">بازگشت به فروشگاه</motion.button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Toast ─────────────────────────────────────────────────
const Toast: React.FC<{ message: string | null }> = ({ message }) => (
  <AnimatePresence>
    {message && (
      <motion.div initial={{ opacity: 0, y: 50, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: 50, x: '-50%' }} className="fixed bottom-6 left-1/2 z-[80]">
        <div className="bg-gradient-to-r from-gray-900 to-black text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"><div className="text-green-400">{I.check}</div><span className="text-sm font-medium">{message}</span></div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── App ───────────────────────────────────────────────────
const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} به سبد خرید اضافه شد`);
  };

  const updateQuantity = (id: number, delta: number) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i)).filter((i) => i.quantity > 0));
  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));

  const { addOrder } = useStore();
  
  const handleCheckout = () => {
    const num = Math.floor(100000 + Math.random() * 900000).toString();
    setOrderNumber(num);
    
    // Add order to store context (persists in localStorage, visible in admin panel)
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const deliveryFee = total > 500000 ? 0 : 35000;
    addOrder({
      items: [...cart],
      total,
      deliveryFee,
      customerName: 'مشتری وب‌سایت',
      customerPhone: '۰۹۱۲۰۰۰۰۰۰۰',
      customerAddress: 'ثبت‌شده از وب‌سایت',
      status: 'pending',
      paymentStatus: 'paid',
    });
    
    setCartOpen(false);
    setOrderSuccess(true);
    setCart([]);
  };

  let filtered = products.filter((p) => {
    const matchCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.includes(searchQuery) || p.description.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  if (sortBy === 'price-asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="min-h-screen bg-black">
      <ScrollProgress />
      <CustomCursor />
      <Header cartCount={cartCount} onCartOpen={() => setCartOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <HeroSection />
      <MarqueeSection />
      <FeaturesSection />

      <section id="menu" className="py-20 bg-black relative overflow-hidden gradient-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-3">منوی غذا</h2>
            <p className="text-gray-400 text-lg">از بین بهترین غذاهای ما انتخاب کنید</p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="w-full overflow-x-auto">
              <CategoryBar categories={categories} active={activeCategory} onChange={setActiveCategory} />
            </div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:border-orange-500/50 transition-colors cursor-pointer flex-shrink-0">
              <option value="default">مرتب‌سازی: پیش‌فرض</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating">بیشترین امتیاز</option>
            </select>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, index) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} onView={setSelectedProduct} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4"><div className="text-gray-600 scale-150">{I.search}</div></div>
              <p className="font-bold text-white mb-1">محصولی یافت نشد</p>
              <p className="text-sm text-gray-500">فیلترها را تغییر دهید</p>
            </div>
          )}
        </div>
      </section>

      <TestimonialsSection />

      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"><img src={IMG_HERO} alt="" className="w-full h-full object-cover" /></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4">آماده‌اید سفارش خود را ثبت کنید؟</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto text-lg">همین الان سفارش دهید و در کمتر از ۳۰ دقیقه غذای تازه و داغ خود را دریافت کنید</p>
            <MagneticButton className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold px-10 py-5 rounded-2xl shadow-xl shadow-orange-500/30 text-lg pulse-glow">
              سفارش آنلاین <span className="rotate-180">{I.arrow}</span>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      <Footer />

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} items={cart} onUpdateQty={updateQuantity} onRemove={removeFromCart} onCheckout={handleCheckout} />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAdd={addToCart} />}
      <OrderSuccessModal isOpen={orderSuccess} onClose={() => setOrderSuccess(false)} orderNumber={orderNumber} />
      <Toast message={toast} />
    </div>
  );
};

// ─── App with Router ───────────────────────────────────────
const AppWithRouter: React.FC = () => {
  const [route, setRoute] = useState(() => window.location.hash);

  useEffect(() => {
    const checkHash = () => {
      setRoute(window.location.hash);
    };
    
    // Check immediately
    checkHash();
    
    // Listen for changes
    window.addEventListener('hashchange', checkHash);
    
    // Also check periodically (fallback)
    const interval = setInterval(checkHash, 100);
    
    return () => {
      window.removeEventListener('hashchange', checkHash);
      clearInterval(interval);
    };
  }, []);

  if (route === '#admin') {
    return <AdminRouter />;
  }
  
  return <App />;
};

export default AppWithRouter;
