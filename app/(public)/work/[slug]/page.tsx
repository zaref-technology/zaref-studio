import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Calendar, Tag, User, Wrench, ExternalLink } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

// Convert a YouTube watch URL → embed URL
function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0&modestbranding=1`;
}

// Convert Instagram reel URL → embed URL
function getInstagramEmbedUrl(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) return null;
  return `https://www.instagram.com/reel/${match[1]}/embed/captioned/`;
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    const q = query(
      collection(db, 'projects'),
      where('slug', '==', slug),
      where('published', '==', true)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as Project;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Project Not Found — Zaref Studio' };
  return {
    title: `${project.title} — Zaref Studio`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.coverImage ? [{ url: project.coverImage }] : [],
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const formattedDate = project.createdAt
    ? new Date(project.createdAt.toDate()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : null;

  const youtubeEmbed = project.videoUrl ? getYouTubeEmbedUrl(project.videoUrl) : null;
  const isDirectVideo = project.videoUrl && !youtubeEmbed;
  const instagramEmbed = project.instagramReelUrl ? getInstagramEmbedUrl(project.instagramReelUrl) : null;

  return (
    <div className="min-h-screen bg-[#060606]">

      {/* ── CINEMATIC HERO ─────────────────────────────────── */}
      <div className="relative w-full" style={{ height: 'min(70vh, 700px)' }}>
        {/* Cover image */}
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-[#080808] to-[#080808]" />
        )}

        {/* Multi-layer dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606]/80 via-transparent to-transparent" />

        {/* Grain texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Back nav */}
        <div className="absolute top-28 left-0 right-0 px-6 md:px-12 lg:px-16">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/40 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={13} />
            All Work
          </Link>
        </div>

        {/* Hero text — anchored bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-16 pb-10">
          {/* Category badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
              {project.instagramReelUrl && (
                <FaInstagram size={10} className="text-pink-400" />
              )}
              {project.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.0] mb-4 max-w-3xl" style={{ letterSpacing: '-0.03em' }}>
            {project.title}
          </h1>

          {project.clientName && (
            <p className="text-sm text-white/40 font-medium">
              {project.clientName}{formattedDate && <span className="text-white/20"> · {formattedDate}</span>}
            </p>
          )}
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16 py-14">
        <div className="grid lg:grid-cols-[1fr_320px] gap-14">

          {/* ── LEFT: Main content ── */}
          <div className="space-y-12">

            {/* Short description pullquote */}
            {project.shortDescription && (
              <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-light border-l-2 border-blue-500/40 pl-5">
                {project.shortDescription}
              </p>
            )}

            {/* Full description */}
            {project.description && (
              <div className="text-white/50 leading-relaxed whitespace-pre-line text-base space-y-4">
                {project.description}
              </div>
            )}

            {/* ── MEDIA PLAYER ── */}
            {(project.videoUrl || project.instagramReelUrl) && (
              <div>
                {/* YouTube embed */}
                {youtubeEmbed && (
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-md bg-red-500/20 flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="#ef4444"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-2.75 12.65 12.65 0 00-9.4 0A4.83 4.83 0 012.41 6.69 33.5 33.5 0 002 12a33.5 33.5 0 00.41 5.31 4.83 4.83 0 003.77 2.75 12.65 12.65 0 009.4 0 4.83 4.83 0 003.77-2.75A33.5 33.5 0 0022 12a33.5 33.5 0 00-.41-5.31z"/><polygon fill="white" points="10 15 15 12 10 9 10 15"/></svg>
                      </div>
                      <h2 className="text-sm font-bold text-white uppercase tracking-wider">Project Video</h2>
                    </div>
                    <div className="relative w-full rounded-2xl overflow-hidden border border-white/[0.07] bg-black" style={{ aspectRatio: '16/9' }}>
                      <iframe
                        src={youtubeEmbed}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Project Video"
                      />
                    </div>
                  </div>
                )}

                {/* Direct video file */}
                {isDirectVideo && (
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Project Video</h2>
                    <div className="relative w-full rounded-2xl overflow-hidden border border-white/[0.07] bg-black" style={{ aspectRatio: '16/9' }}>
                      <video src={project.videoUrl} controls className="w-full h-full" preload="metadata" />
                    </div>
                  </div>
                )}

                {/* Instagram Reel embed */}
                {instagramEmbed && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#833AB4,#FD1D1D,#FCB045)' }}>
                          <FaInstagram size={12} className="text-white" />
                        </div>
                        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Instagram Reel</h2>
                      </div>
                      <a
                        href={project.instagramReelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors"
                      >
                        Open on Instagram <ArrowUpRight size={11} />
                      </a>
                    </div>

                    {/* Portrait container — centred, max 400px wide */}
                    <div className="flex justify-center">
                      <div
                        className="relative w-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl"
                        style={{ maxWidth: 400, aspectRatio: '9/16' }}
                      >
                        {/* Gradient border shimmer */}
                        <div className="absolute inset-0 rounded-2xl z-10 pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(253,29,29,0.15)' }} />
                        <iframe
                          src={instagramEmbed}
                          className="absolute inset-0 w-full h-full"
                          frameBorder="0"
                          scrolling="no"
                          allow="encrypted-media; picture-in-picture"
                          title="Instagram Reel"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── GALLERY ── */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Gallery</h2>
                <div className={`grid gap-3 ${project.gallery.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {project.gallery.map((img, i) => (
                    <div
                      key={i}
                      className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-[#111] group ${
                        project.gallery.length > 2 && i === 0 ? 'col-span-2 aspect-[16/7]' : 'aspect-video'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${project.title} — ${i + 1}`}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <div className="space-y-5">

            {/* Project meta card */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] backdrop-blur-sm p-6 space-y-5 sticky top-24">

              {/* Meta rows */}
              {project.clientName && (
                <div className="flex items-start gap-3">
                  <User size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5">Client</div>
                    <div className="text-sm text-white/80 font-medium">{project.clientName}</div>
                  </div>
                </div>
              )}
              {project.category && (
                <div className="flex items-start gap-3">
                  <Tag size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5">Category</div>
                    <div className="text-sm text-white/80 font-medium">{project.category}</div>
                  </div>
                </div>
              )}
              {formattedDate && (
                <div className="flex items-start gap-3">
                  <Calendar size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5">Date</div>
                    <div className="text-sm text-white/80 font-medium">{formattedDate}</div>
                  </div>
                </div>
              )}
              {project.tools && project.tools.length > 0 && (
                <div className="flex items-start gap-3">
                  <Wrench size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] text-white/25 uppercase tracking-widest mb-1">Tools</div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.map(tool => (
                        <span key={tool} className="text-[11px] bg-white/[0.05] border border-white/[0.06] text-white/50 px-2 py-0.5 rounded-full">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Divider */}
              {(project.projectUrl || project.instagramReelUrl) && (
                <div className="border-t border-white/[0.05] pt-4 space-y-2.5">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      <ExternalLink size={13} />
                      View Live Project
                    </a>
                  )}
                  {project.instagramReelUrl && (
                    <a
                      href={project.instagramReelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl transition-all"
                      style={{
                        background: 'linear-gradient(135deg,rgba(131,58,180,.12),rgba(253,29,29,.08),rgba(252,176,69,.08))',
                        border: '1px solid rgba(253,29,29,.18)',
                        color: '#f472b6',
                      }}
                    >
                      <FaInstagram size={13} />
                      Watch Reel on Instagram
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* CTA card */}
            <div className="rounded-2xl p-5 border border-blue-500/10 bg-blue-600/[0.04]">
              <h3 className="text-sm font-bold text-white mb-1">Like what you see?</h3>
              <p className="text-xs text-white/35 mb-4">Let&apos;s create something great for your brand.</p>
              <Link
                href="/contact"
                className="btn-orange w-full justify-center text-sm py-2.5"
                id="project-cta"
              >
                Start a Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
