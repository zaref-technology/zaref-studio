'use client';

import { useEffect, useRef, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { ref as storageRef, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { MediaFile } from '@/types';
import AdminTopBar from '@/components/admin/AdminTopBar';
import Image from 'next/image';
import {
  Upload, Trash2, Copy, CheckCircle, AlertTriangle,
  Image as ImageIcon, Film, File as FileIcon, X,
} from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileTypeIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) return <ImageIcon size={16} className="text-blue-400" />;
  if (type.startsWith('video/')) return <Film size={16} className="text-purple-400" />;
  return <FileIcon size={16} className="text-white/40" />;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<{ id: string; storagePath: string } | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [typeFilter, setTypeFilter] = useState<'all' | 'image' | 'video' | 'other'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchFiles = async () => {
    try {
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setFiles(snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaFile)));
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchFiles(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { showToast('error', 'File too large. Max 50MB.'); return; }

    setUploading(true);
    setUploadProgress(0);

    const path = `media/${Date.now()}-${file.name}`;
    const sRef = storageRef(storage, path);
    const task = uploadBytesResumable(sRef, file);

    task.on(
      'state_changed',
      snap => setUploadProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      err => { showToast('error', 'Upload failed: ' + err.message); setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        await addDoc(collection(db, 'media'), {
          name: file.name,
          url,
          type: file.type,
          size: file.size,
          storagePath: path,
          createdAt: serverTimestamp(),
        });
        showToast('success', 'File uploaded!');
        setUploading(false);
        fetchFiles();
      }
    );
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDoc(doc(db, 'media', deleteId.id));
      try { await deleteObject(storageRef(storage, deleteId.storagePath)); } catch { }
      setFiles(prev => prev.filter(f => f.id !== deleteId.id));
      showToast('success', 'File deleted.');
    } catch { showToast('error', 'Delete failed.'); }
    setDeleteId(null);
  };

  const filtered = files.filter(f => {
    if (typeFilter === 'all') return true;
    if (typeFilter === 'image') return f.type.startsWith('image/');
    if (typeFilter === 'video') return f.type.startsWith('video/');
    return !f.type.startsWith('image/') && !f.type.startsWith('video/');
  });

  return (
    <>
      <AdminTopBar title="Media Library" />
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Media Library</h2>
            <p className="text-xs text-white/30">{files.length} files · {formatBytes(files.reduce((acc, f) => acc + f.size, 0))}</p>
          </div>
          <div>
            <input ref={inputRef} type="file" accept="image/*,video/*" onChange={handleUpload} className="hidden" id="media-upload-input" />
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="btn-orange text-sm py-2 px-4 disabled:opacity-60"
              id="media-upload-btn"
            >
              <Upload size={15} />
              {uploading ? `Uploading ${uploadProgress}%` : 'Upload File'}
            </button>
          </div>
        </div>

        {/* Upload progress bar */}
        {uploading && (
          <div className="mb-5">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-200 rounded-full" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-5">
          {(['all', 'image', 'video', 'other'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                typeFilter === t
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/25'
                  : 'bg-white/[0.04] text-white/40 border border-white/[0.06] hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Drop zone if empty */}
        {!loading && filtered.length === 0 ? (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-white/10 hover:border-blue-500/30 rounded-2xl p-16 flex flex-col items-center gap-3 text-white/30 hover:text-blue-400 transition-all"
          >
            <Upload size={32} />
            <span className="text-sm font-medium">Click to upload, or drag files here</span>
            <span className="text-xs">Images & Videos · Max 50MB</span>
          </button>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <div key={i} className="aspect-square rounded-xl shimmer" />)
              : filtered.map(file => (
                <div
                  key={file.id}
                  className="group relative bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden hover:border-blue-500/20 transition-all"
                >
                  {/* Preview */}
                  <div className="aspect-square relative bg-[#0a0a0a]">
                    {file.type.startsWith('image/') ? (
                      <Image src={file.url} alt={file.name} fill className="object-cover" sizes="200px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileTypeIcon type={file.type} />
                      </div>
                    )}

                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleCopy(file.url)}
                        className="w-8 h-8 bg-white/10 hover:bg-blue-500/30 border border-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
                        title="Copy URL"
                      >
                        {copiedUrl === file.url ? <CheckCircle size={14} className="text-green-400" /> : <Copy size={14} />}
                      </button>
                      <button
                        onClick={() => setDeleteId({ id: file.id!, storagePath: file.storagePath })}
                        className="w-8 h-8 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg flex items-center justify-center text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-[10px] text-white/50 truncate">{file.name}</p>
                    <p className="text-[10px] text-white/25">{formatBytes(file.size)}</p>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {toast && (
          <div className={`toast flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${toast.type === 'success' ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {toast.message}
          </div>
        )}
      </main>

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center"><AlertTriangle size={18} className="text-red-400" /></div>
              <div><h3 className="text-base font-bold text-white">Delete File</h3><p className="text-xs text-white/40">This also removes it from Storage.</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center text-sm py-2.5">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" id="confirm-delete-media">
                <Trash2 size={14} />Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
