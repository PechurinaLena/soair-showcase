import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

// ─── Image helper ────────────────────────────────────────────────────────────
const img = (file) =>
  new URL(`./assets/screens/${file}`, import.meta.url).href;

// ─── Motion variants ─────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1];

const fromLeft = {
  hidden: { opacity: 0, x: -44 },
  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease } },
};
const fromRight = {
  hidden: { opacity: 0, x: 44 },
  show: { opacity: 1, x: 0, transition: { duration: 0.75, ease } },
};
const fromBottom = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } },
};
const container = (stagger = 0.1) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger } },
});

// ─── Reusable InView wrapper ─────────────────────────────────────────────────
function Reveal({ children, variants = fromBottom, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Phone — bare image wrapper (screenshots already include the iPhone frame) ─
const Phone = ({ src, alt = '', width = 240, style = {} }) => (
  <div style={{ width, ...style }}>
    <img
      src={src}
      alt={alt}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      draggable={false}
    />
  </div>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Overview', href: '#overview' },
  { label: 'Features', href: '#features' },
  { label: 'Screens',  href: '#screens'  },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'background 0.3s, box-shadow 0.3s',
        ...(scrolled
          ? {
              background: 'rgba(250,248,245,0.82)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              borderBottom: '1px solid rgba(15,23,42,0.07)',
              boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
            }
          : { background: 'transparent' }),
      }}
    >
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 32px',
        height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <a href="#overview" style={{ textDecoration: 'none', userSelect: 'none' }}
          className="font-display text-[22px] font-bold tracking-tight" >
          <span style={{ color: '#f97316' }}>So</span>
          <span style={{ color: '#0f172a' }}>Air</span>
        </a>

        {/* Links — Overview · Features · Screens */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {NAV_LINKS.map(({ label, href }, i) => (
            <React.Fragment key={label}>
              {i > 0 && (
                <span style={{ color: 'rgba(15,23,42,0.2)', fontSize: 14, userSelect: 'none', padding: '0 2px' }}>·</span>
              )}
              <a
                href={href}
                style={{
                  fontSize: 14, fontWeight: 500, color: 'rgba(15,23,42,0.65)',
                  textDecoration: 'none', padding: '6px 12px', borderRadius: 8,
                  transition: 'color 0.2s, background 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f97316'; e.currentTarget.style.background = 'rgba(249,115,22,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(15,23,42,0.65)'; e.currentTarget.style.background = 'transparent'; }}
              >
                {label}
              </a>
            </React.Fragment>
          ))}
        </div>

        {/* CTA */}
        <a
          href="https://www.behance.net/gallery/223300223/Hot-Air-Balloon-Booking-App-Mobile-Web-Design"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 20px', borderRadius: 999,
            background: '#f97316', color: '#fff',
            fontSize: 13, fontWeight: 600, textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(249,115,22,0.3)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#ea580c'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f97316'; }}
        >
          View on Behance
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </motion.nav>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
// Phone widths tuned so all three fit inside the right column with room to spare
const PHONE_CENTER_W  = 210;
const PHONE_SIDE_W    = 172;
// Height derived from 9:19.5 ratio
const phoneH = (w) => Math.round(w * 19.5 / 9.5);

// function HeroPhone({ src, alt, width, floatDelay = 0, floatAmp = 10, rotate = 0, opacity = 1, shadow = false }) {
//   return (
//     <motion.div
//       animate={{ y: [-floatAmp, floatAmp, -floatAmp] }}
//       transition={{ duration: 3.2 + floatDelay * 0.6, ease: 'easeInOut', repeat: Infinity, delay: floatDelay }}
//       style={{ flexShrink: 0, opacity }}
//     >
//       <div
//         style={{
//           width,
//           height: phoneH(width),
//           borderRadius: '1rem',
//           border: '1.5px solid rgba(0,0,0,0.08)',
//           boxShadow: shadow
//             ? '0 40px 80px rgba(0,0,0,0.22), 0 16px 32px rgba(0,0,0,0.10)'
//             : '0 20px 48px rgba(0,0,0,0.13), 0 6px 16px rgba(0,0,0,0.07)',
//           background: '#fff',
//           overflow: 'hidden',
//           position: 'relative',
//           transform: `rotate(${rotate}deg)`,
//           transformOrigin: 'bottom center',
//         }}
//       >
//         {/* Notch */}
//         <div style={{
//           position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
//           width: 72, height: 22, background: '#0a0a12',
//           borderRadius: '0 0 14px 14px', zIndex: 30,
//         }} />
//         {/* Screen image — fills entire frame */}
//         <img
//           src={src}
//           alt={alt}
//           style={{
//             position: 'absolute', inset: 0,
//             width: '100%', height: '100%',
//             objectFit: 'cover', objectPosition: 'top',
//             display: 'block',
//           }}
//           draggable={false}
//         />
//       </div>
//     </motion.div>
//   );
// }

function HeroPhone({ src, alt, width, floatDelay = 0, floatAmp = 10, rotate = 0, opacity = 1, shadow = false }) {
  // 1. Считаем ЧИСТУЮ высоту телефона по пропорции 19.5/9.5
  const height = Math.round(width * 19.5 / 9.5);

  return (
    <motion.div
      animate={{ y: [-floatAmp, floatAmp, -floatAmp] }}
      transition={{ 
        duration: 3.2 + floatDelay * 0.6, 
        ease: 'easeInOut', 
        repeat: Infinity,
        delay: floatDelay 
      }}
      style={{ 
        flexShrink: 0, 
        opacity,
        // 2. ДАЕМ ЗАПАС МЕСТА СНИЗУ, чтобы не обрезалось при парении
        paddingBottom: '60px', 
        overflow: 'visible' 
      }}
    >
      <div
        style={{
          width: width,
          height: height,
          borderRadius: '1.5rem', // Чуть больше скругление для мягкости
          border: '1.5px solid rgba(0,0,0,0.08)',
          boxShadow: shadow 
            ? '0 30px 60px rgba(0,0,0,0.12), 0 10px 20px rgba(0,0,0,0.08)' 
            : '0 15px 35px rgba(0,0,0,0.1)',
          background: '#fff',
          position: 'relative',
          transform: `rotate(${rotate}deg)`,
          transformOrigin: 'bottom center',
          // 3. ЭТОТ OVERFLOW НУЖЕН ТОЛЬКО ТУТ, чтобы скруглить углы картинки
          overflow: 'hidden', 
        }}
      >
        {/* 4. КАРТИНКА: Обязательно object-fit, чтобы не тянулась */}
        <img 
          src={src} 
          alt={alt} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            display: 'block' 
          }} 
        />

      </div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section
      id="overview"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 68,
        background: '#faf8f5',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Decorative background blobs ── */}
      {/* Large peach blob top-right */}
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: 560, height: 560, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Smaller coral blob bottom-right */}
      <div style={{
        position: 'absolute', bottom: '5%', right: '8%',
        width: 320, height: 320, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(251,146,60,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        opacity: 0.15,
      }} />
      {/* Faint orange circle mid-left */}
      <div style={{
        position: 'absolute', top: '30%', left: '-8%',
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(253,186,116,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Faded balloon watermark behind phones */}
      <div style={{
        position: 'absolute', right: '2%', top: '50%',
        transform: 'translateY(-50%)',
        width: 480, height: 480,
        backgroundImage: `url(${img('welcome.png')})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        opacity: 0.02,
        pointerEvents: 'none',
        filter: 'blur(10px)',
      }} />

      {/* ── Content ── */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 1280, margin: '0 auto', padding: '72px 32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: 40,
        }}>

          {/* ── Column 1: Text ── */}
          <motion.div
            variants={container(0.11)}
            initial="hidden"
            animate="show"
            style={{ minWidth: 0 }}
          >
            {/* Tag */}
            <motion.div variants={fromLeft} style={{ marginBottom: 22 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontSize: 11, fontWeight: 600, letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#f97316',
                background: '#fff7ed', border: '1px solid #fed7aa',
                padding: '6px 16px', borderRadius: 999,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
                Case Study · Mobile App
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fromLeft}
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 'clamp(42px, 4.8vw, 68px)',
                fontWeight: 800,
                lineHeight: 1.04,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                margin: '0 0 22px',
              }}
            >
              SoAir to<br />
              <span style={{ color: '#f97316' }}>New Heights</span>
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={fromLeft}
              style={{
                fontSize: 18, color: 'rgba(15,23,42,0.55)', lineHeight: 1.4,
                maxWidth: 420, margin: '0 0 36px',
              }}
            >
              A hot air balloon rides booking app — magical adventures made
              delightfully simple, from discovery to departure.
            </motion.p>

            {/* Buttons */}
            <motion.div
              variants={fromLeft}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 52 }}
            >
              <a href="#features" style={{
                display: 'inline-flex', alignItems: 'center',
                padding: '13px 26px', borderRadius: 30,
                background: '#f97316', color: '#fff',
                fontWeight: 600, fontSize: 14, textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(249,115,22,0.35)',
              }}>
                See Features
              </a>
              <a
                href="https://www.behance.net/gallery/223300223/Hot-Air-Balloon-Booking-App-Mobile-Web-Design"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '13px 26px', borderRadius: 999,
                  border: '2px solid rgba(15,23,42,0.12)',
                  color: 'rgba(15,23,42,0.7)',
                  fontWeight: 600, fontSize: 14, textDecoration: 'none',
                }}
              >
                View on Behance
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5h9M8 3l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fromLeft} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
              {[
                { value: '13', label: 'Screens' },
                { value: 'Figma', label: 'Tool' },
                { value: '2025', label: 'Year' },
              ].map(({ value, label }, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <span style={{ width: 1, height: 30, background: 'rgba(15,23,42,0.1)', display: 'block' }} />}
                  <div>
                    <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '5px 0' }}>{value}</p>
                    <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(15,23,42,0.38)', margin: '2px 0 0' }}>{label}</p>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>

          ── Column 2: Phones — flex row, no absolute positioning ──
          <motion.div
            variants={container(0.13)}
            initial="hidden"
            animate="show"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: 16,
              // Extra vertical room so float animation never clips
              paddingTop: 40,
              paddingBottom: 40,
            }}
          >
            {/* Left phone */}
            <motion.div variants={fromRight} style={{ marginBottom: 32 }}>
              <HeroPhone
                src={img('onboarding1.png')}
                alt="Onboarding"
                width={PHONE_SIDE_W}
                rotate={-12}
                opacity={0.8}
                floatDelay={0.6}
                floatAmp={7}
              />
            </motion.div>

            {/* Center phone — tallest, shadow, bigger float */}
            <motion.div variants={fromRight}>
              <HeroPhone
                src={img('welcome.png')}
                alt="Welcome"
                width={PHONE_CENTER_W}
                rotate={0}
                opacity={1}
                shadow
                floatDelay={0}
                floatAmp={10}
              />
            </motion.div>

            {/* Right phone */}
            <motion.div variants={fromRight} style={{ marginBottom: 32 }}>
              <HeroPhone
                src={img('home.png')}
                alt="Home"
                width={PHONE_SIDE_W}
                rotate={12}
                opacity={0.8}
                floatDelay={1.1}
                floatAmp={8}
              />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─── FEATURE ROW ──────────────────────────────────────────────────────────────
function FeatureRow({ tag, title, description, phones, reverse = false, bg = 'bg-[#faf8f5]' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className={`${bg} py-28 overflow-hidden`}>
      <div
        className={`max-w-7xl mx-auto px-8 flex flex-col ${
          reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
        } items-center gap-16 lg:gap-20`}
      >
        {/* Text */}
        <motion.div
          className="flex-1 min-w-0"
          variants={container(0.1)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          <motion.span
            variants={reverse ? fromLeft : fromRight}
            className="inline-block text-[12px] font-semibold uppercase tracking-[0.2em] text-[#f97316] mb-4"
          >
            {tag}
          </motion.span>
          <motion.h2
            variants={reverse ? fromRight : fromLeft}
            className="font-display text-[42px] lg:text-[52px] font-bold leading-[1.06] text-[#0f172a] mb-5"
          >
            {title}
          </motion.h2>
          <motion.p
            variants={reverse ? fromLeft : fromRight}
            className="text-[16px] text-[#0f172a]/55 leading-relaxed max-w-[420px]"
          >
            {description}
          </motion.p>
        </motion.div>

        {/* Phones */}
        <motion.div
          className="flex-1 flex items-end justify-center gap-5"
          style={{ minHeight: 460, padding: '100px 0',
             justifyContent:'space-around' }}
          variants={container(0.12)}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          {phones.map(({ file, alt, w = 196, lift = 0 }, i) => (
            <motion.div
              key={file}
              variants={reverse ? fromLeft : fromRight}
              style={{ marginBottom: lift }}
            >
              <Phone src={img(file)} alt={alt} width={w} style={{margin: '0 40px'}} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── ALL SCREENS ──────────────────────────────────────────────────────────────
const ALL_SCREENS = [
  { label: 'Welcome', file: 'welcome.png' },
  { label: 'Onboarding 1', file: 'onboarding1.png' },
  { label: 'Onboarding 2', file: 'onboarding2.png' },
  { label: 'Onboarding 3', file: 'onboarding3.png' },
  { label: 'Log In', file: 'login.png' },
  { label: 'Sign Up', file: 'signup.png' },
  { label: 'Home', file: 'home.png' },
  { label: 'Detailed', file: 'detailed.png' },
  { label: 'Date & Time', file: 'datetime.png' },
  { label: 'Payment', file: 'payment.png' },
  { label: 'Add Card', file: 'addcard.png' },
  { label: 'Confirmation', file: 'confirmation.png' },
  { label: 'Success', file: 'success.png' },
];

function AllScreens() {
  const scrollRef = useRef(null);
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, margin: '-60px' });
  const [activeIdx, setActiveIdx] = useState(0);

  // Track which card is closest to center for scale effect
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const fn = () => {
      const center = el.scrollLeft + el.clientWidth / 2;
      const cards = Array.from(el.querySelectorAll('[data-card]'));
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIdx(closest);
    };
    el.addEventListener('scroll', fn, { passive: true });
    return () => el.removeEventListener('scroll', fn);
  }, []);

  return (
    <section id="screens" className="bg-[#faf8f5] py-24 overflow-hidden" 
    style={{ padding:'100px 0 50px 0'}}>
      {/* Title */}
      <div ref={titleRef} className="max-w-7xl mx-auto px-8 mb-16 text-center">
        <motion.p
          variants={fromBottom}
          initial="hidden"
          animate={titleInView ? 'show' : 'hidden'}
          className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#f97316] mb-3"
        >
          Full Walkthrough
        </motion.p>
        <motion.h2
          variants={fromBottom}
          initial="hidden"
          animate={titleInView ? 'show' : 'hidden'}
          transition={{ delay: 0.08 }}
          className="font-display text-[42px] lg:text-[52px] font-bold text-white"
        >
          Complete Flow
        </motion.h2>
        <motion.p
          variants={fromBottom}
          initial="hidden"
          animate={titleInView ? 'show' : 'hidden'}
          transition={{ delay: 0.16 }}
          className="text-[16px] text-slate-400 mt-3 max-w-md mx-auto"
        >
          From onboarding to booking confirmation — every screen in one place.
        </motion.p>
      </div>

      {/* Scrollable carousel */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none snap-x-mandatory"
        style={{ paddingLeft: 'max(48px, calc(50vw - 104px))', 
          paddingRight: 'max(48px, calc(50vw - 104px))', paddingBottom: 24, 
          marginTop: '50px',  height: '550px', 
          display: 'flex', alignItems: 'center' }}
      >
        <div className="flex gap-7 w-full items-center h-5">
          {ALL_SCREENS.map(({ label, file }, i) => {
            const isActive = i === activeIdx;
            const isAdjacent = Math.abs(i - activeIdx) === 1;
            const scale = isActive ? 1.15 : isAdjacent ? 0.95 : 0.85;
            const opacity = isActive ? 1 : isAdjacent ? 0.75 : 0.55;
            return (
              <motion.div
                key={file}
                data-card
                className="snap-center flex flex-col items-center gap-4 shrink-0 cursor-pointer"
                animate={{ scale, opacity }}
                transition={{ duration: 0.35, ease }}
                onClick={() => {
                  setActiveIdx(i);
                  const el = scrollRef.current;
                  if (!el) return;
                  const cards = Array.from(el.querySelectorAll('[data-card]'));
                  const card = cards[i];
                  if (card) {
                    el.scrollTo({ left: card.offsetLeft - el.clientWidth / 2 + card.offsetWidth / 2, behavior: 'smooth' });
                  }
                }}
                style={{ margin: '0 20px'}}
              >
                <Phone
                  src={img(file)}
                  alt={label}
                  width={186}
                />
                <span
                  className="text-[12px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300"
                  style={{ color: isActive ? '#f97316' : 'rgba(148,163,184,0.8)', marginTop: '5px' }}
                >
                  {label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-10">
        {ALL_SCREENS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveIdx(i);
              const el = scrollRef.current;
              if (!el) return;
              const cards = Array.from(el.querySelectorAll('[data-card]'));
              const card = cards[i];
              if (card) {
                el.scrollTo({ left: card.offsetLeft - el.clientWidth / 2 + card.offsetWidth / 2, behavior: 'smooth' });
              }
            }}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === activeIdx ? 25 : 6,
              height: 6,
              background: i === activeIdx ? '#f97316' : 'rgba(148,163,184,0.35)',
              margin: '30px 0 0 0', 
              color: '#0f171a',
              margin: '30px 7px',
              border: '1px solid #ccc'
            }}
          />
        ))}
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col sm:flex-row items-center
       justify-between gap-5 text-[16px] text-slate-500" style={{padding: '50px 0 30px 0'}}>
        <div className="flex items-center gap-3">
          <span className="font-display text-[18px] font-bold">
            <span className="text-[#f97316]">So</span>
            <span className="text-white">Air</span>
          </span>
          <span className="text-slate-600">·</span>
          <span>
            Designed by{' '}
            <span className="text-white font-semibold">Elena Pechurina</span>
          </span>
        </div>
        <div className="flex items-center gap-7">
          {[
            { label: 'Behance', href: 'https://www.behance.net' },
            { label: 'LinkedIn', href: 'https://www.linkedin.com' },
            { label: 'Email', href: 'mailto:hello@example.com' },
          ].map(({ label, href }) => (
            <a
            style={{ margin: '20px 10px', fontSize: '16px'}}
              key={label}
              href={href}
              target={label !== 'Email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="hover:text-[#f97316] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <Navbar />
      <Hero />

      <section id="features">
        {/* Feature 1: Easy Booking */}
        <FeatureRow
          tag="01 · Booking"
          title={<>Easy Booking</>}
          description="Find and book your perfect hot air balloon ride in just a few taps. Clear steps, upfront pricing — no surprises."
          phones={[
            { file: 'home.png', alt: 'Home', w: 180, lift: 40 },
            { file: 'detailed.png', alt: 'Detailed', w: 206, lift: 0 },
            { file: 'datetime.png', alt: 'Date & Time', w: 180, lift: 40 },
          ]}
        />

        {/* Feature 2: Save Favorites */}
        <FeatureRow
          reverse
          bg="bg-slate-50"
          tag="02 · Auth"
          title={<>Save Favorites</>}
          description="Create your account in seconds. Save favourite rides and manage your profile — adventures resume right where you left off."
          phones={[
            { file: 'login.png', alt: 'Log In', w: 200, lift: 40 },
            { file: 'signup.png', alt: 'Sign Up', w: 200, lift: 0 },
          ]}
        />

        {/* Feature 3: Secure Payment */}
        <FeatureRow
          tag="03 · Payment"
          title={<>Secure Payment</>}
          description="Multiple payment options with a reassuring checkout flow. Add a card or pay instantly — your adventure is one tap away."
          phones={[
            { file: 'payment.png', alt: 'Payment', w: 180, lift: 40 },
            { file: 'addcard.png', alt: 'Add Card', w: 206, lift: 0 },
            { file: 'success.png', alt: 'Success', w: 180, lift: 40 },
          ]}
        />
      </section>

      <AllScreens />
      <Footer />
    </div>
  );
}
