import type { Metadata } from 'next';
import HeroSection from '@/components/public/HeroSection';
import ServicesSection from '@/components/public/ServicesSection';
import ProcessSection from '@/components/public/ProcessSection';
import PortfolioSection from '@/components/public/PortfolioSection';
import AISection from '@/components/public/AISection';
import SocialMediaSection from '@/components/public/SocialMediaSection';
import WhatsAppSection from '@/components/public/WhatsAppSection';
import TestimonialsSection from '@/components/public/TestimonialsSection';
import CTASection from '@/components/public/CTASection';

export const metadata: Metadata = {
  title: 'Zaref Studio — Creative, AI & Digital Marketing Studio',
  description: 'Zaref Studio creates high-impact videos, AI content, social media campaigns, paid ads and WhatsApp automation to help businesses grow online.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <PortfolioSection />
      <AISection />
      <SocialMediaSection />
      <WhatsAppSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
