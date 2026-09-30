'use client';

import { Bot, Mic, Video, ShoppingBag, Megaphone, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const aiFeatures = [
  { icon: Video, title: 'AI Videos', desc: 'Photorealistic AI-generated video content at a fraction of traditional production cost.' },
  { icon: Bot, title: 'AI Avatars', desc: 'Custom digital presenters and brand ambassadors that work 24/7 without scheduling.' },
  { icon: Mic, title: 'AI Voiceovers', desc: 'Natural-sounding voices in any language, accent, and tone for your content.' },
  { icon: ShoppingBag, title: 'AI Product Videos', desc: 'Stunning product showcase videos generated from images and descriptions.' },
  { icon: Megaphone, title: 'AI Advertisements', desc: 'High-converting ad creatives generated and optimized by AI in minutes.' },
  { icon: Zap, title: 'AI at Scale', desc: 'Produce hundreds of content variations simultaneously for A/B testing and personalization.' },
];

export default function AISection() {
  return (
    <section className="section-padding relative overflow-hidden bg-[#080808]" aria-labelledby="ai-heading">
      {/* Background */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #1D6AFF, transparent 70%)' }}
      />
      
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(29,106,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(29,106,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <span className="section-label block mb-4">AI-Powered Creation</span>
            <h2 id="ai-heading" className="headline-text text-white mb-6">
              CREATIVE,{' '}
              <br />
              <span className="text-gradient">POWERED BY AI.</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
              We combine human creativity with artificial intelligence to create content that was previously impossible — at a fraction of the time and cost.
            </p>
            <Link href="/contact" className="btn-orange px-7 py-3.5" id="ai-cta">
              Explore AI Solutions
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {aiFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group glass rounded-xl p-5 hover:border-blue-600/20 transition-all duration-300 hover:bg-blue-600/[0.03]"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 flex items-center justify-center mb-3 group-hover:bg-blue-600/15 transition-colors">
                    <Icon size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marquee of AI capabilities */}
        <div className="mt-20 overflow-hidden">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-8 flex-shrink-0">
                {['AI VIDEOS', 'AI AVATARS', 'AI VOICEOVERS', 'AI ADS', 'AI SCRIPTS', 'AI THUMBNAILS', 'AI CAPTIONS', 'AI TRANSLATIONS'].map((item) => (
                  <span key={item} className="text-xs font-black tracking-widest text-white/10 uppercase">
                    {item} <span className="text-blue-600/20 mx-2">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
