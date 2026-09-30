import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919XXXXXXXXX?text=Hi%20Zaref%20Studio%2C%20I%20want%20to%20start%20a%20project"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-btn"
      aria-label="Chat on WhatsApp"
      id="whatsapp-float-btn"
    >
      <MessageCircle size={26} className="text-white" fill="white" />
    </a>
  );
}
