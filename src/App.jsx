import React, { useEffect, useRef, useState } from 'react';

const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(node); } },
      { threshold }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return { ref, visible };
};

const Phone = ({ src, label, rotate = 0, scale = 1, zIndex = 1, shadow = false }) => (
  <div style={{ transform: `rotate(${rotate}deg) scale(${scale})`, zIndex, transition: 'transform 0.4s ease' }}
    className="relative inline-block">
    <div className={`relative overflow-hidden bg-white rounded-[2.8rem] border-2 border-slate-200 ${shadow ? 'shadow-2xl' : 'shadow-lg'}`}
      style={{ width: 200, height: 430 }}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-b-2xl z-10" />
      {src
        ? <img src={src} alt={label} className="w-full h-full object-cover" />
        : <div className="w-full h-full bg-gradient-to-b from-orange-100 to-orange-200 flex flex-col items-center justify-center text-center p-4">
            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1">412×917</p>
            <p className="text-sm font-medium text-slate-600">{label}</p>
          </div>
      }
    </div>
  </div>
);

const screens = [
  { label: 'Welcome', file: 'welcome.png' },
  { label: 'Onboarding 1', file: 'onboarding1.png' },
  { label: 'Onboarding 2', file: 'onboarding2.png' },
  { label: 'Onboarding 3', file: 'onboarding3.png' },
  { label: 'Log In', file: 'login.png' },
  { label: 'Sign Up', file: 'signup.png' },
  { label: 'Home Screen', file: 'home.png' },
  { label: 'Detailed', file: 'detailed.png' },
  { label: 'Date & Time', file: 'datetime.png' },
  { label: 'Payment', file: 'payment.png' },
  { label: 'Add Card', file: 'addcard.png' },
  { label: 'Confirmation', file: 'confirmation.png' },
  { label: 'Success', file: 'success.png' },
];

const tryImg = (file) => {
  try { return new URL(`./assets/screens/${file}`, import.meta.url).href; }
  catch { return null; }
};

const HeroSection = () => {
  const { ref, visible } = useInView(0.1);
  return (
    <section className="min-h-screen flex items-center gradient-hero border-b border-orange-100 overflow-hidden">
      <div ref={ref} className={`fade-in ${visible ? 'visible' : ''} mx-auto max-w-7xl px-8 py-20 w-full`}>
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-orange-100 text-orange-500 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
              Case Study · Mobile App
            </span>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              SoAir —<br />
              <span className="text-orange-500">Soar to New</span><br />
              Heights
            </h1>
            <p className="text-lg text-slate-500 max-w-md mb-10 leading-relaxed">
              Hot air balloon rides booking app. Magical adventures, delightfully simple.
            </p>
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-orange-200 transition hover:-translate-y-0.5">
                View Case Study
              </button>
              <button className="border-2 border-orange-200 hover:border-orange-400 text-orange-500 font-semibold px-8 py-3.5 rounded-full transition hover:-translate-y-0.5">
                See Prototype
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center relative h-[520px]">
            <div className="absolute left-0 top-8 opacity-80">
              <Phone label="Onboarding 1" src={tryImg('onboarding1.png')} rotate={-12} scale={0.85} />
            </div>
            <div className="relative z-20">
              <Phone label="Welcome" src={tryImg('welcome.png')} rotate={0} scale={1.1} shadow zIndex={20} />
            </div>
            <div className="absolute right-0 top-8 opacity-80">
              <Phone label="Home Screen" src={tryImg('home.png')} rotate={12} scale={0.85} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => (
  <section className="bg-slate-900 text-white py-16">
    <div className="mx-auto max-w-5xl px-8 grid grid-cols-3 gap-8 text-center">
      {[
        { value: '13', label: 'Screens Designed' },
        { value: '2024', label: 'Year' },
        { value: 'Figma', label: 'Tool' },
      ].map((item) => (
        <div key={item.label}>
          <p className="text-4xl font-bold text-orange-400 mb-2">{item.value}</p>
          <p className="text-slate-400 text-sm uppercase tracking-wider">{item.label}</p>
        </div>
      ))}
    </div>
  </section>
);

const FeatureRow = ({ title, description, screens: screenList, reverse = false }) => {
  const { ref, visible } = useInView();
  const imgs = screenList.map(s => ({ ...s, src: tryImg(s.file) }));
  return (
    <section ref={ref} className={`fade-in ${visible ? 'visible' : ''} py-24 border-b border-slate-100`}>
      <div className={`mx-auto max-w-6xl px-8 flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16`}>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-slate-500 text-lg leading-relaxed">{description}</p>
        </div>
        <div className="flex-1 flex items-end justify-center gap-4 h-[480px]">
          {imgs.map((s, i) => (
            <div key={s.label} style={{ marginBottom: i === 1 ? 40 : 0 }}>
              <Phone label={s.label} src={s.src} rotate={i === 0 ? -6 : i === 2 ? 6 : 0} scale={i === 1 ? 1.05 : 0.9} shadow={i === 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AllScreensSection = () => {
  const { ref, visible } = useInView(0.05);
  return (
    <section ref={ref} className={`fade-in ${visible ? 'visible' : ''} bg-slate-50 py-24`}>
      <div className="mx-auto max-w-7xl px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">All Screens</h2>
          <p className="text-slate-500">Complete flow from onboarding to booking confirmation</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-8 justify-items-center">
          {screens.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center gap-3 group">
              <div className="transition group-hover:-translate-y-2 group-hover:shadow-xl duration-300">
                <Phone label={s.label} src={tryImg(s.file)} scale={0.8} />
              </div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-400 py-10">
    <div className="mx-auto max-w-6xl px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
      <p>Designed by <span className="text-white font-medium">Elena Pechurina</span></p>
      <div className="flex gap-6">
        {['Behance', 'LinkedIn', 'Email'].map(link => (
          <a key={link} href="#" className="hover:text-orange-400 transition">{link}</a>
        ))}
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <HeroSection />
      <StatsSection />
      <FeatureRow
        title="Easy Booking"
        description="Find and book your perfect hot air balloon ride in just a few taps. Clear steps, upfront pricing, no surprises."
        screens={[
          { label: 'Home Screen', file: 'home.png' },
          { label: 'Detailed', file: 'detailed.png' },
          { label: 'Date & Time', file: 'datetime.png' },
        ]}
      />
      <FeatureRow
        reverse
        title="Secure Payment"
        description="Multiple payment options with a reassuring checkout flow. Your adventure is just one confirmation away."
        screens={[
          { label: 'Payment', file: 'payment.png' },
          { label: 'Add Card', file: 'addcard.png' },
          { label: 'Success', file: 'success.png' },
        ]}
      />
      <AllScreensSection />
      <Footer />
    </div>
  );
}