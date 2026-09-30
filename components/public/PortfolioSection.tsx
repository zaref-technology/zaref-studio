'use client';

import { useEffect, useState, useRef } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Play, Star } from 'lucide-react';

const categories = ['All', 'Video', 'Reels', 'AI', 'Social Media', 'Ads'];

export default function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(
          collection(db, 'projects'),
          where('published', '==', true),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const snap = await getDocs(q);
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        setProjects(data);
        setFiltered(data);
      } catch {
        setProjects([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleFilter = (category: string) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFiltered(projects);
    } else {
      setFiltered(projects.filter(p => p.category === category));
    }
  };

  return (
    <section className="section-padding bg-[#060606] relative overflow-hidden" aria-labelledby="portfolio-heading">
      {/* Top accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-20"
        style={{ background: 'linear-gradient(90deg, transparent, #1D6AFF, transparent)' }}
      />

      <div className="mx-auto max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label block mb-4">Portfolio</span>
            <h2 id="portfolio-heading" className="headline-text text-white">
              WORK THAT{' '}
              <span className="text-gradient">SPEAKS</span>
              <br />
              LOUDER.
            </h2>
          </div>
          <Link
            href="/work"
            className="flex-shrink-0 inline-flex items-center gap-2 text-sm text-white/50 hover:text-blue-400 transition-colors font-medium"
          >
            View all projects
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              id={`portfolio-filter-${cat.toLowerCase().replace(' ', '-')}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="portfolio-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-xl shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <Play size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Projects coming soon</p>
            <p className="text-sm mt-2">Our portfolio is being curated. Check back shortly.</p>
          </div>
        ) : (
          <div className="portfolio-grid">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link href="/work" className="btn-orange px-8 py-3.5" id="portfolio-view-all">
            View All Projects
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group relative bg-[#0e0e0c] rounded-xl overflow-hidden border border-white/[0.06] hover:border-blue-600/25 transition-all duration-300 hover-lift block"
      aria-label={`View project: ${project.title}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111]">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent flex items-center justify-center">
            <Play size={32} className="text-blue-600/30" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2">
            View Project <ArrowRight size={14} />
          </span>
        </div>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1">
            <Star size={8} fill="currentColor" />
            Featured
          </div>
        )}

        {/* Category badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white/70 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10">
          {project.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-white text-base mb-1.5 group-hover:text-blue-200 transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="text-xs text-white/35 mb-1">{project.clientName}</p>
        <p className="text-sm text-white/40 line-clamp-2 leading-relaxed">
          {project.shortDescription}
        </p>
      </div>
    </Link>
  );
}
