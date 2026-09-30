'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search } from 'lucide-react';

export default function AdminTopBar({ title }: { title?: string }) {
  const { user } = useAuth();

  return (
    <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-6 bg-[#0a0a0a] sticky top-0 z-30">
      {/* Title */}
      <h1 className="text-sm font-semibold text-white">{title || 'Admin'}</h1>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5">
          <Search size={13} className="text-white/30" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-xs text-white/60 placeholder-white/20 outline-none w-32"
          />
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-lg border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white transition-colors" aria-label="Notifications">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-600" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
          <span className="text-xs font-bold text-blue-400">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </span>
        </div>
      </div>
    </header>
  );
}
