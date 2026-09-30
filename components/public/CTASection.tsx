'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="section-padding bg-[#080808] relative overflow-hidden" aria-labelledby="cta-heading">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(29,106,255,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(29,106,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(29,106,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-8 text-center">
        {/* Label */}
        <span className="section-label block mb-6">Ready to Start?</span>

        {/* Headline */}
        <h2 id="cta-heading" className="display-text text-white mb-8">
          LET&apos;S BUILD
          <br />
          <span className="text-gradient">SOMETHING</span>
          <br />
          GREAT.
        </h2>

        <p className="text-xl text-white/40 mb-12 max-w-lg mx-auto leading-relaxed">
          Tell us about your project. We&apos;ll craft a strategy that gets you attention and drives real results.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="btn-orange text-base px-8 py-4" id="cta-primary">
            Start a Project
            <ArrowRight size={18} />
          </Link>
          <a
            href="https://wa.me/91XXXXXXXXXX?text=Hi%20Zaref%20Studio%2C%20I%20want%20to%20discuss%20a%20project"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-base text-white transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: 'rgba(37, 211, 102, 0.1)',
              border: '1px solid rgba(37, 211, 102, 0.25)',
            }}
            id="cta-whatsapp"
          >
            <MessageSquare size={18} style={{ color: '#25D366' }} />
            <span style={{ color: '#25D366' }}>WhatsApp Us</span>
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap gap-8 justify-center items-center">
          {['Video Production', 'AI Content', 'Social Media', 'Paid Ads', 'WhatsApp'].map((item) => (
            <div key={item} className="flex items-center gap-2 text-xs text-white/20 font-medium">
              <span className="w-1 h-1 rounded-full bg-blue-600/40" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
