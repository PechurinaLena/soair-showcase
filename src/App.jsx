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

// ─── Phone Mockup — iPhone 16 Pro Max style ──────────────────────────────────
//
// Layout (outside → inside):
//   [titanium frame]  3px border, border-radius 50px, bg #1a1a1a
//     [screen glass]  overflow:hidden, border-radius 44px, inset 4px all sides
//       [screen img]  absolute inset-0, object-cover
//       [dynamic island]  absolute, centered pill, top 10px
//       [status bar]      absolute top-0, sits beside the island
//   [side buttons]    absolute divs on left/right edges of the frame
//
function Phone({ src, alt = '', width = 240, style = {}, hover = true }) {
  const FRAME_R   = 50;   // outer frame border-radius (px)
  const SCREEN_R  = 44;   // inner screen border-radius (px)
  const BORDER    = 3;    // titanium frame thickness (px)
  const INSET     = 4;    // gap between frame inner edge and screen edge (px)
  const height    = Math.round(width * (19.5 / 9));

  // Scale every dimension relative to the reference width of 240px
  const s = width / 240;
  const di = { w: Math.round(120 * s), h: Math.round(34 * s), r: Math.round(20 * s), top: Math.round(10 * s) };

  // Side button geometry (scaled)
  const btnRight  = { w: Math.round(4  * s), top: Math.round(120 * s), h: Math.round(80 * s), r: 3 };
  const volTop    = { w: Math.round(4  * s), top: Math.round(100 * s), h: Math.round(56 * s), r: 3 };
  const volBot    = { w: Math.round(4  * s), top: Math.round(170 * s), h: Math.round(56 * s), r: 3 };
  const silentSw  = { w: Math.round(4  * s), top: Math.round(60  * s), h: Math.round(32 * s), r: 3 };

  const btnBase = {
    position: 'absolute',
    background: '#2c2c2e',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
  };

  return (
    <motion.div
      style={{
        position: 'relative',
        width,
        height,
        flexShrink: 0,
        borderRadius: FRAME_R,
        background: 'linear-gradient(160deg, #2e2e2e 0%, #1c1c1c 50%, #242424 100%)',
        ...style,
      }}
      whileHover={hover ? { y: -8 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* ── Right side: power button ── */}
      <div style={{
        ...btnBase,
        right: -btnRight.w,
        top: btnRight.top,
        width: btnRight.w,
        height: btnRight.h,
        borderRadius: `0 ${btnRight.r}px ${btnRight.r}px 0`,
      }} />

      {/* ── Left side: silent switch ── */}
      <div style={{
        ...btnBase,
        left: -silentSw.w,
        top: silentSw.top,
        width: silentSw.w,
        height: silentSw.h,
        borderRadius: `${silentSw.r}px 0 0 ${silentSw.r}px`,
      }} />

      {/* ── Left side: volume up ── */}
      <div style={{
        ...btnBase,
        left: -volTop.w,
        top: volTop.top,
        width: volTop.w,
        height: volTop.h,
        borderRadius: `${volTop.r}px 0 0 ${volTop.r}px`,
      }} />

      {/* ── Left side: volume down ── */}
      <div style={{
        ...btnBase,
        left: -volBot.w,
        top: volBot.top,
        width: volBot.w,
        height: volBot.h,
        borderRadius: `${volBot.r}px 0 0 ${volBot.r}px`,
      }} />

      {/* ── Titanium frame ring (border only — background transparent so screen shows through) ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: FRAME_R,
        border: `${BORDER}px solid #2a2a2a`,
        background: 'transparent',
        boxShadow: [
          '0 40px 80px rgba(0,0,0,0.25)',
          'inset 0 0 0 1px rgba(255,255,255,0.08)',
          '0 0 0 1px rgba(0,0,0,0.5)',
        ].join(', '),
        zIndex: 3,
        pointerEvents: 'none',
      }} />

      {/* ── Screen glass (clipping layer) ── */}
      <div style={{
        position: 'absolute',
        top:    BORDER + INSET,
        left:   BORDER + INSET,
        right:  BORDER + INSET,
        bottom: BORDER + INSET,
        borderRadius: SCREEN_R,
        overflow: 'hidden',
        background: '#fff',
        zIndex: 1,
      }}>
        {/* Screen image */}
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'top',
              display: 'block',
            }}
            draggable={false}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, #1c1c1e, #2c2c2e)',
          }} />
        )}

        {/* Dynamic Island */}
        <div style={{
          position: 'absolute',
          top: di.top,
          left: '50%',
          transform: 'translateX(-50%)',
          width: di.w,
          height: di.h,
          borderRadius: di.r,
          background: '#000',
          zIndex: 20,
          boxShadow: '0 0 0 1.5px rgba(255,255,255,0.06)',
        }} />

        {/* Status bar — time left, icons right, flanking the island */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: di.top * 2 + di.h,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingLeft: Math.round(22 * s),
          paddingRight: Math.round(22 * s),
          zIndex: 15,
        }}>
          <span style={{
            fontSize: Math.round(11 * s),
            fontWeight: 600,
            color: 'rgba(255,255,255,0.88)',
            letterSpacing: 0,
            fontVariantNumeric: 'tabular-nums',
          }}>
            9:41
          </span>
          <StatusIcons scale={s} light />
        </div>
      </div>
    </motion.div>
  );
}

function StatusIcons({ scale = 1, light = false }) {
  const c = light ? 'rgba(255,255,255,0.88)' : 'rgba(15,23,42,0.85)';
  const w = Math.round(16 * scale);
  const wf = Math.round(14 * scale);
  const wb = Math.round(24 * scale);
  const h  = Math.round(11 * scale);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(4 * scale), color: c }}>
      {/* Signal bars */}
      <svg width={w} height={h} viewBox="0 0 16 11" fill="none">
        <rect x="0" y="7" width="2.5" height="4" rx="0.5" fill="currentColor" />
        <rect x="3.5" y="4.5" width="2.5" height="6.5" rx="0.5" fill="currentColor" />
        <rect x="7" y="2" width="2.5" height="9" rx="0.5" fill="currentColor" />
        <rect x="10.5" y="0" width="2.5" height="11" rx="0.5" fill="currentColor" />
      </svg>
      {/* Wi-Fi */}
      <svg width={wf} height={h} viewBox="0 0 14 11" fill="none">
        <circle cx="7" cy="10" r="1.2" fill="currentColor" />
        <path d="M4 7.5C5 6.3 9 6.3 10 7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        <path d="M1.5 5C3.5 2.8 10.5 2.8 12.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      </svg>
      {/* Battery */}
      <svg width={wb} height={h} viewBox="0 0 24 11" fill="none">
        <rect x="0.5" y="0.5" width="19" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" />
        <rect x="2" y="2" width="14" height="7" rx="1.2" fill="currentColor" />
        <path d="M21 3.5v4c1-.5 1-3.5 0-4z" fill="currentColor" />
      </svg>
    </div>
  );
}

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
          className="font-display text-[22px] font-bold tracking-tight">
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
const phoneH = (w) => Math.round(w * 19.5 / 9);

function HeroPhone({ src, alt, width, floatDelay = 0, floatAmp = 10, rotate = 0, opacity = 1, shadow = false }) {
  return (
    <motion.div
      animate={{ y: [-floatAmp, floatAmp, -floatAmp] }}
      transition={{ duration: 3.2 + floatDelay * 0.6, ease: 'easeInOut', repeat: Infinity, delay: floatDelay }}
      style={{ flexShrink: 0, opacity }}
    >
      <div
        style={{
          width,
          height: phoneH(width),
          borderRadius: '2.5rem',
          border: '1.5px solid rgba(0,0,0,0.08)',
          boxShadow: shadow
            ? '0 40px 80px rgba(0,0,0,0.22), 0 16px 32px rgba(0,0,0,0.10)'
            : '0 20px 48px rgba(0,0,0,0.13), 0 6px 16px rgba(0,0,0,0.07)',
          background: '#fff',
          overflow: 'hidden',
          position: 'relative',
          transform: `rotate(${rotate}deg)`,
          transformOrigin: 'bottom center',
        }}
      >
        {/* Notch */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 72, height: 22, background: '#0a0a12',
          borderRadius: '0 0 14px 14px', zIndex: 30,
        }} />
        {/* Status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '4px 18px 0', zIndex: 20,
        }}>
          <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(15,23,42,0.8)' }}>9:41</span>
          <StatusIcons />
        </div>
        {/* Screen image — fills entire frame */}
        <img
          src={src}
          alt={alt}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top',
            display: 'block',
          }}
          draggable={false}
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
        opacity: 0.04,
        pointerEvents: 'none',
        filter: 'blur(2px)',
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
              Soar to<br />
              <span style={{ color: '#f97316' }}>New Heights</span>
            </motion.h1>

            {/* Body */}
            <motion.p
              variants={fromLeft}
              style={{
                fontSize: 17, color: 'rgba(15,23,42,0.55)', lineHeight: 1.7,
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
                padding: '13px 26px', borderRadius: 999,
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
                { value: '2024', label: 'Year' },
              ].map(({ value, label }, i) => (
                <React.Fragment key={label}>
                  {i > 0 && <span style={{ width: 1, height: 30, background: 'rgba(15,23,42,0.1)', display: 'block' }} />}
                  <div>
                    <p style={{ fontFamily: 'Syne, sans-serif', fontSize: 21, fontWeight: 700, color: '#0f172a', margin: 0 }}>{value}</p>
                    <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(15,23,42,0.38)', margin: '2px 0 0' }}>{label}</p>
                  </div>
                </React.Fragment>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Column 2: Phones — flex row, no absolute positioning ── */}
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
            variants={reverse ? fromRight : fromLeft}
            className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f97316] mb-4"
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
            variants={reverse ? fromRight : fromLeft}
            className="text-[16px] text-[#0f172a]/55 leading-relaxed max-w-[420px]"
          >
            {description}
          </motion.p>
        </motion.div>

        {/* Phones */}
        <motion.div
          className="flex-1 flex items-end justify-center gap-5"
          style={{ minHeight: 460 }}
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
              <Phone src={img(file)} alt={alt} width={w} />
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
    <section id="screens" className="bg-[#0f172a] py-24 overflow-hidden">
      {/* Title */}
      <div ref={titleRef} className="max-w-7xl mx-auto px-8 mb-16 text-center">
        <motion.p
          variants={fromBottom}
          initial="hidden"
          animate={titleInView ? 'show' : 'hidden'}
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f97316] mb-3"
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
          className="text-[15px] text-slate-400 mt-3 max-w-md mx-auto"
        >
          From onboarding to booking confirmation — every screen in one place.
        </motion.p>
      </div>

      {/* Scrollable carousel */}
      <div
        ref={scrollRef}
        className="overflow-x-auto scrollbar-none snap-x-mandatory"
        style={{ paddingLeft: 'max(48px, calc(50vw - 104px))', paddingRight: 'max(48px, calc(50vw - 104px))', paddingBottom: 24 }}
      >
        <div className="flex gap-7 w-max">
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
              >
                <Phone
                  src={img(file)}
                  alt={label}
                  width={186}
                  hover={false}
                  style={{
                    boxShadow: isActive
                      ? '0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(249,115,22,0.25)'
                      : '0 16px 40px rgba(0,0,0,0.3)',
                  }}
                />
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300"
                  style={{ color: isActive ? '#f97316' : 'rgba(148,163,184,0.8)' }}
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
              width: i === activeIdx ? 20 : 6,
              height: 6,
              background: i === activeIdx ? '#f97316' : 'rgba(148,163,184,0.35)',
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
    <footer className="bg-[#0f172a] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-5 text-[14px] text-slate-500">
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
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      <Hero />

      <section id="features">
        {/* Feature 1: Easy Booking */}
        <FeatureRow
          tag="01 · Booking"
          title={<>Easy<br />Booking</>}
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
          title={<>Save<br />Favorites</>}
          description="Create your account in seconds. Save favourite rides and manage your profile — adventures resume right where you left off."
          phones={[
            { file: 'login.png', alt: 'Log In', w: 200, lift: 40 },
            { file: 'signup.png', alt: 'Sign Up', w: 200, lift: 0 },
          ]}
        />

        {/* Feature 3: Secure Payment */}
        <FeatureRow
          tag="03 · Payment"
          title={<>Secure<br />Payment</>}
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
