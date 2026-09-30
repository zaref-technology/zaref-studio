'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service } from '@/types';
import AdminTopBar from '@/components/admin/AdminTopBar';
import { Plus, Edit2, Trash2, Save, X, AlertTriangle, CheckCircle } from 'lucide-react';

const iconOptions = ['Video', 'Film', 'Bot', 'Share2', 'Megaphone', 'MessageSquare', 'Camera', 'Zap'];

const emptyService: Partial<Service> = {
  number: '', title: '', shortDescription: '', description: '',
  icon: 'Video', featured: false, enabled: true, displayOrder: 1,
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchServices = async () => {
    try {
      const q = query(collection(db, 'services'), orderBy('displayOrder', 'asc'));
      const snap = await getDocs(q);
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Service)));
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSave = async () => {
    if (!editing?.title) { showToast('error', 'Title is required.'); return; }
    setSaving(true);
    try {
      const data = { ...editing, updatedAt: serverTimestamp() };
      delete (data as any).id;
      if (isNew) {
        await addDoc(collection(db, 'services'), { ...data, createdAt: serverTimestamp() });
        showToast('success', 'Service added!');
      } else {
        await updateDoc(doc(db, 'services', editing.id!), data);
        showToast('success', 'Service updated!');
      }
      setEditing(null);
      setIsNew(false);
      fetchServices();
    } catch (err: any) {
      showToast('error', 'Save failed: ' + err.message);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'services', id));
      setServices(prev => prev.filter(s => s.id !== id));
      showToast('success', 'Service deleted.');
    } catch { showToast('error', 'Delete failed.'); }
    setDeleteId(null);
  };

  const handleToggleEnabled = async (service: Service) => {
    try {
      await updateDoc(doc(db, 'services', service.id!), { enabled: !service.enabled });
      setServices(prev => prev.map(s => s.id === service.id ? { ...s, enabled: !s.enabled } : s));
    } catch { showToast('error', 'Update failed.'); }
  };

  return (
    <>
      <AdminTopBar title="Services" />
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Services</h2>
            <p className="text-xs text-white/30">{services.length} services configured</p>
          </div>
          <button
            onClick={() => { setEditing({ ...emptyService, displayOrder: services.length + 1 }); setIsNew(true); }}
            className="btn-orange text-sm py-2 px-4"
            id="admin-add-service-btn"
          >
            <Plus size={15} />
            Add Service
          </button>
        </div>

        {/* Services list */}
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-lg shimmer" />)}</div>
        ) : (
          <div className="bg-[#111] border border-white/[0.07] rounded-xl overflow-hidden">
            {services.length === 0 ? (
              <div className="text-center py-16 text-white/30">
                <p className="mb-4">No services yet. Add your first service.</p>
                <button onClick={() => { setEditing({ ...emptyService }); setIsNew(true); }} className="btn-orange text-sm">
                  <Plus size={14} />Add Service
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-5 py-3">#</th>
                    <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3">Service</th>
                    <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Order</th>
                    <th className="text-left text-[11px] font-semibold text-white/30 uppercase tracking-wider px-4 py-3">Status</th>
                    <th className="text-right text-[11px] font-semibold text-white/30 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {services.map((service) => (
                    <tr key={service.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-mono text-white/30">{service.number || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-medium text-white">{service.title}</div>
                        <div className="text-xs text-white/30 mt-0.5 line-clamp-1">{service.shortDescription}</div>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-white/40">{service.displayOrder}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleEnabled(service)}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium border transition-all ${
                            service.enabled
                              ? 'bg-green-500/10 text-green-400 border-green-500/20'
                              : 'bg-white/[0.05] text-white/30 border-white/10'
                          }`}
                        >
                          {service.enabled ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => { setEditing({ ...service }); setIsNew(false); }}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteId(service.id!)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/[0.08] transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {toast && (
          <div className={`toast flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
            toast.type === 'success' ? 'bg-green-500/15 border border-green-500/30 text-green-400' : 'bg-red-500/15 border border-red-500/30 text-red-400'
          }`}>
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
              <h3 className="text-base font-bold text-white">{isNew ? 'Add Service' : 'Edit Service'}</h3>
              <button onClick={() => setEditing(null)} className="text-white/30 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Service Number</label>
                  <input
                    type="text"
                    value={editing.number || ''}
                    onChange={e => setEditing(prev => ({ ...prev!, number: e.target.value }))}
                    placeholder="01"
                    className="input-dark text-sm py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/40 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={editing.displayOrder || 1}
                    onChange={e => setEditing(prev => ({ ...prev!, displayOrder: Number(e.target.value) }))}
                    className="input-dark text-sm py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={editing.title || ''}
                  onChange={e => setEditing(prev => ({ ...prev!, title: e.target.value }))}
                  placeholder="Service title"
                  className="input-dark text-sm py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Icon</label>
                <select
                  value={editing.icon || 'Video'}
                  onChange={e => setEditing(prev => ({ ...prev!, icon: e.target.value }))}
                  className="input-dark text-sm py-2 appearance-none"
                >
                  {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Short Description</label>
                <input
                  type="text"
                  value={editing.shortDescription || ''}
                  onChange={e => setEditing(prev => ({ ...prev!, shortDescription: e.target.value }))}
                  placeholder="Brief description for cards"
                  className="input-dark text-sm py-2"
                />
              </div>
              <div>
                <label className="block text-xs text-white/40 mb-1.5">Full Description</label>
                <textarea
                  value={editing.description || ''}
                  onChange={e => setEditing(prev => ({ ...prev!, description: e.target.value }))}
                  rows={4}
                  className="input-dark text-sm resize-none"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.enabled ?? true}
                    onChange={e => setEditing(prev => ({ ...prev!, enabled: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-white/60">Enabled</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.featured ?? false}
                    onChange={e => setEditing(prev => ({ ...prev!, featured: e.target.checked }))}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-white/60">Featured</span>
                </label>
              </div>
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

      {/* Delete modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative glass rounded-2xl p-6 w-full max-w-sm border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Service</h3>
                <p className="text-xs text-white/40">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1 justify-center text-sm py-2.5">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Trash2 size={14} />Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
