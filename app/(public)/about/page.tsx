import type { Metadata } from 'next';
import { ArrowRight, Target, Zap, Heart, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Zaref Studio — Creative & Digital Marketing',
  description: 'Zaref Studio is the creative and digital marketing division of Zaref Technology, building brands through video, AI, and digital marketing.',
};

const values = [
  {
    icon: Target,
    title: 'Results-Driven',
    desc: 'We measure success by the results we deliver — views, leads, and revenue, not just aesthetics.',
  },
  {
    icon: Zap,
    title: 'Fast & Agile',
    desc: 'We move quickly, iterate rapidly, and deliver content that stays relevant in a fast-moving digital world.',
  },
  {
    icon: Heart,
    title: 'Genuinely Creative',
    desc: 'We care deeply about craft. Every frame, every word, every pixel is deliberate.',
  },
  {
    icon: Globe,
    title: 'Globally Minded',
    desc: 'We create content that works across cultures, platforms, and markets.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      {/* Hero */}
      <section className="relative pb-20 pt-10 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #1D6AFF, transparent 70%)' }}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="section-label block mb-5">About Us</span>
              <h1 className="headline-text text-white mb-6">
                We&apos;re a Creative Studio
                <br />
                <span className="text-gradient">Built for Brands</span>
                <br />
                That Want to Win.
              </h1>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                Zaref Studio is the creative and digital marketing division of Zaref Technology — a team of videographers, editors, AI specialists, and marketers obsessed with one thing: making brands impossible to ignore.
              </p>
              <p className="text-white/40 leading-relaxed mb-8">
                From producing cinematic brand films to running AI-powered content at scale, from managing social media to automating WhatsApp funnels — we bring the full creative and marketing stack to every client we work with.
              </p>
              <Link href="/contact" className="btn-orange px-7 py-3.5" id="about-cta">
                Work With Us
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* About visual */}
            <div className="relative">
              <div className="glass rounded-3xl p-8 border border-white/[0.08]">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    { value: '100+', label: 'Projects Delivered' },
                    { value: '50+', label: 'Happy Clients' },
                    { value: '3M+', label: 'Views Generated' },
                    { value: '5★', label: 'Client Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-3xl font-black text-blue-400 mb-1">{stat.value}</div>
                      <div className="text-xs text-white/30">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/[0.05] pt-6">
                  <p className="text-sm text-white/40 text-center italic">
                    &ldquo;We don&apos;t just make content. We engineer attention.&rdquo;
                  </p>
                  <p className="text-center mt-2 text-xs text-blue-400 font-medium">
                    — Zaref Studio Team
                  </p>
                </div>
              </div>

              {/* Floating badge */}
              <div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-full flex items-center justify-center text-center border border-blue-600/30"
                style={{ background: 'radial-gradient(circle, rgba(29,106,255,0.15), transparent)' }}
              >
                <div>
                  <div className="text-xs font-black text-blue-400">EST.</div>
                  <div className="text-sm font-black text-white">2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-[#060606]">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center mb-14">
            <span className="section-label block mb-4">What We Stand For</span>
            <h2 className="text-4xl font-black text-white">Our Values</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="glass rounded-2xl p-6 hover:border-blue-600/15 transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team / Story */}
      <section className="section-padding bg-[#080808]">
        <div className="mx-auto max-w-4xl px-6 md:px-8 text-center">
          <span className="section-label block mb-4">Our Story</span>
          <h2 className="text-4xl font-black text-white mb-8">
            Born from{' '}
            <span className="text-gradient">Zaref Technology</span>
          </h2>
          <div className="space-y-6 text-white/50 text-lg leading-relaxed text-left max-w-2xl mx-auto">
            <p>
              Zaref Technology was founded to build software businesses run on. As we grew, our clients started asking for something else: content that would help them sell the products we built for them.
            </p>
            <p>
              So we built Zaref Studio — a specialized creative division focused entirely on one mission: making brands impossible to ignore online.
            </p>
            <p>
              Today, Zaref Studio combines human creativity with AI technology to produce videos, manage social media, run ads, and automate marketing — all under one roof, with one aligned team.
            </p>
          </div>
          <div className="mt-10">
            <Link href="/contact" className="btn-orange px-8 py-4 text-base">
              Start a Project
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
