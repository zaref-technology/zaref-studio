'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service } from '@/types';
import { Video, Film, Bot, Share2, Megaphone, MessageSquare, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const defaultServices: Service[] = [
  { id: '1', number: '01', title: 'Video Production', shortDescription: 'Cinematic brand films, product videos, and corporate content that tell your story with impact.', description: '', icon: 'Video', featured: true, enabled: true, displayOrder: 1 },
  { id: '2', number: '02', title: 'Video Editing', shortDescription: 'Professional post-production that transforms raw footage into compelling, polished content.', description: '', icon: 'Film', featured: false, enabled: true, displayOrder: 2 },
  { id: '3', number: '03', title: 'AI Video Creation', shortDescription: 'Cutting-edge AI avatars, voiceovers, and automated video content at scale.', description: '', icon: 'Bot', featured: false, enabled: true, displayOrder: 3 },
  { id: '4', number: '04', title: 'Social Media Marketing', shortDescription: 'Strategic campaigns, content calendars, and community management that drives growth.', description: '', icon: 'Share2', featured: false, enabled: true, displayOrder: 4 },
  { id: '5', number: '05', title: 'Social Media Ads', shortDescription: 'High-converting paid ad campaigns across Instagram, Facebook, and YouTube.', description: '', icon: 'Megaphone', featured: false, enabled: true, displayOrder: 5 },
  { id: '6', number: '06', title: 'WhatsApp Marketing & Automation', shortDescription: 'Automated WhatsApp funnels that turn conversations into customers 24/7.', description: '', icon: 'MessageSquare', featured: false, enabled: true, displayOrder: 6 },
];

const iconMap: Record<string, React.ElementType> = {
  Video, Film, Bot, Share2, Megaphone, MessageSquare,
};

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>(defaultServices);
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
          setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Service)));
        }
      } catch {
        // Use defaults on error
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <section className="section-padding relative overflow-hidden" aria-labelledby="services-heading">
      {/* Background */}
      <div className="absolute inset-0 bg-[#060606]" />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #1D6AFF, transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-16">
          <span className="section-label block mb-4">What We Do</span>
          <h2
            id="services-heading"
            className="headline-text text-white max-w-3xl"
          >
            Everything Your Brand Needs{' '}
            <span className="text-gradient">to Be Seen.</span>
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden border border-white/[0.06]">
          {(loading ? defaultServices : services).map((service, index) => {
            const Icon = iconMap[service.icon] || Video;
            return (
              <div
                key={service.id}
                className="group relative bg-[#080808] hover:bg-[#0e0e0c] transition-colors duration-300 p-8 lg:p-10"
              >
                {/* Service Number */}
                <span className="text-xs font-mono text-white/15 mb-6 block">
                  {service.number || String(index + 1).padStart(2, '0')}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-5 group-hover:bg-blue-600/15 transition-colors duration-300">
                  <Icon size={22} className="text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-white/45 leading-relaxed">
                  {service.shortDescription}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-blue-600 to-transparent group-hover:w-full transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-blue-400 transition-colors font-medium"
          >
            Explore all services
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
