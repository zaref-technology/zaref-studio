import Link from 'next/link';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { FaInstagram, FaFacebook, FaLinkedin, FaYoutube } from 'react-icons/fa';

const footerLinks = {
  'Services': [
    { label: 'Video Production', href: '/services' },
    { label: 'Video Editing', href: '/services' },
    { label: 'AI Video Creation', href: '/services' },
    { label: 'Social Media Marketing', href: '/services' },
    { label: 'WhatsApp Automation', href: '/services' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'Our Work', href: '/work' },
    { label: 'Contact', href: '/contact' },
  ],
};

const socials = [
  { icon: FaInstagram, href: 'https://www.instagram.com/zaref.in/',                    label: 'Instagram' },
  { icon: FaFacebook,  href: '#',                                                        label: 'Facebook' },
  { icon: FaLinkedin,  href: 'https://www.linkedin.com/company/zaref-technology',        label: 'LinkedIn' },
  { icon: FaYoutube,   href: 'https://youtube.com/@zaref-technology',                   label: 'YouTube' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060606] border-t border-white/[0.05] pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/[0.06]">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <span className="text-2xl font-black text-white">
                ZAREF<span className="text-gradient"> STUDIO</span>
              </span>
              <p className="mt-1 text-xs text-white/30 font-medium tracking-widest uppercase">
                Creative & Digital Marketing Division of Zaref Technology
              </p>
            </div>
            <p className="text-sm text-white/50 leading-relaxed max-w-sm mb-6">
              We create content that gets attention. Video production, AI-powered content, social media marketing, paid ads and WhatsApp automation.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-blue-600/50 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">{title}</h3>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200 flex items-center gap-1.5 group"
                    >
                      {link.label}
                      <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/25">
            © {currentYear} Zaref Studio. A division of Zaref Technology. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://wa.me/91XXXXXXXXXX?text=Hi%20Zaref%20Studio%2C%20I%20want%20to%20discuss%20a%20project"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-green-400/70 hover:text-green-400 transition-colors"
            >
              <MessageCircle size={12} />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
