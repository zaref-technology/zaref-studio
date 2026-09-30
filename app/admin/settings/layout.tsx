'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && !user) router.replace('/admin/login'); }, [user, loading, router]);
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" /></div>;
  if (!user) return null;
  return <div className="flex min-h-screen bg-[#0a0a0a]"><AdminSidebar /><div className="flex-1 flex flex-col min-w-0">{children}</div></div>;
}
