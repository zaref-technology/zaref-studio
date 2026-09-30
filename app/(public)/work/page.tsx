'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Star, Grid3X3, Grid2X2 } from 'lucide-react';

const categories = ['All', 'Video', 'Reels', 'AI', 'Social Media', 'Ads'];

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [gridSize, setGridSize] = useState<'lg' | 'sm'>('lg');

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(
          collection(db, 'projects'),
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        setProjects(data);
        setFiltered(data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleFilter = (cat: string) => {
    setActiveCategory(cat);
    setFiltered(cat === 'All' ? projects : projects.filter(p => p.category === cat));
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24">
      {/* Header */}
      <section className="relative pb-12 pt-8 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #1D6AFF, transparent 70%)' }}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <span className="section-label block mb-5">Portfolio</span>
          <h1 className="display-text text-white mb-6">
            WORK THAT
            <br />
            <span className="text-gradient">SPEAKS</span>
            <br />
            LOUDER.
          </h1>
          <p className="text-white/40 text-lg max-w-xl">
            A curated showcase of video production, AI content, social media campaigns, and digital marketing that drove real results.
          </p>
        </div>
      </section>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 pb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
                id={`work-filter-${cat.toLowerCase().replace(' ', '-')}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setGridSize('lg')}
              className={`p-2 rounded-lg border transition-all ${gridSize === 'lg' ? 'border-blue-600/50 text-blue-400' : 'border-white/10 text-white/30'}`}
              aria-label="Large grid"
            >
              <Grid2X2 size={16} />
            </button>
            <button
              onClick={() => setGridSize('sm')}
              className={`p-2 rounded-lg border transition-all ${gridSize === 'sm' ? 'border-blue-600/50 text-blue-400' : 'border-white/10 text-white/30'}`}
              aria-label="Small grid"
            >
              <Grid3X3 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="mx-auto max-w-7xl px-6 md:px-8 pb-24">
        {loading ? (
          <div className={`grid gap-6 ${gridSize === 'lg' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32 text-white/30">
            <Play size={48} className="mx-auto mb-6 opacity-20" />
            <h2 className="text-2xl font-bold mb-2">No projects yet</h2>
            <p className="text-sm">Projects will appear here once published.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${gridSize === 'lg' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
            {filtered.map((project) => (
              <WorkProjectCard key={project.id} project={project} large={gridSize === 'lg'} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkProjectCard({ project, large }: { project: Project; large: boolean }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative bg-[#0e0e0c] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-blue-600/20 transition-all duration-300 block"
    >
      {/* Image */}
      <div className={`relative overflow-hidden bg-[#111] ${large ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent flex items-center justify-center">
            <Play size={40} className="text-blue-600/20" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
            View Project <ArrowRight size={14} />
          </span>
        </div>

        {/* Badges */}
        {project.featured && (
          <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={8} fill="currentColor" />
            Featured
          </div>
        )}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white/70 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
          {project.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h2 className="font-bold text-white text-lg mb-1.5 group-hover:text-blue-200 transition-colors">
          {project.title}
        </h2>
        <p className="text-xs text-white/30 mb-2">{project.clientName}</p>
        <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
          {project.shortDescription}
        </p>
      </div>
    </Link>
  );
}
