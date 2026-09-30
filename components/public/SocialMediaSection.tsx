'use client';

import { ArrowRight, Heart, MessageCircle, Eye } from 'lucide-react';
import { FaInstagram } from 'react-icons/fa';
import Link from 'next/link';

const mockPosts = [
  { type: 'reel', likes: '48.2K', comments: '892', views: '1.2M', label: 'Brand Reel' },
  { type: 'post', likes: '12.4K', comments: '234', label: 'Campaign Post' },
  { type: 'story', views: '89K', label: 'Story Ad' },
  { type: 'ad', likes: '34.5K', comments: '567', views: '890K', label: 'Paid Ad' },
];

const services = [
  'Content Strategy', 'Reel Production', 'Influencer Campaigns',
  'Community Management', 'Growth Hacking', 'Analytics & Reporting',
];

export default function SocialMediaSection() {
  return (
    <section className="section-padding bg-[#060606] relative overflow-hidden" aria-labelledby="social-heading">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Instagram Mock Feed */}
          <div className="relative order-2 lg:order-1">
            {/* Phone frame */}
            <div className="relative mx-auto max-w-xs">
              {/* Mock Instagram UI */}
              <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-3">
                  <FaInstagram size={18} className="text-blue-400" />
                  <span className="text-sm font-semibold text-white">zarefstudio</span>
                  <span className="ml-auto text-xs text-blue-400 font-medium">+ Follow</span>
                </div>

                {/* Posts grid */}
                <div className="grid grid-cols-3 gap-0.5 bg-black/20">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square relative overflow-hidden"
                      style={{
                        background: `linear-gradient(${i * 40}deg, #1D6AFF20, #00000040)`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 border border-blue-600/20 rounded-sm" />
                      </div>
                      {/* Engagement overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex gap-2 text-white text-xs">
                          <span className="flex items-center gap-1"><Heart size={10} /> {((i * 1.7 + 1.3)).toFixed(1)}K</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Story bar */}
                <div className="px-4 py-3 flex gap-3 overflow-hidden">
                  {['Reels', 'Posts', 'Ads', 'Stories'].map((item) => (
                    <div key={item} className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/60 to-blue-900/20 border border-blue-600/20" />
                      <span className="text-[9px] text-white/40 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="px-4 pb-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-sm font-black text-white">847</div>
                    <div className="text-[9px] text-white/30">Posts</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">156K</div>
                    <div className="text-[9px] text-white/30">Followers</div>
                  </div>
                  <div>
                    <div className="text-sm font-black text-white">4.2%</div>
                    <div className="text-[9px] text-white/30">Eng. Rate</div>
                  </div>
                </div>
              </div>

              {/* Floating stats */}
              <div className="absolute -right-4 top-10 bg-[#111] border border-white/10 rounded-xl p-3 shadow-xl">
                <div className="text-[10px] text-white/40 mb-1">Monthly Reach</div>
                <div className="text-lg font-black text-blue-400">3.2M+</div>
              </div>
              <div className="absolute -left-4 bottom-16 bg-[#111] border border-white/10 rounded-xl p-3 shadow-xl">
                <div className="text-[10px] text-white/40 mb-1">Avg. Growth</div>
                <div className="text-lg font-black text-green-400">+48%</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="section-label block mb-4">Social Media</span>
            <h2 id="social-heading" className="headline-text text-white mb-6">
              Content That{' '}
              <span className="text-gradient">Stops</span>
              <br />
              The Scroll.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              We create scroll-stopping content calendars, run growth campaigns, and manage your brand presence across all platforms — so you can focus on running your business.
            </p>

            {/* Services list */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {services.map((s) => (
                <div key={s} className="flex items-center gap-2 text-sm text-white/50">
                  <span className="w-1 h-1 rounded-full bg-blue-600 flex-shrink-0" />
                  {s}
                </div>
              ))}
            </div>

            <Link href="/contact" className="btn-orange px-7 py-3.5" id="social-cta">
              Grow My Social
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
