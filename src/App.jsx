import React, { useEffect, useRef, useState } from 'react';

const useFadeInOnScroll = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
};

const PhoneMock = ({ label }) => (
  <div className="phone-frame mx-auto h-full w-full max-w-[240px] bg-card">
    <div className="phone-notch" />
    <div className="phone-status-dots">
      <span />
      <span />
      <span />
    </div>
    <div className="flex h-full flex-col pt-7">
      <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-slate-200" />
      <div className="relative mx-4 mb-6 mt-5 flex-1 overflow-hidden rounded-3xl bg-gradient-to-b from-[#f97316]/10 via-[#fed7aa]/60 to-[#fb923c]/40">
        <div className="flex h-full flex-col items-center justify-center px-4 text-center text-sm font-medium text-secondary/80">
          <div className="mb-3 inline-flex rounded-full bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary shadow-sm">
            412 × 917
          </div>
          <p className="text-base font-semibold">{label}</p>
          <p className="mt-2 text-xs font-normal text-secondary/70">
            Screen placeholder
          </p>
        </div>
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  const { ref, visible } = useFadeInOnScroll();

  return (
    <section
      id="top"
      className="gradient-hero border-b border-orange-100/60"
    >
      <div
        ref={ref}
        className={`fade-section ${visible ? 'visible' : ''} mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 pb-20 pt-24 md:flex-row md:pb-28 md:pt-28`}
      >
        <div className="flex-1 text-center md:text-left">
          <p className="mb-3 inline-flex rounded-full bg-accentLight px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Case Study · Mobile App
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-secondary sm:text-4xl lg:text-[2.9rem]">
            SoAir — Soar to New Heights
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-secondary/75 sm:text-lg">
            Hot air balloon rides booking app that makes planning magical
            adventures feel light, smooth, and delightfully simple.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <button className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-lg">
              View Case Study
            </button>
            <button className="rounded-full border border-primary/30 bg-white/80 px-6 py-3 text-sm font-semibold text-primary shadow-sm transition hover:-translate-y-0.5 hover:border-primary hover:bg-accentLight/80 hover:text-primary">
              See Prototype
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="mx-auto max-w-xs md:max-w-sm">
            <PhoneMock label="Welcome Screen" />
          </div>
        </div>
      </div>
    </section>
  );
};

const OverviewSection = () => {
  const { ref, visible } = useFadeInOnScroll();

  const items = [
    { title: 'Role', value: 'UI/UX Designer' },
    { title: 'Timeline', value: '2024' },
    { title: 'Tools', value: 'Figma · Research' },
  ];

  return (
    <section
      ref={ref}
      className={`fade-section ${visible ? 'visible' : ''} mx-auto max-w-6xl px-6 py-14`}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl bg-card p-6 shadow-sm shadow-slate-200/60 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary/55">
              {item.title}
            </p>
            <p className="mt-3 text-lg font-semibold text-secondary">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const screens = [
  'Welcome',
  'Onboarding 1',
  'Onboarding 2',
  'Onboarding 3',
  'Log In',
  'Sign Up',
  'Home Screen',
  'Detailed Screen',
  'Date & Time',
  'Payment',
  'Add Card',
  'Confirmation',
  'Success',
];

const ScreensSection = () => {
  const { ref, visible } = useFadeInOnScroll();

  return (
    <section
      ref={ref}
      className={`fade-section ${visible ? 'visible' : ''} border-y border-orange-100/70 bg-accentLight/60`}
    >
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-secondary">
              App Screens
            </h2>
            <p className="mt-1 text-sm text-secondary/70">
              High-fidelity flows crafted for a calm, uplifting experience.
            </p>
          </div>
          <p className="text-xs text-secondary/55">
            All mockups shown at 412 × 917px placeholder ratio.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {screens.map((screen) => (
            <div
              key={screen}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-full">
                <div className="aspect-[412/917]">
                  <PhoneMock label={screen} />
                </div>
              </div>
              <p className="text-xs font-medium uppercase tracking-wide text-secondary/65">
                {screen}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ title, description, icon }) => (
  <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 shadow-sm shadow-slate-200/70 ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md">
    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
      {icon}
    </div>
    <div>
      <h3 className="text-base font-semibold text-secondary">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-secondary/75">
        {description}
      </p>
    </div>
  </div>
);

const FeaturesSection = () => {
  const { ref, visible } = useFadeInOnScroll();

  return (
    <section
      ref={ref}
      className={`fade-section ${visible ? 'visible' : ''} mx-auto max-w-6xl px-6 py-16`}
    >
      <div className="mb-8 max-w-xl">
        <h2 className="text-2xl font-semibold text-secondary">
          Key Experience Pillars
        </h2>
        <p className="mt-2 text-sm text-secondary/75">
          SoAir is designed to feel light and intuitive—from the first tap to
          the final confirmation email.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <FeatureCard
          title="Easy Booking"
          description="Find and book your perfect ride in just a few taps with clear steps and upfront details."
          icon={
            <span className="text-lg" aria-hidden="true">
              ✨
            </span>
          }
        />
        <FeatureCard
          title="Save Favorites"
          description="Manage every detail of your adventures and revisit your most magical flights anytime."
          icon={
            <span className="text-lg" aria-hidden="true">
              ❤️
            </span>
          }
        />
        <FeatureCard
          title="Secure Payment"
          description="Multiple payment options with a reassuring, trustworthy checkout flow for peace of mind."
          icon={
            <span className="text-lg" aria-hidden="true">
              🔒
            </span>
          }
        />
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-orange-100/70 bg-background/95">
    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-secondary/70 sm:flex-row sm:items-center sm:justify-between">
      <p>Designed by Elena Pechurina</p>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <a
          href="#"
          className="transition hover:text-primary"
        >
          Behance
        </a>
        <span className="h-1 w-1 rounded-full bg-secondary/25" />
        <a
          href="#"
          className="transition hover:text-primary"
        >
          LinkedIn
        </a>
        <span className="h-1 w-1 rounded-full bg-secondary/25" />
        <a
          href="mailto:hello@example.com"
          className="transition hover:text-primary"
        >
          Email
        </a>
      </div>
    </div>
  </footer>
);

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <OverviewSection />
      <ScreensSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default App;
