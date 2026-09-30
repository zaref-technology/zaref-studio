'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service } from '@/types';
import { Video, Film, Bot, Share2, Megaphone, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const defaultServices = [
  {
    id: '1', number: '01', title: 'Video Production',
    shortDescription: 'Cinematic brand films, product videos, and corporate content.',
    description: 'From concept to final cut, we handle every aspect of video production. Our team brings your vision to life with professional cinematography, direction, and post-production.',
    icon: 'Video', featured: true, enabled: true, displayOrder: 1,
    includes: ['Brand films', 'Product videos', 'Corporate content', 'Event coverage', 'Testimonial videos'],
  },
  {
    id: '2', number: '02', title: 'Video Editing',
    shortDescription: 'Professional post-production that transforms raw footage.',
    description: 'Transform your raw footage into polished, professional content. We offer color grading, sound design, motion graphics, and complete post-production services.',
    icon: 'Film', featured: false, enabled: true, displayOrder: 2,
    includes: ['Color grading', 'Sound design', 'Motion graphics', 'Subtitles & captions', 'Format optimization'],
  },
  {
    id: '3', number: '03', title: 'AI Video Creation',
    shortDescription: 'Cutting-edge AI avatars, voiceovers, and automated video content.',
    description: 'Leverage the power of artificial intelligence to create stunning videos at scale. AI avatars, synthetic voiceovers, and automated content generation.',
    icon: 'Bot', featured: false, enabled: true, displayOrder: 3,
    includes: ['AI avatars & presenters', 'AI voiceovers', 'Text-to-video', 'AI product videos', 'Automated content'],
  },
  {
    id: '4', number: '04', title: 'Social Media Marketing',
    shortDescription: 'Strategic campaigns and community management that drive growth.',
    description: 'Build and grow your social media presence with strategic content, community management, and data-driven campaigns that deliver measurable results.',
    icon: 'Share2', featured: false, enabled: true, displayOrder: 4,
    includes: ['Content strategy', 'Monthly content calendar', 'Reel creation', 'Community management', 'Analytics reports'],
  },
  {
    id: '5', number: '05', title: 'Social Media Ads',
    shortDescription: 'High-converting paid ad campaigns across all major platforms.',
    description: 'Drive targeted traffic and conversions with expertly crafted paid advertising campaigns on Instagram, Facebook, YouTube, and Google.',
    icon: 'Megaphone', featured: false, enabled: true, displayOrder: 5,
    includes: ['Campaign strategy', 'Ad creative design', 'Audience targeting', 'A/B testing', 'ROI reporting'],
  },
  {
    id: '6', number: '06', title: 'WhatsApp Marketing & Automation',
    shortDescription: 'Automated WhatsApp funnels that convert conversations to customers.',
    description: 'Build powerful WhatsApp automation systems that capture leads, nurture prospects, and convert customers — all running 24/7 without manual effort.',
    icon: 'MessageSquare', featured: false, enabled: true, displayOrder: 6,
    includes: ['Chatbot setup', 'Lead capture automation', 'Broadcast campaigns', 'Follow-up sequences', 'CRM integration'],
  },
];

const iconMap: Record<string, React.ElementType> = {
  Video, Film, Bot, Share2, Megaphone, MessageSquare,
};

export default function ServicesPage() {
  const [services, setServices] = useState<(typeof defaultServices[0] & Service)[]>(defaultServices as any);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const q = query(
          collection(db, 'services'),
          where('enabled', '==', true),
          orderBy('displayOrder', 'asc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      {/* Header */}
      <section className="relative pb-16 pt-8 overflow-hidden">
        <div
          className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #1D6AFF, transparent 70%)' }}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <span className="section-label block mb-5">Services</span>
          <h1 className="headline-text text-white mb-6 max-w-3xl">
            Everything Your Brand Needs{' '}
            <span className="text-gradient">to Be Seen.</span>
          </h1>
          <p className="text-white/40 text-lg max-w-2xl leading-relaxed">
            Video production, AI-powered content, social media marketing, paid ads and WhatsApp automation — a complete creative and marketing stack.
          </p>
        </div>
      </section>

      {/* Services */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 pb-24">
        <div className="space-y-6">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Video;
            return (
              <div
                key={service.id}
                className="group glass rounded-2xl p-8 md:p-10 hover:border-blue-600/20 transition-all duration-300"
              >
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  {/* Left */}
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <span className="text-xs font-mono text-white/15">
                        {service.number || String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                        <Icon size={20} className="text-blue-400" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-black text-white mb-3">{service.title}</h2>
                    <p className="text-white/50 leading-relaxed mb-4">
                      {service.description || service.shortDescription}
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    >
                      Get Started <ArrowRight size={14} />
                    </Link>
                  </div>

                  {/* Right: Includes */}
                  {(service as any).includes && (
                    <div className="bg-white/[0.02] rounded-xl p-5 border border-white/[0.05]">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-4">
                        What&apos;s Included
                      </h3>
                      <ul className="space-y-2.5">
                        {((service as any).includes as string[]).map((item: string) => (
                          <li key={item} className="flex items-center gap-3 text-sm text-white/60">
                            <CheckCircle size={14} className="text-blue-400/70 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-black text-white mb-4">
            Not sure where to start?
          </h2>
          <p className="text-white/40 mb-8">
            Book a free consultation and we&apos;ll help you figure out the right strategy.
          </p>
          <Link href="/contact" className="btn-orange px-8 py-4 text-base" id="services-cta">
            Book a Free Call
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
