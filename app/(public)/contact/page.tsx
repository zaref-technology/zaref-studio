'use client';

import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ArrowRight, Send, CheckCircle, AlertCircle, MapPin, Mail, Phone } from 'lucide-react';

const services = [
  'Video Production',
  'Video Editing',
  'AI Video Creation',
  'Social Media Marketing',
  'Social Media Ads',
  'WhatsApp Marketing & Automation',
  'Multiple Services',
];

const budgets = [
  'Under ₹25,000',
  '₹25,000 – ₹75,000',
  '₹75,000 – ₹2,00,000',
  '₹2,00,000+',
  'Let\'s discuss',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    serviceRequired: '',
    budget: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      await addDoc(collection(db, 'leads'), {
        ...form,
        status: 'new',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setStatus('success');
      setForm({ name: '', businessName: '', email: '', phone: '', serviceRequired: '', budget: '', message: '' });
    } catch (err) {
      console.error('Error submitting lead:', err);
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      {/* Header */}
      <section className="relative pb-12 pt-8 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #1D6AFF, transparent 70%)' }}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-8 text-center">
          <span className="section-label block mb-5">Get In Touch</span>
          <h1 className="headline-text text-white mb-4">
            Let&apos;s Build Something{' '}
            <span className="text-gradient">Great.</span>
          </h1>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            Tell us about your project. We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 md:px-8 pb-24">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-base font-bold text-white mb-5">Get In Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-white/30 mb-0.5">Email</div>
                    <a href="mailto:studio@zaref.in" className="text-sm text-white hover:text-blue-400 transition-colors">
                      studio@zaref.in
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-white/30 mb-0.5">Phone / WhatsApp</div>
                    <a href="tel:+91XXXXXXXXXX" className="text-sm text-white hover:text-blue-400 transition-colors">
                      +91 XXXXX XXXXX
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-blue-400 mt-0.5" />
                  <div>
                    <div className="text-xs text-white/30 mb-0.5">Based In</div>
                    <p className="text-sm text-white">India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4">What Happens Next</h3>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'We review your request', desc: 'Within 24 hours' },
                  { step: '02', title: 'Discovery call', desc: 'We learn about your goals' },
                  { step: '03', title: 'Strategy proposal', desc: 'Custom plan for your brand' },
                  { step: '04', title: 'We get to work', desc: 'Content creation begins' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <span className="text-xs font-mono text-blue-500 mt-0.5 flex-shrink-0">{item.step}</span>
                    <div>
                      <div className="text-sm font-medium text-white">{item.title}</div>
                      <div className="text-xs text-white/30">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {status === 'success' ? (
              <div className="glass rounded-2xl p-12 text-center">
                <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">Message Received!</h2>
                <p className="text-white/50 mb-6">
                  We&apos;ll get back to you within 24 hours. In the meantime, follow us on social media.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="btn-orange px-6 py-3"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-5">
                <h2 className="text-lg font-bold text-white mb-2">Tell Us About Your Project</h2>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm">
                    <AlertCircle size={16} />
                    Something went wrong. Please try again or email us directly.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs text-white/40 mb-1.5 font-medium">
                      Full Name <span className="text-blue-500">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-business" className="block text-xs text-white/40 mb-1.5 font-medium">
                      Business Name
                    </label>
                    <input
                      id="contact-business"
                      type="text"
                      name="businessName"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="Your business name"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs text-white/40 mb-1.5 font-medium">
                      Email Address <span className="text-blue-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@company.com"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs text-white/40 mb-1.5 font-medium">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-service" className="block text-xs text-white/40 mb-1.5 font-medium">
                      Service Required <span className="text-blue-500">*</span>
                    </label>
                    <select
                      id="contact-service"
                      name="serviceRequired"
                      value={form.serviceRequired}
                      onChange={handleChange}
                      required
                      className="input-dark appearance-none"
                    >
                      <option value="">Select a service</option>
                      {services.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-budget" className="block text-xs text-white/40 mb-1.5 font-medium">
                      Budget Range
                    </label>
                    <select
                      id="contact-budget"
                      name="budget"
                      value={form.budget}
                      onChange={handleChange}
                      className="input-dark appearance-none"
                    >
                      <option value="">Select budget</option>
                      {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs text-white/40 mb-1.5 font-medium">
                    Tell Us More <span className="text-blue-500">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your project, goals, and any specific requirements..."
                    className="input-dark resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-orange w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  id="contact-submit"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-white/20">
                  We typically respond within 24 hours. Your information is kept private.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
