'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  FolderOpen,
  Clapperboard,
  Star,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: FolderOpen,       label: 'Projects',  href: '/admin/projects' },
  { icon: Clapperboard,     label: 'Services',  href: '/admin/services' },
  { icon: Star,             label: 'Testimonials', href: '/admin/testimonials' },
  { icon: Users,            label: 'Leads',     href: '/admin/leads' },
  { icon: ImageIcon,        label: 'Media',     href: '/admin/media' },
  { icon: Settings,         label: 'Settings',  href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = ({ onClose }: { onClose?: () => void }) => (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {navItems.map(({ icon: Icon, label, href }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            title={collapsed ? label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              active
                ? 'bg-blue-600/15 text-blue-400 border border-blue-600/20'
                : 'text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent'
            } ${collapsed ? 'justify-center' : ''}`}
          >
            <Icon size={17} />
            {!collapsed && label}
          </Link>
        );
      })}
    </nav>
  );

  const SidebarInner = ({ onClose }: { onClose?: () => void }) => (
    <>
      {/* Logo */}
      <div className={`px-4 py-5 border-b border-white/[0.06] flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div>
            <div className="text-sm font-black text-white">
              ZAREF<span className="text-blue-500"> STUDIO</span>
            </div>
            <div className="text-[10px] text-white/20 uppercase tracking-widest">Admin Panel</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="hidden lg:flex p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
          aria-label="Toggle sidebar"
        >
          <ChevronRight size={14} className={`transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation */}
      <NavLinks onClose={onClose} />

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        {!collapsed && user && (
          <div className="px-3 py-2 mb-2">
            <div className="text-[11px] text-white/25 truncate">{user.email}</div>
          </div>
        )}
        <button
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] w-full transition-all ${collapsed ? 'justify-center' : ''}`}
          id="admin-logout-btn"
        >
          <LogOut size={17} />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 admin-sidebar transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}
        aria-label="Admin navigation"
      >
        <SidebarInner />
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-[#111] border border-white/10 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
        <aside className="absolute left-0 top-0 bottom-0 w-56 admin-sidebar flex flex-col">
          <div className="absolute top-3 right-3">
            <button
              onClick={() => setMobileOpen(false)}
              className="text-white/40 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>
          <SidebarInner onClose={() => setMobileOpen(false)} />
        </aside>
      </div>
    </>
  );
}
