'use client';

import { ArrowRight, CheckCircle, MessageSquare, UserCheck, TrendingUp, Repeat, Star } from 'lucide-react';
import Link from 'next/link';

const flow = [
  { icon: UserCheck, label: 'Customer', desc: 'Potential customer discovers your brand', color: '#fff' },
  { icon: MessageSquare, label: 'WhatsApp Message', desc: 'Sends a message to your business number', color: '#25D366' },
  { icon: Star, label: 'Automated Response', desc: 'Instant, personalized reply 24/7', color: '#90BDFF' },
  { icon: CheckCircle, label: 'Lead Capture', desc: 'Contact details & intent automatically saved', color: '#1D6AFF' },
  { icon: Repeat, label: 'Follow-up', desc: 'Automated sequences keep them engaged', color: '#4B8AFF' },
  { icon: TrendingUp, label: 'Conversion', desc: 'Customer books, buys, or connects with sales', color: '#4ADE80' },
];

export default function WhatsAppSection() {
  return (
    <section className="section-padding bg-[#080808] relative overflow-hidden" aria-labelledby="whatsapp-heading">
      {/* Green glow */}
      <div
        className="absolute left-0 bottom-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #25D366, transparent 70%)' }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="section-label block mb-4">WhatsApp Automation</span>
            <h2 id="whatsapp-heading" className="headline-text text-white mb-6">
              TURN{' '}
              <span style={{ color: '#25D366' }}>CONVERSATIONS</span>
              <br />
              INTO CUSTOMERS.
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              Your customers are already on WhatsApp. We build automation that captures, qualifies, and converts leads — without you having to manually reply to every message.
            </p>

            <div className="flex flex-col gap-3 mb-8">
              {['Instant automated responses 24/7', 'Lead capture & CRM integration', 'Broadcast campaigns to warm audiences', 'Multi-step follow-up sequences', 'Appointment booking automation', 'Payment & order tracking'].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-sm text-white/60">
                  <CheckCircle size={14} className="text-green-400 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg font-semibold text-sm text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #25D366, #128C7E)',
                boxShadow: '0 0 30px rgba(37, 211, 102, 0.2)',
              }}
              id="whatsapp-cta"
            >
              <MessageSquare size={16} />
              Automate Your WhatsApp
            </Link>
          </div>

          {/* Flow diagram */}
          <div className="relative">
            <div className="flex flex-col gap-0">
              {flow.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex items-start gap-4">
                    {/* Line connector */}
                    <div className="flex flex-col items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center border flex-shrink-0"
                        style={{
                          borderColor: `${step.color}40`,
                          background: `${step.color}10`,
                        }}
                      >
                        <Icon size={16} style={{ color: step.color }} />
                      </div>
                      {index < flow.length - 1 && (
                        <div className="w-px h-8 mt-1"
                          style={{ background: `linear-gradient(to bottom, ${step.color}40, ${flow[index + 1].color}20)` }} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-4">
                      <h3
                        className="text-sm font-bold mb-0.5"
                        style={{ color: step.color }}
                      >
                        {step.label}
                      </h3>
                      <p className="text-xs text-white/35">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats card */}
            <div className="mt-6 glass rounded-xl p-5 border border-green-500/10">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-black text-green-400">3x</div>
                  <div className="text-[10px] text-white/30 mt-0.5">Higher Open Rate</div>
                </div>
                <div>
                  <div className="text-xl font-black text-green-400">24/7</div>
                  <div className="text-[10px] text-white/30 mt-0.5">Automated Replies</div>
                </div>
                <div>
                  <div className="text-xl font-black text-green-400">40%</div>
                  <div className="text-[10px] text-white/30 mt-0.5">More Conversions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
