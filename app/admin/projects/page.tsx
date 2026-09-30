'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import AdminTopBar from '@/components/admin/AdminTopBar';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Search, Edit2, Trash2, Eye, EyeOff, Star, StarOff,
  Filter, AlertTriangle, CheckCircle,
} from 'lucide-react';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filtered, setFiltered] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const categories = ['All', 'Video', 'Reels', 'AI', 'Social Media', 'Ads'];

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
      setProjects(data);
      setFiltered(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  useEffect(() => {
    let result = projects;
    if (search) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (categoryFilter !== 'All') {
      result = result.filter(p => p.category === categoryFilter);
    }
    setFiltered(result);
  }, [search, categoryFilter, projects]);

  const handleTogglePublish = async (project: Project) => {
    try {
      await updateDoc(doc(db, 'projects', project.id!), { published: !project.published });
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, published: !p.published } : p));
      showToast('success', `Project ${project.published ? 'unpublished' : 'published'} successfully`);
    } catch {
      showToast('error', 'Failed to update project');
    }
  };

  const handleToggleFeatured = async (project: Project) => {
    try {
      await updateDoc(doc(db, 'projects', project.id!), { featured: !project.featured });
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, featured: !p.featured } : p));
      showToast('success', `Project ${project.featured ? 'unfeatured' : 'featured'} successfully`);
    } catch {
      showToast('error', 'Failed to update project');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast('success', 'Project deleted successfully');
    } catch {
      showToast('error', 'Failed to delete project');
    }
    setDeleteId(null);
  };

  return (
    <>
      <AdminTopBar title="Projects" />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Projects</h2>
            <p className="text-xs text-white/30">{projects.length} total projects</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="btn-orange text-sm py-2 px-4"
            id="admin-new-project-btn"
          >
            <Plus size={15} />
            New Project
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={14} className="text-white/30" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white/70 placeholder-white/20 outline-none flex-1"
              id="admin-projects-search"
            />
          </div>
          <div className="flex gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-600/25'
                    : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg shimmer" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="text-lg font-bold mb-2">No projects found</p>
            <p className="text-sm mb-6">Add your first project to get started.</p>
            <Link href="/admin/projects/new" className="btn-orange text-sm">
              <Plus size={14} />
              Add Project
            </Link>
          </div>
        ) : (
          <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-5 py-3">Project</th>
                  <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Category</th>
                  <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Client</th>
                  <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-right text-[11px] font-semibold text-white/30 uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Project */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#1a1a1a] flex-shrink-0">
                          {project.coverImage ? (
                            <Image
                              src={project.coverImage}
                              alt={project.title}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full bg-blue-600/10" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white line-clamp-1">{project.title}</p>
                          <p className="text-xs text-white/30">/{project.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-white/50 bg-white/[0.05] px-2 py-0.5 rounded-full">
                        {project.category}
                      </span>
                    </td>

                    {/* Client */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="text-xs text-white/40">{project.clientName || '—'}</span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          project.published
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {project.published ? 'Published' : 'Draft'}
                        </span>
                        {project.featured && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle publish */}
                        <button
                          onClick={() => handleTogglePublish(project)}
                          className={`p-1.5 rounded-lg transition-all ${
                            project.published
                              ? 'text-green-400 hover:bg-green-500/10'
                              : 'text-white/30 hover:bg-white/[0.05] hover:text-white'
                          }`}
                          title={project.published ? 'Unpublish' : 'Publish'}
                        >
                          {project.published ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        {/* Toggle featured */}
                        <button
                          onClick={() => handleToggleFeatured(project)}
                          className={`p-1.5 rounded-lg transition-all ${
                            project.featured
                              ? 'text-yellow-400 hover:bg-yellow-500/10'
                              : 'text-white/30 hover:bg-white/[0.05] hover:text-white'
                          }`}
                          title={project.featured ? 'Unfeature' : 'Feature'}
                        >
                          {project.featured ? <Star size={14} /> : <StarOff size={14} />}
                        </button>

                        {/* Edit */}
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(project.id!)}
                          className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`toast flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-green-500/15 border border-green-500/30 text-green-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {toast.message}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Project</h3>
                <p className="text-xs text-white/40">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-sm text-white/50 mb-6">
              Are you sure you want to permanently delete this project?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="btn-ghost flex-1 justify-center text-sm py-2.5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                id="confirm-delete-project"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
