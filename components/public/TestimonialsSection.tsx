'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Testimonial } from '@/types';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    clientName: 'Vaibhav Rasal',
    company: 'VR SolarTech',
    role: 'Founder',
    testimonial: 'Zaref Studio created an outstanding video campaign for our brand. The content quality was exceptional and the results were immediate — our engagement tripled within the first month.',
    clientImage: '',
    rating: 5,
    project: '',
    published: true,
  },
  {
    id: '2',
    clientName: 'Sarah Ahmed',
    company: 'GreenLeaf Organics',
    role: 'Marketing Head',
    testimonial: 'The AI-generated content they produced was indistinguishable from our regular shoots. We saved 60% on production costs and launched 3x more campaigns.',
    clientImage: '',
    rating: 5,
    project: '',
    published: true,
  },
  {
    id: '3',
    clientName: 'Mohammed Khalid',
    company: 'TechVision UAE',
    role: 'CEO',
    testimonial: 'The WhatsApp automation they built for us converts leads at 40% — way beyond what we expected. It feels like having a 24/7 sales team at a fraction of the cost.',
    clientImage: '',
    rating: 5,
    project: '',
    published: true,
  },
];

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const q = query(
          collection(db, 'testimonials'),
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setTestimonials(snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
        }
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <section className="section-padding bg-[#060606] relative overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label block mb-4">Client Stories</span>
          <h2 id="testimonials-heading" className="headline-text text-white max-w-2xl mx-auto">
            What Our{' '}
            <span className="text-gradient">Clients</span> Say.
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(loading ? defaultTestimonials : testimonials).map((t, i) => (
            <div
              key={t.id || i}
              className="glass rounded-2xl p-8 hover:border-blue-600/15 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Background quote mark */}
              <Quote
                size={80}
                className="absolute -top-2 -right-2 text-white/[0.02] group-hover:text-blue-600/[0.03] transition-colors"
              />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating || 5 }).map((_, si) => (
                  <Star key={si} size={14} className="text-blue-400" fill="currentColor" />
                ))}
              </div>

              {/* Testimonial text */}
              <p className="text-white/65 text-sm leading-relaxed mb-6 relative z-10">
                &ldquo;{t.testimonial}&rdquo;
              </p>

              {/* Client */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600/30 to-blue-900/20 border border-blue-600/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {t.clientImage ? (
                    <Image
                      src={t.clientImage}
                      alt={t.clientName}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-sm font-bold text-blue-400">
                      {t.clientName.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.clientName}</div>
                  <div className="text-xs text-white/35">
                    {t.role}{t.company ? ` · ${t.company}` : ''}
                  </div>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-blue-600/50 to-transparent group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
