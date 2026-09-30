'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Testimonial } from '@/types';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { Plus, Edit2, Trash2, Save, X, AlertTriangle, CheckCircle, Star, Eye, EyeOff } from 'lucide-react';

const empty: Partial<Testimonial> = {
  clientName: '', company: '', role: '', testimonial: '',
  clientImage: '', rating: 5, project: '', published: true,
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetch = async () => {
    try {
      const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial)));
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!editing?.clientName || !editing?.testimonial) {
      showToast('error', 'Client name and testimonial are required.'); return;
    }
    setSaving(true);
    try {
      const data = { ...editing, updatedAt: serverTimestamp() };
      delete (data as any).id;
      if (isNew) {
        await addDoc(collection(db, 'testimonials'), { ...data, createdAt: serverTimestamp() });
        showToast('success', 'Testimonial added!');
      } else {
        await updateDoc(doc(db, 'testimonials', editing!.id!), data);
        showToast('success', 'Testimonial updated!');
      }
      setEditing(null); setIsNew(false); fetch();
    } catch (err: any) { showToast('error', 'Save failed: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
      setItems(prev => prev.filter(i => i.id !== id));
      showToast('success', 'Deleted.');
    } catch { showToast('error', 'Delete failed.'); }
    setDeleteId(null);
  };

  const togglePublished = async (item: Testimonial) => {
    try {
      await updateDoc(doc(db, 'testimonials', item.id!), { published: !item.published });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, published: !i.published } : i));
    } catch { showToast('error', 'Update failed.'); }
  };

  return (
    <>
      <AdminTopBar title="Testimonials" />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Testimonials</h2>
            <p className="text-xs text-white/30">{items.length} testimonials</p>
          </div>
          <button
            onClick={() => { setEditing({ ...empty }); setIsNew(true); }}
            className="btn-orange text-sm py-2 px-4"
            id="add-testimonial-btn"
          >
            <Plus size={15} /> Add Testimonial
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 rounded-xl shimmer" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-white/30">
            <p className="mb-4">No testimonials yet.</p>
            <button onClick={() => { setEditing({ ...empty }); setIsNew(true); }} className="btn-orange text-sm">
              <Plus size={14} /> Add First Testimonial
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map(item => (
              <div key={item.id} className="bg-[#111] border border-white/[0.07] rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-bold text-white">{item.clientName}</div>
                    <div className="text-xs text-white/30">{item.role}{item.company ? ` · ${item.company}` : ''}</div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => togglePublished(item)}
                      className={`p-1.5 rounded-lg transition-all ${item.published ? 'text-green-400 hover:bg-green-500/10' : 'text-white/30 hover:bg-white/[0.05]'}`}
                      title={item.published ? 'Unpublish' : 'Publish'}>
                      {item.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => { setEditing({ ...item }); setIsNew(false); }}
                      className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-all">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => setDeleteId(item.id!)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/[0.08] transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} size={11} className="text-blue-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-white/45 line-clamp-3 leading-relaxed">"{item.testimonial}"</p>
                <div className="mt-3 flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                    item.published ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/[0.05] text-white/30 border-white/10'
                  }`}>
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {toast && (
          <div className={`toast flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${toast.type === 'success' ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'}`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {toast.message}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setEditing(null)} />
          <div className="relative glass rounded-2xl w-full max-w-lg border border-white/10 max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <h3 className="text-base font-bold text-white">{isNew ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
              <button onClick={() => setEditing(null)} className="text-white/30 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Client Name *</label>
                  <input type="text" value={editing.clientName || ''} onChange={e => setEditing(p => ({ ...p!, clientName: e.target.value }))} placeholder="Name" className="input-dark text-sm py-2" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Company</label>
                  <input type="text" value={editing.company || ''} onChange={e => setEditing(p => ({ ...p!, company: e.target.value }))} placeholder="Company" className="input-dark text-sm py-2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Role</label>
                  <input type="text" value={editing.role || ''} onChange={e => setEditing(p => ({ ...p!, role: e.target.value }))} placeholder="CEO, Founder..." className="input-dark text-sm py-2" />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Rating (1–5)</label>
                  <input type="number" min={1} max={5} value={editing.rating || 5} onChange={e => setEditing(p => ({ ...p!, rating: Number(e.target.value) }))} className="input-dark text-sm py-2" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Client Image URL</label>
                <input type="url" value={editing.clientImage || ''} onChange={e => setEditing(p => ({ ...p!, clientImage: e.target.value }))} placeholder="https://..." className="input-dark text-sm py-2" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Testimonial *</label>
                <textarea value={editing.testimonial || ''} onChange={e => setEditing(p => ({ ...p!, testimonial: e.target.value }))} rows={4} placeholder="What the client said..." className="input-dark text-sm resize-none" />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Related Project</label>
                <input type="text" value={editing.project || ''} onChange={e => setEditing(p => ({ ...p!, project: e.target.value }))} placeholder="Project name" className="input-dark text-sm py-2" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editing.published ?? true} onChange={e => setEditing(p => ({ ...p!, published: e.target.checked }))} className="w-4 h-4 accent-blue-600" />
                <span className="text-sm text-white/60">Published</span>
              </label>
            </div>
            <div className="flex gap-3 p-5 border-t border-white/[0.06]">
              <button onClick={() => setEditing(null)} className="btn-ghost flex-1 justify-center text-sm py-2.5">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-orange flex-1 justify-center text-sm py-2.5">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={14} />Save</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center"><AlertTriangle size={18} className="text-red-400" /></div>
              <div><h3 className="text-base font-bold text-white">Delete Testimonial</h3><p className="text-xs text-white/40">This cannot be undone.</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center text-sm py-2.5">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 id='confirm-delete-testimonial'">
                <Trash2 size={14} />Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
