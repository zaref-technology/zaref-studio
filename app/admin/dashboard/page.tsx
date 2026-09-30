'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { FolderOpen, Eye, FileX, Clapperboard, Star, Users, MessageSquare, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalServices: number;
  totalTestimonials: number;
  totalLeads: number;
  featuredProjects: number;
  newLeads: number;
}

function StatCard({ icon: Icon, label, value, href, color }: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  href?: string;
  color?: string;
}) {
  const content = (
    <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5 hover:border-blue-600/20 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color || 'bg-blue-600/10'}`}>
          <Icon size={17} className="text-blue-400" />
        </div>
        {href && (
          <span className="text-xs text-white/20 group-hover:text-blue-400 transition-colors">→</span>
        )}
      </div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-xs text-white/35 font-medium">{label}</div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0, publishedProjects: 0, draftProjects: 0,
    totalServices: 0, totalTestimonials: 0, totalLeads: 0,
    featuredProjects: 0, newLeads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [projectsSnap, servicesSnap, testimonialsSnap, leadsSnap] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'services')),
          getDocs(collection(db, 'testimonials')),
          getDocs(collection(db, 'leads')),
        ]);

        const projects = projectsSnap.docs.map(d => d.data());
        const leads = leadsSnap.docs.map(d => d.data());

        setStats({
          totalProjects: projects.length,
          publishedProjects: projects.filter(p => p.published).length,
          draftProjects: projects.filter(p => !p.published).length,
          totalServices: servicesSnap.size,
          totalTestimonials: testimonialsSnap.size,
          totalLeads: leadsSnap.size,
          featuredProjects: projects.filter(p => p.featured).length,
          newLeads: leads.filter(l => l.status === 'new').length,
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <>
      <AdminTopBar title="Dashboard" />
      <main className="flex-1 p-6 overflow-auto">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-white mb-1">Good day! 👋</h2>
          <p className="text-sm text-white/35">Here&apos;s what&apos;s happening with Zaref Studio.</p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FolderOpen} label="Total Projects" value={stats.totalProjects} href="/admin/projects" />
            <StatCard icon={Eye} label="Published" value={stats.publishedProjects} href="/admin/projects" color="bg-green-500/10" />
            <StatCard icon={FileX} label="Drafts" value={stats.draftProjects} href="/admin/projects" color="bg-yellow-500/10" />
            <StatCard icon={Star} label="Featured" value={stats.featuredProjects} href="/admin/projects" color="bg-purple-500/10" />
            <StatCard icon={Clapperboard} label="Services" value={stats.totalServices} href="/admin/services" />
            <StatCard icon={MessageSquare} label="Testimonials" value={stats.totalTestimonials} href="/admin/testimonials" />
            <StatCard icon={Users} label="Total Leads" value={stats.totalLeads} href="/admin/leads" />
            <StatCard icon={TrendingUp} label="New Leads" value={stats.newLeads} href="/admin/leads" color="bg-red-500/10" />
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Add Project', href: '/admin/projects/new', icon: FolderOpen },
                { label: 'Add Service', href: '/admin/services', icon: Clapperboard },
                { label: 'View Leads', href: '/admin/leads', icon: Users },
                { label: 'Upload Media', href: '/admin/media', icon: MessageSquare },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.03] hover:bg-blue-600/10 border border-white/[0.05] hover:border-blue-600/20 text-xs font-medium text-white/50 hover:text-blue-400 transition-all"
                >
                  <action.icon size={14} />
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Getting Started</h3>
            <div className="space-y-3">
              {[
                { label: 'Configure site settings', href: '/admin/settings', done: false },
                { label: 'Add your first service', href: '/admin/services', done: stats.totalServices > 0 },
                { label: 'Upload a project', href: '/admin/projects/new', done: stats.totalProjects > 0 },
                { label: 'Add a testimonial', href: '/admin/testimonials', done: stats.totalTestimonials > 0 },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 text-sm">
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${item.done ? 'bg-green-500/20 border-green-500/50' : 'border-white/10'}`}>
                    {item.done && <span className="text-green-400 text-[8px]">✓</span>}
                  </div>
                  <Link href={item.href} className={`hover:text-blue-400 transition-colors ${item.done ? 'text-white/30 line-through' : 'text-white/50'}`}>
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
