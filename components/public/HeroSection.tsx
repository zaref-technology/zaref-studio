'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export default function HeroSection() {
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = headlineRef.current?.querySelectorAll('[data-animate]');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-[#080808]" />
        
        {/* Orange glow top-right */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.15]"
          style={{ background: 'radial-gradient(circle, #1D6AFF 0%, transparent 70%)' }} />
        
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
        
        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#080808] to-transparent" />
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 z-0 hero-noise opacity-30" />

      {/* Content */}
      <div ref={headlineRef} className="relative z-10 mx-auto max-w-7xl px-6 md:px-8 pt-20 pb-20">
        <div className="max-w-5xl">
          {/* Pre-label */}
          <div
            data-animate
            className="opacity-0 mb-8 inline-flex items-center gap-3 border border-blue-600/30 rounded-full px-4 py-2 text-xs text-blue-400/80 font-semibold uppercase tracking-widest"
            style={{ animationDelay: '0ms' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            Video · AI · Social Media · Ads · WhatsApp
          </div>

          {/* Main Headline */}
          <h1 className="display-text text-white mb-6">
            <div
              data-animate
              className="opacity-0 block"
              style={{ animationDelay: '100ms' }}
            >
              YOUR BRAND.
            </div>
            <div
              data-animate
              className="opacity-0 block relative"
              style={{ animationDelay: '220ms' }}
            >
              <span className="text-gradient">OUR CREATIVITY.</span>
              <span className="absolute -bottom-2 left-0 h-1 w-28 bg-blue-500 rounded-full" />
            </div>
          </h1>

          {/* Description */}
          <p
            data-animate
            className="opacity-0 mt-10 text-lg md:text-xl text-white/50 max-w-2xl leading-relaxed"
            style={{ animationDelay: '500ms' }}
          >
            Video production, AI-powered content, social media marketing, paid ads and WhatsApp automation — everything your brand needs to grow online.
          </p>

          {/* CTAs */}
          <div
            data-animate
            className="opacity-0 mt-10 flex flex-wrap gap-4"
            style={{ animationDelay: '600ms' }}
          >
            <Link href="/contact" className="btn-orange text-base px-7 py-3.5" id="hero-cta-primary">
              Start a Project
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/work"
              className="btn-ghost text-base px-7 py-3.5 flex items-center gap-2"
              id="hero-cta-secondary"
            >
              <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                <Play size={10} fill="currentColor" />
              </div>
              View Our Work
            </Link>
          </div>

          {/* Stats */}
          <div
            data-animate
            className="opacity-0 mt-16 pt-10 border-t border-white/[0.07] grid grid-cols-3 gap-8 max-w-lg"
            style={{ animationDelay: '700ms' }}
          >
            {[
              { value: '100+', label: 'Projects Delivered' },
              { value: '50+', label: 'Happy Clients' },
              { value: '3M+', label: 'Views Generated' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-xs text-white/35 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating decoration */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4 text-xs text-white/15 font-mono">
          {['VIDEO', 'AI', 'SOCIAL', 'ADS', 'WHATSAPP'].map((item, i) => (
            <div
              key={item}
              className="flex items-center gap-2"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <span className="w-4 h-px bg-white/10" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest font-medium">Scroll</span>
      </div>
    </section>
  );
}
