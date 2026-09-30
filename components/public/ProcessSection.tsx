'use client';

import { useRef } from 'react';
import { Lightbulb, Camera, Scissors, Bot, Upload, TrendingUp, ArrowRight } from 'lucide-react';

const steps = [
  { icon: Lightbulb, label: 'IDEA', desc: 'Strategy & concept development', color: '#1D6AFF' },
  { icon: Camera, label: 'SHOOT', desc: 'Professional filming & direction', color: '#4B8AFF' },
  { icon: Scissors, label: 'EDIT', desc: 'Post-production & color grading', color: '#7AADFF' },
  { icon: Bot, label: 'AI', desc: 'AI enhancement & generation', color: '#90BDFF' },
  { icon: Upload, label: 'PUBLISH', desc: 'Distribution & scheduling', color: '#AACEFD' },
  { icon: TrendingUp, label: 'GROW', desc: 'Analytics & optimization', color: '#FFD89A' },
];

export default function ProcessSection() {
  return (
    <section className="section-padding relative overflow-hidden bg-[#080808]" aria-labelledby="process-heading">
      {/* Background accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-20"
        style={{ background: 'linear-gradient(90deg, transparent, #1D6AFF, transparent)' }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-label block mb-4">Creative Process</span>
          <h2 id="process-heading" className="headline-text text-white">
            From Idea to{' '}
            <span className="text-gradient">Impact.</span>
          </h2>
          <p className="mt-4 text-white/40 max-w-lg mx-auto">
            Our proven process takes your brand from a rough concept to content that performs.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-14 left-0 right-0 h-px hidden lg:block"
            style={{ background: 'linear-gradient(90deg, transparent, #1D6AFF40, transparent)' }} />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="relative flex flex-col items-center text-center group"
                >
                  {/* Step number */}
                  <div className="text-[10px] font-mono text-white/15 mb-3">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Icon circle */}
                  <div
                    className="w-28 h-28 rounded-2xl border border-white/[0.08] flex flex-col items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105 group-hover:border-blue-600/30"
                    style={{
                      background: `radial-gradient(circle at center, ${step.color}12, transparent 70%)`,
                    }}
                  >
                    <Icon size={28} style={{ color: step.color }} />
                  </div>

                  {/* Label */}
                  <h3
                    className="text-sm font-black tracking-widest mb-1"
                    style={{ color: step.color }}
                  >
                    {step.label}
                  </h3>
                  <p className="text-xs text-white/35 leading-tight">{step.desc}</p>

                  {/* Arrow connector */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-3 top-14 text-white/10">
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="mt-16 text-center">
          <p className="text-2xl font-bold text-white/20 tracking-tight">
            &ldquo;We don&apos;t just make content. We engineer{' '}
            <span className="text-blue-600/60">attention.</span>&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
