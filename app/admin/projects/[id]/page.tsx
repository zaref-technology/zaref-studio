'use client';

import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { Project } from '@/types';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft, Upload, X, Plus, Save, AlertCircle, CheckCircle,
  Image as ImageIcon, Video, Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';

const categories = ['Video', 'Reels', 'AI', 'Social Media', 'Ads'];

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function ProjectEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';
  const projectId = isNew ? null : params.id as string;

  const [form, setForm] = useState<Partial<Project>>({
    title: '', slug: '', clientName: '', category: '', shortDescription: '',
    description: '', coverImage: '', videoUrl: '', instagramReelUrl: '', gallery: [], projectUrl: '',
    tools: [], featured: false, published: false,
  });
  const [mediaTab, setMediaTab] = useState<'youtube' | 'reel'>('youtube');
  const [toolInput, setToolInput] = useState('');
  const [uploading, setUploading] = useState<{ cover?: number; gallery?: number; video?: number }>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loadingProject, setLoadingProject] = useState(!isNew);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!isNew && projectId) {
      getDoc(doc(db, 'projects', projectId)).then(snap => {
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Project;
          setForm(data);
          // Set tab based on which field is populated
          if (data.instagramReelUrl) setMediaTab('reel');
          else setMediaTab('youtube');
        }
        setLoadingProject(false);
      });
    }
  }, [isNew, projectId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && isNew ? { slug: slugify(value) } : {}),
    }));
  };

  const uploadFile = async (
    file: File,
    path: string,
    progressKey: keyof typeof uploading,
    onComplete: (url: string) => void
  ) => {
    const storageRef = ref(storage, `${path}/${Date.now()}-${file.name}`);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      (snapshot) => {
        const pct = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100);
        setUploading(prev => ({ ...prev, [progressKey]: pct }));
      },
      (err) => {
        showToast('error', 'Upload failed: ' + err.message);
        setUploading(prev => ({ ...prev, [progressKey]: undefined }));
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onComplete(url);
        setUploading(prev => ({ ...prev, [progressKey]: undefined }));
      }
    );
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { showToast('error', 'File too large. Max 10MB.'); return; }
    setUploading(prev => ({ ...prev, cover: 0 }));
    uploadFile(file, 'projects/covers', 'cover', url => setForm(prev => ({ ...prev, coverImage: url })));
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) { showToast('error', `${file.name} too large. Max 10MB.`); return; }
      setUploading(prev => ({ ...prev, gallery: 0 }));
      uploadFile(file, 'projects/gallery', 'gallery', url => {
        setForm(prev => ({ ...prev, gallery: [...(prev.gallery || []), url] }));
      });
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 200 * 1024 * 1024) { showToast('error', 'Video too large. Max 200MB.'); return; }
    setUploading(prev => ({ ...prev, video: 0 }));
    uploadFile(file, 'projects/videos', 'video', url => setForm(prev => ({ ...prev, videoUrl: url })));
  };

  const addTool = () => {
    if (toolInput.trim() && !form.tools?.includes(toolInput.trim())) {
      setForm(prev => ({ ...prev, tools: [...(prev.tools || []), toolInput.trim()] }));
      setToolInput('');
    }
  };

  const removeTool = (tool: string) => {
    setForm(prev => ({ ...prev, tools: prev.tools?.filter(t => t !== tool) }));
  };

  const removeGalleryImage = (url: string) => {
    setForm(prev => ({ ...prev, gallery: prev.gallery?.filter(g => g !== url) }));
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.category) {
      showToast('error', 'Title, slug and category are required.');
      return;
    }
    setSaving(true);
    try {
      const data = {
        ...form,
        updatedAt: serverTimestamp(),
        ...(isNew ? { createdAt: serverTimestamp() } : {}),
      };
      delete (data as any).id;

      if (isNew) {
        const docRef = await addDoc(collection(db, 'projects'), data);
        showToast('success', 'Project created successfully!');
        router.push(`/admin/projects/${docRef.id}`);
      } else {
        await updateDoc(doc(db, 'projects', projectId!), data);
        showToast('success', 'Project updated successfully!');
      }
    } catch (err: any) {
      showToast('error', 'Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingProject) {
    return (
      <>
        <AdminTopBar title="Loading..." />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminTopBar title={isNew ? 'New Project' : 'Edit Project'} />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/projects" className="text-white/30 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h2 className="text-lg font-black text-white">
              {isNew ? 'New Project' : 'Edit Project'}
            </h2>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-orange text-sm py-2 px-4 disabled:opacity-60"
            id="save-project-btn"
          >
            {saving ? (
              <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
            ) : (
              <><Save size={14} />Save Project</>
            )}
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Project Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title || ''}
                    onChange={handleChange}
                    placeholder="e.g. Brand Campaign for XYZ"
                    className="input-dark"
                    id="project-title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5">Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      value={form.slug || ''}
                      onChange={handleChange}
                      placeholder="project-slug"
                      className="input-dark font-mono text-xs"
                      id="project-slug"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5">Category *</label>
                    <select
                      name="category"
                      value={form.category || ''}
                      onChange={handleChange}
                      className="input-dark appearance-none"
                      id="project-category"
                    >
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Client Name</label>
                  <input
                    type="text"
                    name="clientName"
                    value={form.clientName || ''}
                    onChange={handleChange}
                    placeholder="Client or brand name"
                    className="input-dark"
                    id="project-client"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Short Description</label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={form.shortDescription || ''}
                    onChange={handleChange}
                    placeholder="One-line description for cards"
                    className="input-dark"
                    id="project-short-desc"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Full Description</label>
                  <textarea
                    name="description"
                    value={form.description || ''}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Detailed project description..."
                    className="input-dark resize-none"
                    id="project-description"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Project URL</label>
                  <div className="relative">
                    <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                    <input
                      type="url"
                      name="projectUrl"
                      value={form.projectUrl || ''}
                      onChange={handleChange}
                      placeholder="https://..."
                      className="input-dark pl-8"
                      id="project-url"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Cover Image</h3>
              <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              {form.coverImage ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/[0.06]">
                  <Image src={form.coverImage} alt="Cover" fill className="object-cover" />
                  <button
                    onClick={() => setForm(prev => ({ ...prev, coverImage: '' }))}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full aspect-video rounded-lg border-2 border-dashed border-white/10 hover:border-blue-600/30 flex flex-col items-center justify-center gap-2 text-white/30 hover:text-blue-400 transition-all"
                >
                  <ImageIcon size={24} />
                  <span className="text-sm">Click to upload cover image</span>
                  <span className="text-xs">JPG, PNG, WEBP — Max 10MB</span>
                </button>
              )}
              {uploading.cover !== undefined && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-white/40 mb-1">
                    <span>Uploading...</span><span>{uploading.cover}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploading.cover}%` }} />
                  </div>
                </div>
              )}
            </div>

            {/* Media — YouTube OR Instagram Reel (mutually exclusive) */}
            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
              {/* Tab switcher */}
              <div className="flex gap-1 mb-5 p-1 bg-white/[0.03] rounded-lg border border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => {
                    setMediaTab('youtube');
                    setForm(prev => ({ ...prev, instagramReelUrl: '' }));
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                    mediaTab === 'youtube'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                      : 'text-white/30 hover:text-white'
                  }`}
                  id="media-tab-youtube"
                >
                  <Video size={13} />
                  YouTube / Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMediaTab('reel');
                    setForm(prev => ({ ...prev, videoUrl: '' }));
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                    mediaTab === 'reel'
                      ? 'bg-pink-500/15 text-pink-400 border border-pink-500/25'
                      : 'text-white/30 hover:text-white'
                  }`}
                  id="media-tab-reel"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="2" width="20" height="20" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.1" fill="currentColor" strokeWidth="4"/>
                  </svg>
                  Instagram Reel
                </button>
              </div>

              {/* YouTube / Video tab */}
              {mediaTab === 'youtube' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-white/40 mb-1.5">YouTube / Vimeo / Video URL</label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={form.videoUrl || ''}
                      onChange={handleChange}
                      placeholder="https://youtube.com/watch?v=..."
                      className="input-dark"
                      id="project-video-url"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/20">
                    <span>— or upload a file —</span>
                  </div>
                  <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.06] hover:border-blue-600/25 text-sm text-white/40 hover:text-blue-400 transition-all"
                  >
                    <Video size={14} />
                    Upload Video File (Max 200MB)
                  </button>
                  {uploading.video !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs text-white/40 mb-1">
                        <span>Uploading...</span><span>{uploading.video}%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploading.video}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Instagram Reel tab */}
              {mediaTab === 'reel' && (
                <div className="space-y-3">
                  <label className="block text-xs text-white/40 mb-1.5">Instagram Reel URL</label>
                  <div className="relative">
                    <input
                      type="url"
                      name="instagramReelUrl"
                      value={form.instagramReelUrl || ''}
                      onChange={handleChange}
                      placeholder="https://www.instagram.com/reel/XXXXX/"
                      className="input-dark pr-20"
                      id="project-instagram-reel"
                    />
                    {form.instagramReelUrl && (
                      <a
                        href={form.instagramReelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-pink-400 hover:text-pink-300 bg-pink-500/10 border border-pink-500/20 px-2 py-1 rounded-md transition-colors"
                      >
                        Preview ↗
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-white/25">
                    Paste the full Reel URL. The embed will be shown on the project page.
                  </p>
                </div>
              )}
            </div>

            {/* Gallery */}
            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Gallery Images</h3>
              <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
              <div className="grid grid-cols-3 gap-3 mb-3">
                {form.gallery?.map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-white/[0.06]">
                    <Image src={img} alt={`Gallery ${i + 1}`} fill className="object-cover" />
                    <button
                      onClick={() => removeGalleryImage(img)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-colors"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-video rounded-lg border-2 border-dashed border-white/10 hover:border-blue-600/30 flex flex-col items-center justify-center gap-1 text-white/20 hover:text-blue-400 transition-all text-xs"
                >
                  <Plus size={18} />
                  Add Image
                </button>
              </div>
              {uploading.gallery !== undefined && (
                <div>
                  <div className="flex justify-between text-xs text-white/40 mb-1">
                    <span>Uploading...</span><span>{uploading.gallery}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all" style={{ width: `${uploading.gallery}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Publish settings */}
            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Publishing</h3>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm text-white/70">Published</div>
                    <div className="text-xs text-white/30">Visible on public website</div>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="published"
                      checked={form.published || false}
                      onChange={handleChange}
                      className="sr-only"
                      id="project-published"
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-colors ${form.published ? 'bg-blue-600' : 'bg-white/10'}`}
                      onClick={() => setForm(prev => ({ ...prev, published: !prev.published }))}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform shadow-sm ${form.published ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-sm text-white/70">Featured</div>
                    <div className="text-xs text-white/30">Show in featured section</div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors cursor-pointer ${form.featured ? 'bg-blue-600' : 'bg-white/10'}`}
                    onClick={() => setForm(prev => ({ ...prev, featured: !prev.featured }))}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full mt-0.5 transition-transform shadow-sm ${form.featured ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                  </div>
                </label>
              </div>
            </div>

            {/* Tools */}
            <div className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">Tools & Technologies</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={toolInput}
                  onChange={e => setToolInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTool())}
                  placeholder="e.g. Premiere Pro"
                  className="input-dark text-sm py-2 flex-1"
                  id="tool-input"
                />
                <button
                  onClick={addTool}
                  className="px-3 py-2 bg-blue-600/15 border border-blue-600/25 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.tools?.map(tool => (
                  <span
                    key={tool}
                    className="flex items-center gap-1 text-xs bg-white/[0.05] text-white/60 px-2.5 py-1 rounded-full border border-white/[0.06]"
                  >
                    {tool}
                    <button onClick={() => removeTool(tool)} className="hover:text-red-400 transition-colors">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Save button (repeated for convenience) */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-orange w-full justify-center text-sm py-3 disabled:opacity-60"
            >
              {saving ? (
                <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
              ) : (
                <><Save size={14} />Save Project</>
              )}
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`toast flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-green-500/15 border border-green-500/30 text-green-400'
              : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </div>
        )}
      </main>
    </>
  );
}
